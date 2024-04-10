import {
  CodeEditor,
  Container,
  Control,
  ControlElement,
  customElements,
  IDataSchema,
  IdUtils,
  IUISchema,
  Module,
  Panel,
  Tab,
  Tabs,
} from '@ijstech/components'
import { blockStyle, codeTabsStyle } from './index.css'
import { IComponent, IFileHandler, IIPFSData, IStudio } from './interface'
import { ScomDesignerForm } from './designer'
import * as Dts from './types/index'
import { Compiler, Parser } from '@ijstech/compiler'
import { extractFileName, getFileContent } from './helpers/utils'

type onSaveCallback = (path: string, content: string) => void;

interface ScomDesignerElement extends ControlElement {
  url?: string;
  onSave?: onSaveCallback;
  onChanged?: (value: string) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-designer']: ScomDesignerElement
    }
  }
}

interface IDesigner {
  url: string;
}

@customElements('i-scom-designer')
export class ScomDesigner extends Module implements IFileHandler, IStudio {
  private designTabs: Tabs
  private formDesigner: ScomDesignerForm
  private codeEditor: CodeEditor
  private pnlMessage: Panel
  private compiler: Compiler

  private contentChangeTimer: any
  private _data: IDesigner = {
    url: ''
  }
  private updateDesigner: boolean = true

  onSave: onSaveCallback
  onChanged?: (value: string) => void
  tag: any = {}

  addEventHandler(
    designer: ScomDesignerForm,
    eventName: string,
    funcName: string
  ): void {
    let control = designer.selectedControl?.control
    let fileName = this.fileName
    let editor = this.codeEditor
    let code = this.updateDesignerCode(fileName, true)
    this.compiler.updateFile(fileName, code)
    let propInfo = control._getCustomProperties()
    let params = ''
    let classNames = [propInfo.className]
    let event = propInfo.events[eventName]
    if (event) {
      event.forEach((param: any) => {
        if (param.isControl) classNames.push(param.type)
        if (params) params = params + ', '
        params = params + param.name + ': ' + param.type
      })
    }

    let result = this.compiler.addEventHandler(
      fileName,
      classNames,
      funcName,
      params
    )
    this.codeEditor.focus()
    if (result && result.code) {
      this.compiler.updateFile(fileName, result.code)
      editor.value = result.code
      if (result.lineNumber)
        editor.setCursor(result.lineNumber, result.columnNumber)
    }
    this.designTabs.activeTabIndex = 0
  }
  locateMethod(designer: ScomDesignerForm, funcName: string): void {
    let fileName = this.fileName
    let result = this.compiler.locateMethod(fileName, funcName)
    this.designTabs.activeTabIndex = 0
    this.codeEditor.focus()
    this.codeEditor.setCursor(result.lineNumber, result.columnNumber)
  }
  removeComponent(designer: ScomDesignerForm): void {}
  renameComponent(
    designer: ScomDesignerForm,
    oldId: string,
    newId: string
  ): boolean {
    let control = designer.selectedControl?.control
    let fileName = this.fileName
    let code = this.updateDesignerCode(fileName, true)
    this.compiler.updateFile(fileName, code)
    let propInfo = control._getCustomProperties()
    let result = this.compiler.renameComponent(
      fileName,
      propInfo.className,
      oldId,
      newId
    )
    this.compiler.updateFile(fileName, result)
    this.codeEditor.value = result
    return true
  }
  renameEventHandler(
    designer: ScomDesignerForm,
    funcName: string,
    newFuncName: string
  ): boolean {
    let fileName = this.fileName
    let code = this.updateDesignerCode(fileName, true)
    this.compiler.updateFile(fileName, code)
    let result = this.compiler.renameMethod(fileName, funcName, newFuncName)
    this.compiler.updateFile(fileName, result)
    this.codeEditor.value = result
    return true
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options)
  }

  static async create(options?: ScomDesignerElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get url(): string {
    return this._data.url;
  }
  set url(value: string) {
    this._data.url = value;
  }

  get fileName() {
    const name = this.url ? extractFileName(this.url) : '';
    return name || 'File name'
  }

  get value() {
    return this.codeEditor?.value || ''
  }

  private async setData(value: IDesigner) {
    this._data = value;
    await this.renderUI();
  }

  private getData() {
    return this._data
  }

  setValue(url: string) {
    this.setData({ url })
  }

  private async renderUI() {
    this.formDesigner.studio = this;
    const { url = '' } = this._data
    const content = url ? await getFileContent(url) : ''
    const fileName = this.fileName
    await this.codeEditor.loadContent(content, 'typescript', fileName)
    this.pnlMessage.visible = true
  }

  private addLib() {
    try {
      CodeEditor.addLib('@ijstech/components', Dts.components)
      if (!this.compiler) this.compiler = new Compiler()
      this.compiler.addPackage('@ijstech/components', {
        dts: { 'index.d.ts': Dts.components },
      })
    } catch {}
  }

  private handleTabChanged(target: Tabs, tab: Tab) {
    this.pnlMessage.visible = tab.id === 'codeTab';
    const fileName = this.fileName
    if (tab.id === 'designTab') {
      if (this.updateDesigner) {
        this.updateDesigner = false
        const code = this.codeEditor.value
        try {
          this.compiler.addFile(fileName, code)
          const ui = this.compiler.parseUI(fileName)
          this.formDesigner.renderUI(this.updateRoot(ui))
        } catch(error) {
          console.log(error)
        }
      }
    } else if (tab.id === 'codeTab') {
      this.updateDesignerCode(fileName)
    }
  }

  private updateRoot(root: Parser.IComponent) {
    if (root?.items?.length) {
      root.items = this.updatePath(root.items);
    }
    return {...root, path: IdUtils.generateUUID()} as IComponent;
  }

  private updatePath(items: Parser.IComponent[]) {
    return [...items].map((item) => {
      (item as IComponent).path = IdUtils.generateUUID();
      if (item.items?.length) {
        item.items = this.updatePath(item.items);
      }
      return item;
    })
  }

  private handleCodeEditorChange(target: CodeEditor, event: any) {
    this.updateDesigner = true;
    if (this.contentChangeTimer) clearTimeout(this.contentChangeTimer)
    this.contentChangeTimer = setTimeout(async () => {
      this.handleGetChangedFiles()
    }, 500)
    if (this.onChanged) this.onChanged(this.codeEditor.value)
  }

  private updateDesignerCode(fileName: string, modified?: boolean): string {
    if (modified || this.formDesigner?.modified) {
      let code = this.compiler.renderUI(
        fileName,
        'render',
        this.formDesigner.rootComponent
      )
      this.compiler.updateFile(fileName, code)
      this.codeEditor.value = code
      this.formDesigner.modified = false
      return code
    }
  }

  async handleGetChangedFiles() {
    // const diffFiles = await this.fileStorage.onGetDiff();
    // let tempFiles = {};
    // for (let diffFile of diffFiles) {
    //     const data = await diffFile.readText();
    //     tempFiles[diffFile.fullPath] = { content: data, action: diffFile.action };
    // }
    // ChangedFiles = Object.assign({}, tempFiles);
    // await this.loadChangedFiles();
  }

  async openFile(
    file: IIPFSData,
    endpoint: string,
    parentCid: string,
    parent: Control
  ) {
    parent.append(this)
    this.updateDesigner = true;
    const path = file.path.startsWith('/') ? file.path.slice(1) : file.path
    const mediaUrl = `${endpoint}/ipfs/${parentCid}/${path}`
    this.setData({ url: mediaUrl })
  }

  init() {
    super.init()
    this.onSave = this.getAttribute('onSave', true) || this.onSave
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged
    const url = this.getAttribute('url', true)
    if (url) this.setData({ url })
    this.addLib()
    this.classList.add(blockStyle)
  }

  // Configuration
  private updateTag(type: 'light' | 'dark', value: any) {
    this.tag[type] = this.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop)) this.tag[type][prop] = value[prop];
    }
  }

  private async setTag(value: any) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        if (prop === 'light' || prop === 'dark') this.updateTag(prop, newValue[prop]);
        else this.tag[prop] = newValue[prop];
      }
    }
    this.updateTheme();
  }

  private updateStyle(name: string, value: any) {
    value ? this.style.setProperty(name, value) : this.style.removeProperty(name);
  }

  private updateTheme() {
    const themeVar = document.body.style.getPropertyValue('--theme') ?? 'dark';
    this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
  }

  private getTag() {
    return this.tag;
  }

  getConfigurators() {
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: () => {
          return this._getActions();
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this),
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this),
      },
    ];
  }

  private _getActions() {
    const actions = [
      {
        name: 'Widget Settings',
        icon: 'edit',
        ...this.getWidgetSchemas(),
      },
    ];
    return actions;
  }

  private getWidgetSchemas(): any {
    const propertiesSchema: IDataSchema = {
      type: 'object',
      properties: {
        pt: {
          title: 'Top',
          type: 'number',
        },
        pb: {
          title: 'Bottom',
          type: 'number',
        },
        pl: {
          title: 'Left',
          type: 'number',
        },
        pr: {
          title: 'Right',
          type: 'number',
        },
        align: {
          type: 'string',
          title: 'Alignment',
          enum: ['left', 'center', 'right'],
        },
        maxWidth: {
          type: 'number',
        },
        link: {
          title: 'URL',
          type: 'string',
        },
      },
    };
    const themesSchema: IUISchema = {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Group',
              label: 'Padding (px)',
              elements: [
                {
                  type: 'VerticalLayout',
                  elements: [
                    {
                      type: 'HorizontalLayout',
                      elements: [
                        {
                          type: 'Control',
                          scope: '#/properties/pt',
                        },
                        {
                          type: 'Control',
                          scope: '#/properties/pb',
                        },
                        {
                          type: 'Control',
                          scope: '#/properties/pl',
                        },
                        {
                          type: 'Control',
                          scope: '#/properties/pr',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    return {
      userInputDataSchema: propertiesSchema,
      userInputUISchema: themesSchema,
    };
  }

  render() {
    return (
      <i-panel
        width={'100%'} height={'100%'}
        overflow={'hidden'}
        background={{ color: '#202020' }}
      >
        <i-tabs
          id="designTabs"
          class={codeTabsStyle}
          dock='fill'
          draggable={false}
          closable={false}
          onChanged={this.handleTabChanged}
        >
          <i-tab
            id="codeTab"
            caption='Code'
          >
            <i-code-editor
              id="codeEditor"
              dock='fill'
              onChange={this.handleCodeEditorChange.bind(this)}
            />
          </i-tab>
          <i-tab
            id="designTab"
            caption='Design'
          >
            <i-scom-designer--form
              id="formDesigner"
              dock='fill'
            />
          </i-tab>
        </i-tabs>
        <i-panel
          id='pnlMessage'
          resizer={true}
          dock='bottom'
          height={100}
          visible={false}
          padding={{ top: 5, bottom: 5 }}
          border={{
            top: {
              width: '1px',
              style: 'solid',
              color: 'rgba(255, 255, 255, 0.08)',
            },
          }}
        >
          <i-code-editor dock='fill'></i-code-editor>
        </i-panel>
      </i-panel>
    )
  }
}

import {
  application,
  Button,
  Container,
  Control,
  ControlElement,
  customElements,
  getCustomElements,
  HStack,
  IconName,
  IDataSchema,
  IdUtils,
  IUISchema,
  Module,
  VStack,
  Styles,
  Markdown
} from '@ijstech/components';
import { blockStyle, customActivedStyled } from './index.css'
import { IComponent, IFileHandler, IIPFSData, IStudio } from './interface'
import { ScomDesignerForm } from './designer'
import { Compiler, Parser, Types } from '@ijstech/compiler'
import { ScomCodeEditor, Monaco } from '@scom/scom-code-editor';
import { extractFileName, getFileContent } from './helpers/utils'
import { themesConfig } from './helpers/config';
import { mainJson } from './languages/index';
const Theme = Styles.Theme.ThemeVars;

type onSaveCallback = (target: ScomCodeEditor, event: any) => void;
type onChangeCallback = (target: ScomDesigner, event: Event) => void;
type onImportCallback = (fileName: string, isPackage?: boolean) => Promise<{ fileName: string, content: string } | null>;
type onClosePreviewCallback = () => void;
type onRenderErrorCallback = (errors: Types.ICompilerError[]) => void;

interface ScomDesignerElement extends ControlElement {
  url?: string;
  file?: {
    path: string;
    content: string;
  }
  baseUrl?: string;
  onSave?: onSaveCallback;
  onChange?: onChangeCallback;
  onPreview?: () => Promise<{ module: string, script: string }>;
  onTogglePreview?: (value: boolean) => void;
  onImportFile?: onImportCallback;
  onClosePreview?: onClosePreviewCallback;
  onRenderError?: onRenderErrorCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-designer']: ScomDesignerElement
    }
  }
}

interface IFileData {
  path: string;
  content: string;
}

interface IDesigner {
  url?: string;
  file?: IFileData;
  baseUrl?: string;
}

@customElements('i-scom-designer')
export class ScomDesigner extends Module implements IFileHandler, IStudio {
  private formDesigner: ScomDesignerForm
  private codeEditor: ScomCodeEditor
  private compiler: Compiler
  private pnlMain: VStack;
  private codeTab: Button;
  private designTab: Button;
  private pnlHeader: HStack;

  private _data: IDesigner = {
    url: '',
    file: {
      path: '',
      content: ''
    },
    baseUrl: ''
  };
  private updateDesigner: boolean = true;
  private _components = getCustomElements();
  private _previewUrl: string;
  private imported: Record<string, string> = {};
  private activeTab: string = 'codeTab';
  private mode: string = '';

  onSave: onSaveCallback;
  onChange?: onChangeCallback;
  onPreview?: () => Promise<{ module: string, script: string }>;
  onImportFile?: onImportCallback;
  onTogglePreview?: (value: boolean) => void;
  onClosePreview?: onClosePreviewCallback;
  onRenderError?: onRenderErrorCallback;
  tag: any = {}

  set previewUrl(url: string) {
    this._previewUrl = url;
    if (this.formDesigner)
      this.formDesigner.previewUrl = url;
  }

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
        if (param.isControl && param.type !== propInfo.className) classNames.push(param.type)
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
    this.resetTab();
  }
  locateMethod(designer: ScomDesignerForm, funcName: string): void {
    let fileName = this.fileName
    let result = this.compiler.locateMethod(fileName, funcName)
    this.resetTab();
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
  async registerWidget(designer: ScomDesignerForm, name: string, type: string) {
    ScomCodeEditor.addLib(name, type)
    await this.compiler.addPackage(name, { dts: { 'index.d.ts': type } });
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.importCallback = this.importCallback.bind(this);
    this.handleDesignerPreview = this.handleDesignerPreview.bind(this);
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

  get file(): IFileData {
    return this._data.file;
  }
  set file(value: IFileData) {
    this._data.file = value;
  }

  get fileName() {
    const name = this._data.file?.path || (this.url ? extractFileName(this.url) : '');
    return name || 'file_name';
  }

  get value() {
    return this.codeEditor?.value || ''
  }

  get baseUrl() {
    return this._data.baseUrl ?? ''
  }

  set baseUrl(value: string) {
    this._data.baseUrl = value ?? ''
  }

  private async setData(value: IDesigner) {
    this._data = value;
    await this.renderUI();
  }

  private getData() {
    return this._data
  }

  async setValue(value: IDesigner) {
    await this.setData(value);
  }

  getErrors(): Monaco.editor.IMarker[] {
    return this.codeEditor?.getErrors();
  }

  updateFileName(oldValue: string, newValue: string) {
    if (typeof this.codeEditor?.updateFileName === 'function')
      this.codeEditor.updateFileName(oldValue, newValue);
  }

  dispose() {
    if (this.codeEditor) {
      if (typeof this.codeEditor?.dispose === 'function') {
        this.codeEditor.dispose();
      }
    }
    if (this.formDesigner) {
      this.formDesigner.onHide();
    }
  }

  disposeEditor() {
    if (this.codeEditor) {
      this.codeEditor.onChange = null;
      this.codeEditor.onKeyDown = null;
      if (typeof this.codeEditor?.dispose === 'function') {
        this.codeEditor.dispose();
        this.codeEditor.remove();
      }
    }
    if (this.formDesigner) {
      this.formDesigner.studio = null;
      this.formDesigner.onPreview = null;
      this.formDesigner.onHide();
      this.formDesigner.remove();
    }
  }

  saveViewState(): any {
    return this.codeEditor ? this.codeEditor.saveViewState() : null;
  }
 
  restoreViewState(state: any) {
    if (this.codeEditor) {
      this.codeEditor.restoreViewState(state);
    }
  }

  private async renderUI() {
    this.activeTab = 'codeTab';
    this.updateDesigner = !!(this.url || this.file?.path);
    await this.renderContent(true);
  }

  private async renderContent(init = false) {
    const isTsx = this.file?.path?.endsWith('.tsx');
    if (this.activeTab === 'codeTab' && !this.codeEditor) {
      this.createCodeEditor();
    } else if (this.activeTab === 'designTab' && !this.formDesigner) {
      this.createFormDesigner();
    }

    if (this.formDesigner) {
      this.formDesigner.visible = this.activeTab === 'designTab';
      this.formDesigner.baseUrl = this.baseUrl;
    }
    if (this.codeEditor)
      this.codeEditor.visible = this.activeTab === 'codeTab';
    if (init && !!(this.url || this.file?.path)) {
      this.loadContent();
    }
    this.updateButtons();
    this.designTab.enabled = isTsx;
  }

  private createCodeEditor() {
    const themeVar = document.body.style.getPropertyValue('--theme') || 'dark';
    this.codeEditor = this.createElement('i-scom-code-editor', this.pnlMain) as ScomCodeEditor;
    this.codeEditor.width = '100%';
    this.codeEditor.height = '100%';
    this.codeEditor.stack = {grow: '1'};
    this.codeEditor.theme = themeVar as any;
    this.codeEditor.id = 'codeEditor';
    this.codeEditor.onChange = this.handleCodeEditorChange.bind(this);
    this.codeEditor.onKeyDown = this.handleCodeEditorSave.bind(this);
  }

  private createFormDesigner() {
    const isTsx = this.file?.path?.endsWith('.tsx');
    this.formDesigner = this.createElement('i-scom-designer--form', this.pnlMain) as ScomDesignerForm;
    this.formDesigner.width = '100%';
    this.formDesigner.height = '100%';
    this.formDesigner.stack = {grow: '1'};
    this.formDesigner.previewUrl = this._previewUrl;
    this.formDesigner.onPreview = this.handleDesignerPreview;
    this.formDesigner.onTogglePreview = this.handleTogglePanels.bind(this);
    this.formDesigner.onClose = () => {
      typeof this.onClosePreview === 'function' && this.onClosePreview();
    };
    this.formDesigner.studio = this;
    this.formDesigner.visible = isTsx;
  }

  private handleTogglePanels(value: boolean) {
    this.pnlHeader.visible = !value;
    if (typeof this.onTogglePreview === 'function')
      this.onTogglePreview(value);
  }

  private async loadContent() {
    const { url = '', file } = this._data
    const content = url ? await getFileContent(url) : file?.content || '';
    const fileName = this.fileName;
    await this.codeEditor.loadContent(content, 'typescript', fileName);
    this.compiler.addFile(fileName, content, this.importCallback);
  }

  private resetTab() {
    this.activeTab = 'codeTab';
    this.formDesigner.visible = false;
    this.codeEditor.visible = true;
    this.updateButtons();
  }

  private updateButtons() {
    if (this.activeTab === 'codeTab') {
      this.codeTab.classList.add(customActivedStyled);
      this.designTab.classList.remove(customActivedStyled);
    } else {
      this.codeTab.classList.remove(customActivedStyled);
      this.designTab.classList.add(customActivedStyled);
    }
  }

  private async addLib() {
    if (!this.compiler) this.compiler = new Compiler()
    const content = await application.getContent(`${application.rootDir}libs/@ijstech/components/index.d.ts`);
    await this.compiler.addPackage('@ijstech/components', { dts: { 'index.d.ts': content } });
    ScomCodeEditor.addLib('@ijstech/components', content);
  }

  private async importCallback(fileName: string, isPackage?: boolean) {
    if (this.imported[fileName]) {
      return this.imported[fileName];
    }
    let result: any = null;
    if (typeof this.onImportFile === 'function') {
      result = await this.onImportFile(fileName, isPackage);
      if (result) {
        // if (fileName === '@ijstech/compiler') {
        //   result.content = `
        //     declare module '${fileName}' {
        //       ${result.content}
        //     } \n
        //   `;
        // }
        const importedName = isPackage ? fileName : result.fileName;
        const isDependency = isPackage && result?.fileName === 'index.d.ts';
        if (isDependency) this.imported[importedName] = result.content || '';
        if (isPackage) {
          if (result.fileName.endsWith('index.d.ts')) {
            ScomCodeEditor.addLib(fileName, result.content);
          } else {
            ScomCodeEditor.addLib(result.fileName, result.content);
          }
          await this.compiler.addPackage(fileName, { dts: { 'index.d.ts': result.content } });
        } else {
          ScomCodeEditor.addFile(importedName, result.content);
          await this.compiler.addFile(importedName, result.content);
        }
      }
    }
    return result;
  }

  private async handleTabChanged(target: Button) {
    this.activeTab = target.id;
    const fileName = this.fileName;
    await this.renderContent();
    if (target.id === 'designTab') {
      if (this.updateDesigner) {
        this.updateDesigner = false
        try {
          await this.compiler.addFile(fileName, this.codeEditor.value, this.importCallback);
          const ui = this.compiler.parseUI(fileName)
          this.formDesigner.renderUI(this.updateRoot(ui))
        } catch (error) {
          this.updateDesigner = true
        }
      }
    } else if (target.id === 'codeTab') {
      this.updateDesignerCode(fileName)
    }
  }

  private updateRoot(root: Parser.IComponent) {
    if (!root) {
      root = {
        name: 'i-panel',
        props: {
          width: '{100%}',
          minHeight: '{100%}'
        },
        items: []
      }
    }
    (root as IComponent).path = IdUtils.generateUUID();
    (root as IComponent).icon = (this._components['i-panel']?.icon || '') as IconName;
    if (!root.items) root.items = [];
    if (root.items.length) {
      root.items = this.updatePath(root.items, root as IComponent);
    }
    return { ...root } as IComponent;
  }

  private updatePath(items: Parser.IComponent[], parent: IComponent) {
    return [...items].map((item) => {
      const component = item as IComponent;
      component.path = IdUtils.generateUUID();
      component.parent = parent.path;
      component.repeater = parent?.name === 'i-repeater' ? parent.path : (parent?.repeater || '');
      component.icon = (this._components[component.name]?.icon || '') as IconName;
      if (!component.items) component.items = [];
      if (component.items.length) {
        component.items = this.updatePath(component.items, component);
      }
      return component;
    })
  }

  private handleCodeEditorChange(target: ScomCodeEditor, event: Event) {
    this.updateDesigner = true;
    this.imported = {};
    if (typeof this.onChange === 'function') this.onChange(this, event)
  }

  private handleCodeEditorSave(target: ScomCodeEditor, event: KeyboardEvent) {
    if (event.code === 'KeyS' && event.ctrlKey) {
      event.stopPropagation();
      event.preventDefault();
      if (typeof this.onSave === 'function') this.onSave(target, event);
    }
  }

  async getImportFile(fileName?: string, isPackage?: boolean): Promise<{ fileName: string, content: string }> {
    if (isPackage) {
      const content = await application.getContent(`${application.rootDir}libs/${fileName}/index.d.ts`) || this.imported[fileName];
      return {
        fileName: 'index.d.ts',
        content
      }
    }
    else {
      return await this.getFile(fileName);
    }
  };

  private async getFile(fileName: string): Promise<{ fileName: string, content: string } | null> {
    if (typeof this.onImportFile === 'function') {
      return await this.onImportFile(fileName, false);
    }
    return null;
  }

  private async handleDesignerPreview(): Promise<{ module: string, script: string }> {
    if (this.updateDesigner) this.updateDesignerCode(this.fileName, true)
    if (typeof this.onPreview === 'function')
      return await this.onPreview()
    else {
      let value = `///<amd-module name='@scom/debug-module'/> \n` + this.value;
      const fileName = this.fileName || 'index.tsx';
      if (value) {
        let compiler = new Compiler()
        await compiler.addFile(
          fileName,
          value,
          this.getImportFile.bind(this)
        );
        let result = await compiler.compile(true)
        if (result.errors?.length > 0) {
          console.error(result.errors);
          if (typeof this.onRenderError === 'function')
            this.onRenderError(result.errors)
          return null;
        }
        return {
          module: '@scom/debug-module',
          script: result?.script['index.js']
        };
      }
    }
  }

  private updateDesignerCode(fileName: string, modified?: boolean): string {
    if (modified || this.formDesigner?.modified) {
      const root = this.formDesigner.rootComponent;
      let code = this.compiler.renderUI(
        fileName,
        'render',
        root
      )
      this.compiler.updateFile(fileName, code)
      this.codeEditor.value = code
      this.formDesigner.modified = false
      return code
    }
  }

  async openFile(
    file: IIPFSData,
    parentCid: string,
    parent: Control,
    config: any
  ) {
    parent.append(this)
    this.updateDesigner = true;
    const path = file.path.startsWith('/') ? file.path.slice(1) : file.path
    const endpoint = config?.transportEndpoint || '';
    const mediaUrl = `${endpoint}/ipfs/${parentCid}/${path}`
    this.setData({ url: mediaUrl })
  }

  clear() {
    this.imported = {};
    this.compiler = new Compiler();
    this.activeTab = 'codeTab';
    if (this.formDesigner) this.formDesigner.clear();
    if (this.mode === 'preview') this.formDesigner.closePreview();
  }

  init() {
    this.i18n.init({...mainJson});
    super.init()
    this.onSave = this.getAttribute('onSave', true) || this.onSave
    this.onChange = this.getAttribute('onChange', true) || this.onChange
    this.onImportFile = this.getAttribute('onImportFile', true) || this.onImportFile
    this.onTogglePreview = this.getAttribute('onTogglePreview', true) || this.onTogglePreview
    this.onClosePreview = this.getAttribute('onClosePreview', true) || this.onClosePreview
    this.onRenderError = this.getAttribute('onRenderError', true) || this.onRenderError
    const url = this.getAttribute('url', true)
    const file = this.getAttribute('file', true)
    this.addLib()
    this.setData({ url, file });
    this.classList.add(blockStyle);
    this.setTag(themesConfig)
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

  async renderMode(mode: string) {
    this.mode = mode;
    if (mode === 'preview') {
      if (this.activeTab !== 'designTab')
        await this.handleTabChanged(this.designTab);
      this.formDesigner.preview();
    } else if (mode === 'designer') {
      if (this.activeTab !== 'designTab')
        await this.handleTabChanged(this.designTab);
      this.formDesigner.design();
    } else if (mode === 'code') {
      if (this.activeTab !== 'codeTab')
        await this.handleTabChanged(this.codeTab);
    }
  }

  private updateTheme() {
    const themeVar = document.body.style.getPropertyValue('--theme') || 'dark';
    this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
    this.updateStyle('--colors-secondary-main', this.tag[themeVar]?.secondaryColor);
    this.updateStyle('--background-default', this.tag[themeVar]?.wrapperBgColor);
    this.updateStyle('--action-active_background', this.tag[themeVar]?.actionBgColor);
    this.updateStyle('--action-active', this.tag[themeVar]?.actionFontColor);
    this.updateStyle('--input-background', this.tag[themeVar]?.inputBgColor);
    this.updateStyle('--input-font_color', this.tag[themeVar]?.inputFontColor);
    this.updateStyle('--background-paper', this.tag[themeVar]?.paperBgColor);
    this.updateStyle('--divider', this.tag[themeVar]?.divider);
    this.updateStyle('--action-selected_background', this.tag[themeVar]?.selectedBackground);
    this.updateStyle('--action-selected', this.tag[themeVar]?.selected);
    if (this.codeEditor) {
      this.codeEditor.theme = themeVar as Markdown['theme'];
    }
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
      <i-vstack
        width={'100%'} height={'100%'}
        overflow={'hidden'}
        position='relative'
        background={{ color: Theme.background.default }}
      >
        <i-hstack
          verticalAlignment='center'
          stack={{ shrink: '0' }}
          id="pnlHeader"
          mediaQueries={[
            {
              maxWidth: '767px',
              properties: {
                visible: false
              }
            }
          ]}
        >
          <i-button
            id="codeTab"
            caption='$code'
            padding={{top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem'}}
            background={{color: Theme.action.activeBackground}}
            stack={{ shrink: '0' }}
            border={{width: '1px', style: 'solid', color: Theme.action.activeBackground, radius: 0}}
            boxShadow='none'
            font={{color: Theme.action.active}}
            minHeight={'2.25rem'}
            onClick={this.handleTabChanged}
          ></i-button>
          <i-button
            id="designTab"
            caption='$design'
            stack={{ shrink: '0' }}
            padding={{top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem'}}
            background={{color: Theme.action.activeBackground}}
            border={{width: '1px', style: 'solid', color: Theme.action.activeBackground, radius: 0}}
            boxShadow='none'
            minHeight={'2.25rem'}
            font={{color: Theme.action.active}}
            onClick={this.handleTabChanged}
          ></i-button>
        </i-hstack>
        <i-vstack id="pnlMain" maxHeight={'100%'} overflow={'hidden'} stack={{ 'grow': '1' }}></i-vstack>
      </i-vstack>
    )
  }
}

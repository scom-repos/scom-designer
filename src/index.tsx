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
  IdUtils,
  Module,
  VStack,
  Styles,
  Markdown
} from '@ijstech/components';
import { blockStyle, customActivedStyled } from './index.css'
import { ActionType, IComponent, IControl, IDeployConfig, IFileData, IFileHandler, IIPFSData, IStudio, ITheme } from './interface'
import { ScomDesignerDeployer } from './deployer'
import { Compiler, Parser, Types } from '@ijstech/compiler'
import { ScomCodeEditor, Monaco, getLanguageType } from '@scom/scom-code-editor';
import { debounce, extractFileName, getFileContent } from './helpers/utils'
import { pageWidgets, themesConfig } from './helpers/config';
import { mainJson } from './languages/index';
import { parseMD, renderMd, ScomDesignerForm, template } from './designer/index';
import { getWidgetSchemas } from './schema';

const Theme = Styles.Theme.ThemeVars;

type onSaveCallback = (target: ScomCodeEditor, event: any) => void;
type onChangeCallback = (target: ScomDesigner, event: Event) => void;
type onImportCallback = (fileName: string, isPackage?: boolean) => Promise<{ fileName: string, content: string } | null>;
type onClosePreviewCallback = () => void;
type onRenderErrorCallback = (errors: Types.ICompilerError[]) => void;
type onSelectedWidgetCallback = (path: string, md: string, { startLine, endLine }: { startLine: number|string, endLine: number|string }, fromDesigner: boolean) => void;
type onAddControlCallback = (control: IControl, selectedData: { path: string, md: string, lines: { startLine: number|string, endLine: number|string } }) => Promise<void>;

interface ScomDesignerElement extends ControlElement {
  url?: string;
  file?: {
    path: string;
    content: string;
  }
  baseUrl?: string;
  dataUrl?: string;
  deployConfig?: IDeployConfig;
  selectedType?: ActionType;
  isPreviewDefault?: boolean;
  themes?: ITheme;
  onSave?: onSaveCallback;
  onChange?: onChangeCallback;
  onPreview?: () => Promise<{ module: string, script: string }>;
  onTogglePreview?: (value: boolean) => void;
  onImportFile?: onImportCallback;
  onClosePreview?: onClosePreviewCallback;
  onRenderError?: onRenderErrorCallback;
  onSelectedWidget?: onSelectedWidgetCallback;
  onAddControl?: onAddControlCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-designer']: ScomDesignerElement
    }
  }
}

interface IDesigner {
  url?: string;
  file?: IFileData;
  baseUrl?: string;
  dataUrl?: string;
}

@customElements('i-scom-designer')
export class ScomDesigner extends Module implements IFileHandler, IStudio {
  private formDesigner: ScomDesignerForm
  private codeEditor: ScomCodeEditor
  private deployDeployer: ScomDesignerDeployer
  private compiler: Compiler
  private pnlMain: VStack;
  private codeTab: Button;
  private designTab: Button;
  private deployTab: Button;
  private pnlHeader: HStack;

  private _data: IDesigner = {
    url: '',
    file: {
      path: '',
      content: ''
    },
    baseUrl: '',
    dataUrl: ''
  };

  private _isPreviewDefault: boolean = false;
  private _selectedType: ActionType = 'click';

  private updateDesigner: boolean = true;
  private _components = getCustomElements();
  private _previewUrl: string;
  private imported: Record<string, string> = {};
  private activeTab: string = 'codeTab';
  private mode: string = '';
  private _deployConfig: IDeployConfig;
  private tempTsxPath: string = 'demo.tsx';
  private tempTsxContent: string = '';
  private isWidgetsLoaded: boolean = false;
  private _selectedWidget: { startLine: number|string, endLine: number|string, md: string } = null;
  private _positions: Set<number> = new Set();
  private _oldLines: {startLine: number|string, endLine: number|string }[] = [];
  private _chatWidget: any = null;
  private _themes: ITheme;
  private _isPickerInit: boolean = false;
  private _isChatWidgetInit: boolean = false;

  private handleSelectionChangeBound: (target: ScomCodeEditor, event: any) => void;

  onSave: onSaveCallback;
  onChange?: onChangeCallback;
  onPreview?: () => Promise<{ module: string, script: string }>;
  onImportFile?: onImportCallback;
  onTogglePreview?: (value: boolean) => void;
  onClosePreview?: onClosePreviewCallback;
  onRenderError?: onRenderErrorCallback;
  onSelectedWidget?: onSelectedWidgetCallback;
  onAddControl?: onAddControlCallback;
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
    let fileName = this.isTsx ? this.fileName : this.tempTsxPath;
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
    if (result?.code) {
      this.compiler.updateFile(fileName, result.code)
      if (this.isTsx) {
        editor.value = result.code
        if (result.lineNumber)
          editor.setCursor(result.lineNumber, result.columnNumber)
        }
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
    let fileName = this.isTsx ? this.fileName : this.tempTsxPath;
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
    if (this.isTsx) this.codeEditor.value = result
    return true
  }
  renameEventHandler(
    designer: ScomDesignerForm,
    funcName: string,
    newFuncName: string
  ): boolean {
    let fileName = this.isTsx ? this.fileName : this.tempTsxPath;
    let code = this.updateDesignerCode(fileName, true)
    this.compiler.updateFile(fileName, code)
    let result = this.compiler.renameMethod(fileName, funcName, newFuncName)
    this.compiler.updateFile(fileName, result)
    if (this.isTsx) this.codeEditor.value = result
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
    this.getImportFile = this.getImportFile.bind(this);
    this.handleSelectionChangeBound = this.handleCodeEditorSelectionChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
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

  get previewedValue() {
    return this.tempTsxContent || this.value;
  }

  get previewedFileName() {
    return this.tempTsxPath || this.fileName || 'index.tsx';
  }

  get baseUrl() {
    return this._data.baseUrl ?? ''
  }

  set baseUrl(value: string) {
    this._data.baseUrl = value ?? ''
  }

  get dataUrl() {
    return this._data.dataUrl ?? ''
  }

  set dataUrl(value: string) {
    this._data.dataUrl = value ?? ''
  }

  get deployConfig() {
    return this._deployConfig;
  }

  set deployConfig(value: IDeployConfig) {
    this._deployConfig = value;
    if (this.deployDeployer) {
      this.deployDeployer.setConfig(value);
    }
  }

  get selectedType() {
    return this._selectedType;
  }

  set selectedType(value: ActionType) {
    this._selectedType = value;
    if (this.formDesigner) {
      this.formDesigner.selectedType = this.selectedType;
    }
  }

  get isPreviewDefault() {
    return this._isPreviewDefault ?? false;
  }

  set isPreviewDefault(value: boolean) {
    this._isPreviewDefault = value ?? false;
    if (this.formDesigner) {
      this.formDesigner.isPreviewDefault = this.isPreviewDefault;
    }
  }

  get themes() {
    return this._themes;
  }

  set themes(value: ITheme) {
    this._themes = value;
    if (this.formDesigner) {
      this.formDesigner.themes = this.themes;
    }
  }

  get isValid() {
    return this.file?.path?.endsWith('.tsx') || this.url?.endsWith('.tsx') || this.file?.path?.endsWith('.md') || this.url?.endsWith('.md');
  }

  get isTsx() {
    return this.file?.path?.endsWith('.tsx') || this.url?.endsWith('.tsx');
  }

  get isWidgetMD() {
    return !this.isTsx && this.value.includes('@scom/page-block')
  }

  private get isContract() {
    return this.file?.path?.endsWith('.tact') || this.url?.endsWith('.tact');
  }

  private async setData(value: IDesigner) {
    this._data = value;
    await this.renderUI();
    if (this.isWidgetMD && !this._isChatWidgetInit) {
      this._isChatWidgetInit = true;
      this.updateAddToChatWidget();
      this.codeEditor.addWidget(this._chatWidget);
    }
  }

  private getData() {
    return this._data
  }

  public async setValue(value: IDesigner) {
    await this.setData(value);
  }

  public toggleLoading(value: boolean) {
    this.formDesigner?.toggleLoading(value);
  }

  public async reloadDesigner(value?: IDesigner, needDesignerShown = false) {
    this.formDesigner?.toggleLoading(true);
    try {
      if (value) {
        this._data = {...this._data, ...value};
        await this.loadContent();
      }

      if (this.activeTab === 'designTab')
        await this.renderDesigner();
      else if (needDesignerShown)
        await this.handleTabChanged(this.designTab);
    } catch(error) {
      console.error('Error reloading designer:', error);
    }
    this.formDesigner?.toggleLoading(false);
  }

  public renderMD(event?: Event) {
    if (!this.isWidgetMD) return;
    const md = this.getUpdatedMd();
    this.codeEditor.value = md;
    if (typeof this.onChange === 'function') this.onChange(this, event);
  }

  public getErrors(): Monaco.editor.IMarker[] {
    return this.codeEditor?.getErrors();
  }

  public updateFileName(oldValue: string, newValue: string) {
    if (typeof this.codeEditor?.updateFileName === 'function')
      this.codeEditor.updateFileName(oldValue, newValue);
  }

  public dispose() {
    if (this.codeEditor) {
      if (typeof this.codeEditor?.dispose === 'function') {
        this.codeEditor.dispose();
      }
    }
    if (this.formDesigner) {
      this.formDesigner.onHide();
    }
  }

  public disposeEditor() {
    if (this.codeEditor) {
      this.codeEditor.onChange = null;
      this.codeEditor.onKeyDown = null;
      if (typeof this.codeEditor?.disposeEditor === 'function') {
        this.codeEditor.disposeEditor();
        this.codeEditor.remove();
      }
    }
    if (this.formDesigner) {
      this.formDesigner.studio = null;
      this.formDesigner.onPreview = null;
      this.formDesigner.onHide();
      this.formDesigner.remove();
    }
    document.removeEventListener('click', this.handleClick);
  }

  public saveViewState(): any {
    return this.codeEditor ? this.codeEditor.saveViewState() : null;
  }
 
  public restoreViewState(state: any) {
    if (this.codeEditor) {
      this.codeEditor.restoreViewState(state);
    }
  }

  public clearPositions() {
    this._positions.clear();
    this._oldLines = [];
  }

  private async renderUI() {
    this.activeTab = 'codeTab';
    this.deployTab.visible = this.isContract;
    this.designTab.visible = !this.isContract;
    this.updateDesigner = !!(this.url || this.file?.path);
    await this.renderContent(true);
  }

  private async renderContent(init = false) {
    if (this.activeTab === 'codeTab' && !this.codeEditor) {
      this.createCodeEditor();
    } else if (this.activeTab === 'designTab' && !this.formDesigner) {
      this.createFormDesigner();
    } else if (this.activeTab === 'deployTab' && !this.deployDeployer) {
      this.createDeployer();
    }

    if (this.formDesigner) {
      this.formDesigner.visible = this.activeTab === 'designTab';
      this.formDesigner.baseUrl = this.baseUrl;
      this.formDesigner.selectedType = this.selectedType;
      this.formDesigner.isPreviewDefault = this.isPreviewDefault;
    }

    if (this.codeEditor) {
      this.codeEditor.visible = this.activeTab === 'codeTab';
    }

    if (this.deployDeployer) {
      this.deployDeployer.visible = this.activeTab === 'deployTab';
    }

    if (init && !!(this.url || this.file?.path)) {
      await this.loadContent();
    }

    this.updateButtons();
    this.designTab.enabled = this.isValid;
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
    this.codeEditor.onSelectionChange = this.handleSelectionChangeBound;
  }

  public executeInsert(textBefore: string, textAfter: string) {
    return this.codeEditor.executeEditor('insert', { textBefore, textAfter });
  }

  private createFormDesigner() {
    this.formDesigner = this.createElement('i-scom-designer--form', this.pnlMain) as ScomDesignerForm;
    this.formDesigner.selectedType = this.selectedType;
    this.formDesigner.isPreviewDefault = this.isPreviewDefault;
    this.formDesigner.themes = this.themes;
    this.formDesigner.width = '100%';
    this.formDesigner.height = '100%';
    this.formDesigner.stack = {grow: '1'};
    this.formDesigner.previewUrl = this._previewUrl;
    this.formDesigner.onPreview = this.handleDesignerPreview;
    this.formDesigner.onTogglePreview = this.handleTogglePanels.bind(this);
    this.formDesigner.onClose = () => {
      typeof this.onClosePreview === 'function' && this.onClosePreview();
    };
    this.formDesigner.onSelectControl = () => {
      if (!this.isWidgetMD) return;
      this.updateMd();
    };
    this.formDesigner.onAddControl = async (control: IControl) => {
      const selectedWidget = this.updateSelection();
      const { startLine, endLine, md } = selectedWidget || {};
      const data = selectedWidget ? {path: this.file.path, md, lines: { startLine, endLine }} : null;
      typeof this.onAddControl === 'function' && this.onAddControl(control, data);
    }
    this.formDesigner.onDesignerChange = debounce(this.handleDesignerChange.bind(this), 500);
    this.formDesigner.studio = this;
    this.formDesigner.visible = this.isValid;
  }

  private updateSelection() {
    const root = this.formDesigner.rootComponent;

    const selectedPos = this.formDesigner.getSelectedPosition();
    let md: string = renderMd(root as IComponent, '', [selectedPos]);

    const regex = new RegExp(`\\{Line-[0-9]+-${selectedPos}\\}`, 'g');  
    const match = md.match(regex);
    const startLine = match?.[0]?.split('-')?.[1];
    const endLine = match?.[1]?.split('-')?.[1];

    md = md.replace(/(Line-[0-9]+)-[0-9]+/g, '$1');

    startLine && this._oldLines.push({ startLine, endLine });

    const _selectedWidget = selectedPos !== undefined ? { startLine, endLine, md } : null;
    
    return _selectedWidget ? {..._selectedWidget} : null;
  }

  private handleDesignerChange(target: ScomDesignerForm, event: Event) {
    this.renderMD(event);
  }

  private createDeployer() {
    this.deployDeployer = this.createElement('i-scom-designer--deployer', this.pnlMain) as ScomDesignerDeployer;
    this.deployDeployer.width = '100%';
    this.deployDeployer.height = '100%';
    this.deployDeployer.stack = {grow: '1'};
    if (this._deployConfig) this.deployDeployer.setConfig(this._deployConfig);
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

    await this.codeEditor.loadContent(content, getLanguageType(fileName), fileName);
    if (this.isTsx) {
      this.compiler.addFile(fileName, content, this.importCallback);
    }
  }

  private async loadPageWidgets() {
    if (this.isWidgetsLoaded) return;
    const promises = [];
    for (let packageName of pageWidgets) {
      promises.push(
        application.loadPackage(packageName)
      );
    }
    await Promise.all(promises);
  }

  private resetTab() {
    this.activeTab = 'codeTab';
    this.formDesigner.visible = false;
    this.deployDeployer.visible = false;
    this.codeEditor.visible = true;
    this.deployTab.visible = this.isContract;
    this.designTab.visible = !this.isContract;
    this.updateButtons();
  }

  private updateButtons() {
    const tabs = {
      codeTab: this.codeTab,
      designTab: this.designTab,
      deployTab: this.deployTab,
    };

    Object.entries(tabs).forEach(([tabName, tabElement]) => {
      if (tabName === this.activeTab) {
        tabElement.classList.add(customActivedStyled);
      } else {
        tabElement.classList.remove(customActivedStyled);
      }
    });
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
    if (target.id === this.activeTab) return;
    this.activeTab = target.id;
    const fileName = this.fileName;

    await this.renderContent();

    target.enabled = false;
    target.rightIcon.visible = true;

    try {
      if (target.id === 'designTab') {
        this.hideAddToChatWidget();
        this.codeEditor.editor?.setSelection({
          startLineNumber: 0,
          startColumn: 0,
          endLineNumber: 0,
          endColumn: 0
        });
        if (this.updateDesigner) {
          this.updateDesigner = false
          await this.renderDesigner();
          if (!this._isPickerInit) {
            this._isPickerInit = true;
            this.formDesigner.initComponentPicker();
          }
        }
      } else if (target.id === 'codeTab') {
        this.formDesigner.hideAddToChatWidget();
        this.updateDesignerCode(this.isTsx ? fileName : this.tempTsxPath);
        if (this.isWidgetMD) {
          const md = this.getUpdatedMd();
          const viewState = this.codeEditor.editor.saveViewState();
          this.codeEditor.value = md;
          if (viewState) {
            this.codeEditor.editor.restoreViewState(viewState);
          }
          this.codeEditor.editor.focus();
        }
      } else {
        this.deployDeployer.setData({
          path: this.fileName,
          content: this.value
        })
      }
    } catch (e) {
      console.error(e);
    }

    target.rightIcon.visible = false;
    target.enabled = true;
  }

  private async renderDesigner() {
    try {
      if (this.isTsx)
        await this.parseTsx(this.fileName);
      else {
        await this.parseMd(this.codeEditor.value);
      }
    } catch (error) {
      this.updateDesigner = true
    }
  }

  private getUpdatedMd(inSelected: boolean = false) {
    const root = this.formDesigner.rootComponent;

    if (!inSelected) {
      const positions = Array.from(this._positions);
      const md = renderMd(root as IComponent, '', positions);
      return md.replace(/\{SELECT_(\w+)\}/g, '').replace(/\{Line-[^}]+\}/g, '');
    }

    const selectedPos = this.formDesigner.getSelectedPosition();
    if (selectedPos !== undefined) this._positions.add(selectedPos);
    const positions = Array.from(this._positions);
    let md: string = renderMd(root as IComponent, '', positions);

    const regex = new RegExp(`\\{Line-[0-9]+-${selectedPos}\\}`, 'g');  
    const match = md.match(regex);
    const startLine = match?.[0]?.split('-')?.[1];
    const endLine = match?.[1]?.split('-')?.[1];

    md = md.replace(/(Line-[0-9]+)-[0-9]+/g, '$1');

    startLine && this._oldLines.push({ startLine, endLine });

    if (selectedPos !== undefined)
      this._selectedWidget = { startLine, endLine, md };
    else
      this._selectedWidget = null;
    
    return md;
  }

  private updateMd() {
    if (this.activeTab === 'codeTab') return;
    this.getUpdatedMd(true);

    if (!this._selectedWidget) return;

    const { startLine, endLine, md } = this._selectedWidget;
    if (typeof this.onSelectedWidget === 'function')
      this.onSelectedWidget(this.file.path, md, { startLine, endLine }, true);
  }

  private async parseMd(content: string) {
    const ui = parseMD(content, this.dataUrl);
    const updated = {
      name: 'i-panel',
      props: {
        width: '{100%}',
        minHeight: '{100%}'
      },
      items: [...ui],
      path: IdUtils.generateUUID()
    }

    await this.loadPageWidgets();
    await this.formDesigner.renderUI(updated);
    await this.compiler.addFile(this.tempTsxPath, template, this.getImportFile);

    const root = this.formDesigner.rootComponent;
    let code = this.compiler.renderUI(
      this.tempTsxPath,
      'render',
      root
    )
    this.tempTsxContent = code;
    this.compiler.updateFile(this.tempTsxPath, code);
  }

  private async parseTsx(fileName: string) {
    await this.compiler.addFile(fileName, this.codeEditor.value, this.importCallback);
    const ui = this.compiler.parseUI(fileName)
    this.formDesigner.renderUI(this.updateRoot(ui))
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

    if (this.deployDeployer) {
      this.deployDeployer.setData({
        path: this.fileName,
        content: this.value
      })
    }

    if (typeof this.onChange === 'function') this.onChange(this, event)
  }

  private handleCodeEditorSave(target: ScomCodeEditor, event: KeyboardEvent) {
    if (event.code === 'KeyS' && (event.metaKey || event.ctrlKey)) {
      event.stopPropagation();
      event.preventDefault();
      if (typeof this.onSave === 'function') this.onSave(target, event);
    }
  }

  private handleCodeEditorSelectionChange(target: ScomCodeEditor, selection: any) {
    if (!this.isWidgetMD) return;
    const isEmpty = selection.isEmpty();
    if (isEmpty) {
      this.hideAddToChatWidget();
      return;
    }

    const position = {
      lineNumber: selection.startLineNumber,
      column: selection.startColumn
    };
    this.updateAddToChatWidget(position);
    this.codeEditor.updateWidget(this._chatWidget);
  }

  private updateAddToChatWidget(position?: any) {
    if (this._chatWidget) {
      this._chatWidget.getPosition = () => {
        if (!position) return null;
        const ref = this.codeEditor.getContentWidgetPosition();
        return {
          position: {...position},
          preference: [ref.ABOVE, ref.BELOW]
        };
      }
      return;
    }

    this._chatWidget = {
      getId: () => 'addToChatWidget',
      getDomNode: () => {
        const node = document.createElement('div');
        node.innerText = 'Add to Chat';
        node.style.background = 'var(--background-modal)';
        node.style.color = 'var(--text-primary)';
        node.style.padding = '0.5rem';
        node.style.borderRadius = '0.25rem';
        node.style.width = '150px';
        node.style.cursor = 'pointer';
        node.style.boxShadow = 'var(--shadows-1)';
        node.style.border = '1px solid var(--divider)';
        node.style.fontSize = '0.875rem';
        node.style.fontWeight = '500';
        node.onclick = this.handleAddToChat.bind(this);
        return node;
      },
      getPosition: () => {
        if (!position) return null;
        const ref = this.codeEditor.getContentWidgetPosition();
        return {
          position: {...position},
          preference: [ref.ABOVE, ref.BELOW]
        };
      }
    };
  }

  private handleAddToChat() {
    const { startLine, endLine, value } = this.codeEditor.executeEditor(
      'insert',
      { textBefore: '{SELECT_START}', textAfter: '{SELECT_END}', oldLines: [...this._oldLines] }
    )

    const regex = /({SELECT_START}([^`]+))?\`\`\`(.*?)\`\`\`(\s+{SELECT_END}([^`]+))?/gms;
    const matches = value.match(regex);
    this._oldLines.push({ startLine, endLine });

    for (let i = 0; i < matches?.length; i++) {
      const match = matches[i];
      if (match.includes('{SELECT_START}') || match.includes('{SELECT_END}')) {
        this._positions.add(i + 1);
      }
    }

    if (typeof this.onSelectedWidget === 'function') {
      this.onSelectedWidget(this.file.path, value, { startLine, endLine }, false);
    }

    this.hideAddToChatWidget();
  }

  private hideAddToChatWidget() {
    if (!this._chatWidget) return;
    this.updateAddToChatWidget();
    this.codeEditor.updateWidget(this._chatWidget);
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

  private async handleDesignerPreview(): Promise<{ module: string, script: string, packages?: any }> {
    if (this.updateDesigner && this.isTsx) this.updateDesignerCode(this.fileName, true)
    if (typeof this.onPreview === 'function')
      return await this.onPreview()
    else {
      const previewedValue = this.tempTsxContent || this.value;
      const value = `///<amd-module name='@scom/debug-module'/> \n` + previewedValue;
      const fileName = this.tempTsxPath || this.fileName || 'index.tsx';

      if (value) {
        let compiler = new Compiler()
        await compiler.addFile(
          fileName,
          value,
          this.getImportFile
        );
        let result = await compiler.compile(true)

        const packages = this.tempTsxPath ? await this.getPageWidgets() : [];

        if (result.errors?.length > 0) {
          console.error(result.errors);
          if (typeof this.onRenderError === 'function')
            this.onRenderError(result.errors)
          return null;
        }
        return {
          module: '@scom/debug-module',
          script: result?.script['index.js'],
          packages
        };
      }
    }
  }

  private async getPageWidgets() {
    const promises = [];
    const mapper: Record<string, string> = {};
    for (let packageName of pageWidgets) {
      promises.push(
        application.getContent(`${application.rootDir}libs/${packageName}/index.js`)
          .then(content => {
            mapper[packageName] = content;
          })
      );
    }
    
    await Promise.all(promises);
    const result = [];

    for (const packageName in mapper) {
      result.push({
        fileName: packageName,
        script: {
          'index.js': mapper[packageName]
        }
      });
    }

    return result;
  }

  private updateDesignerCode(fileName: string, modified?: boolean): string {
    if (modified || this.formDesigner?.modified) {
      const root = this.formDesigner.rootComponent;
      const code = this.compiler.renderUI(
        fileName,
        'render',
        root
      )
      this.compiler.updateFile(fileName, code)
      if (this.isTsx) this.codeEditor.value = code
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
    if (this.formDesigner) {
      this.formDesigner.clear();
      this.formDesigner.closePreview();
    }
    this.isWidgetsLoaded = false;
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
    this.onSelectedWidget = this.getAttribute('onSelectedWidget', true) || this.onSelectedWidget
    this.onAddControl = this.getAttribute('onAddControl', true) || this.onAddControl
    const deployConfig = this.getAttribute('deployConfig', true)
    if (deployConfig) this.deployConfig = deployConfig;
    const url = this.getAttribute('url', true)
    const file = this.getAttribute('file', true)
    const dataUrl = this.getAttribute('dataUrl', true)
    this.selectedType = this.getAttribute('selectedType', true)
    this.isPreviewDefault = this.getAttribute('isPreviewDefault', true)
    this.themes = this.getAttribute('themes', true)
    this.addLib()
    this.setData({ url, file, dataUrl });
    this.classList.add(blockStyle);
    this.setTag(themesConfig);

    document.addEventListener('click', this.handleClick);
  }

  private handleClick(event: MouseEvent) {
    if (this.activeTab === 'codeTab') {
      const target = event.target as HTMLElement;
      const isFocused = target.closest('#codeEditor');
      if (!isFocused) {
        this.hideAddToChatWidget();
      }
    }
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
        ...getWidgetSchemas(),
      },
    ];
    return actions;
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
            rightIcon={{name: 'spinner', spin: true, visible: false}}
            minHeight={'2.25rem'}
            onClick={this.handleTabChanged}
          ></i-button>
          <i-button
            id="designTab"
            caption='$design'
            stack={{ shrink: '0' }}
            padding={{top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem'}}
            background={{color: Theme.action.activeBackground}}
            rightIcon={{name: 'spinner', spin: true, visible: false}}
            border={{width: '1px', style: 'solid', color: Theme.action.activeBackground, radius: 0}}
            boxShadow='none'
            minHeight={'2.25rem'}
            font={{color: Theme.action.active}}
            onClick={this.handleTabChanged}
          ></i-button>
          <i-button
            id="deployTab"
            caption='$deploy'
            stack={{ shrink: '0' }}
            padding={{top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem'}}
            background={{color: Theme.action.activeBackground}}
            rightIcon={{name: 'spinner', spin: true, visible: false}}
            border={{width: '1px', style: 'solid', color: Theme.action.activeBackground, radius: 0}}
            boxShadow='none'
            minHeight={'2.25rem'}
            visible={false}
            font={{color: Theme.action.active}}
            onClick={this.handleTabChanged}
          ></i-button>
        </i-hstack>
        <i-vstack id="pnlMain" maxHeight={'100%'} overflow={'hidden'} stack={{ 'grow': '1' }}></i-vstack>
      </i-vstack>
    )
  }
}


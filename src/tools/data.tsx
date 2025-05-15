import {
  Module,
  ControlElement,
  customElements,
  Styles,
  Button,
  Modal
} from '@ijstech/components'
import DesignerToolHeader from './header';
import { propertiesJson } from '../languages/index';
import { ScomCodeEditor } from '@scom/scom-code-editor';
import { toJSON, toYAML, validateYaml } from '@scom/scom-yaml';
import { customModalStyle } from './index.css';

const Theme = Styles.Theme.ThemeVars;

interface IDesignerData {
  title?: string;
  props?: any;
  dataSchema?: any;
}

type onChangedCallback = (data: any, mediaQuery?: any) => void;

interface DesignerToolDataElement extends ControlElement {
  title?: string;
  props?: any;
  dataSchema?: any;
  onChanged?: onChangedCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-data']: DesignerToolDataElement
    }
  }
}

@customElements('designer-tool-data')
export default class DesignerToolData extends Module {
  private designerHeader: DesignerToolHeader;
  private btnSubmit: Button;
  private codeEditor: ScomCodeEditor;
  private mdData: Modal;

  private _data: IDesignerData = {};

  onChanged: onChangedCallback;

  get data() {
    return this._data?.props?.data;
  }

  get dataSchema() {
    return this._data?.dataSchema;
  }

  get dataString() {
    const data = this.data;
    const yamlStr = data ? toYAML(data) : '';
    return yamlStr;
  }

  setData(value: IDesignerData) {
    this._data = value;
    this.btnSubmit.enabled = true;
    this.renderUI();
  }

  private renderUI() {
    this.designerHeader.name = this._data?.title || '';
    this.codeEditor.value = this.dataString;
  }

  private showDatModal() {
    this.mdData.visible = true;
  }

  private closeDataModal() {
    this.codeEditor.value = this.dataString;
  }

  private handleSubmit() {
    const value = this.codeEditor.value;
    const valiatedResult = validateYaml(value, this.dataSchema);
    this.btnSubmit.enabled = valiatedResult.isValid;
    console.log('valiatedResult: ', valiatedResult);
    if (valiatedResult.isValid) {
      const data = toJSON(value);
      this._data.props.data = data;
      if (typeof this.onChanged === 'function') {
        this.onChanged('data', data);
      }
      this.mdData.visible = false;
    }
  }

  init() {
    this.i18n.init({...propertiesJson});
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    const title = this.getAttribute('title', true);
    const props = this.getAttribute('props', true);
    const dataSchema = this.getAttribute('dataSchema', true);
    if (props) this.setData({ title, props, dataSchema });
  }
  

  render(): void {
      return (
        <i-vstack
        width="100%"
        height="100%"
        margin={{ left: "auto", right: "auto" }}
        position="relative"
      >
        <designer-tool-header
          id="designerHeader"
          name=""
          tooltipText=""
          hasMediaQuery={false}
          onCollapse={this.showDatModal}
        />
        <i-modal
          id="mdData"
          width={"50dvw"}
          maxWidth={"100%"}
          height={"50dvh"}
          overflow={{y: 'auto', x: 'hidden'}}
          closeIcon={{name: "times", width: '1rem', height: '1rem'}}
          class={customModalStyle}
          onClose={this.closeDataModal}
        >
          <i-vstack gap="0.5rem" width="100%" height="100%">
            <i-panel stack={{grow: '1'}} width="100%" overflow={'hidden'}>
              <i-scom-code-editor
                id="codeEditor"
                width="100%" height="100%"
              />
            </i-panel>
            <i-hstack horizontalAlignment='end' stack={{shrink: '0', "basis": "40px"}}>
              <i-button
                id="btnSubmit"
                caption="$confirm"
                padding={{top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem'}}
                background={{color: Theme.colors.primary.main}}
                font={{color: Theme.colors.primary.contrastText}}
                boxShadow='none'
                onClick={this.handleSubmit}
              />
            </i-hstack>
          </i-vstack>
        </i-modal>
      </i-vstack>
      )
  }
}
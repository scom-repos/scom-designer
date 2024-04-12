import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Form,
  IDataSchema,
  IUISchema
} from '@ijstech/components'
import DesignerToolHeader from './header';
import { customFormStyle } from './index.css';

const Theme = Styles.Theme.ThemeVars;

interface DesignerToolGroupElement extends ControlElement {
  title?: string;
  tooltip?: string;
  uiSchema?: IUISchema;
  dataSchema?: IDataSchema;
  props?: any;
  customControls?: any;
  onChanged?: (data: any) => void;
}

interface IDesignerGroup {
  title?: string;
  tooltip?: string;
  uiSchema?: IUISchema;
  dataSchema?: IDataSchema;
  props?: any;
  customControls?: any;
  default?: {[name: string]: any};
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-group']: DesignerToolGroupElement
    }
  }
}

@customElements('designer-tool-group')
export default class DesignerToolGroup extends Module {
  private vStackContent: VStack;
  private designerHeader: DesignerToolHeader;
  private form: Form;

  private _data: IDesignerGroup = {};

  onChanged: (data: any) => void;

  constructor(parent?: Container, options?: DesignerToolGroupElement) {
    super(parent, options);
    this.onResetData = this.onResetData.bind(this);
  }

  setData(value: IDesignerGroup) {
    this._data = value;
    this.renderUI();
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {
    this.designerHeader.name = this._data.title || '';
    this.designerHeader.tooltipText = this._data.tooltip || '';
    this.form.clearFormData();
    if (this._data.uiSchema || this._data.dataSchema) {
      this.form.uiSchema = this._data.uiSchema;
      this.form.jsonSchema = this._data.dataSchema;
      this.form.formOptions = {
          columnWidth: '100%',
          columnsPerRow: 1,
          confirmButtonOptions: {
            caption: 'Confirm',
            backgroundColor: Theme.colors.primary.main,
            fontColor: Theme.colors.primary.contrastText,
            hide: false,
            onClick: async () => {
              const data = await this.form.getFormData();
              Object.keys(data).forEach(key => {
                if (data[key] === undefined) delete data[key];
              })
              if (this.onChanged) this.onChanged(data);
            }
          },
          customControls: this._data.customControls,
          dateTimeFormat: {
            date: 'YYYY-MM-DD',
            time: 'HH:mm:ss',
            dateTime: 'MM/DD/YYYY HH:mm'
          },
      };
      this.form.renderForm();
      this.form.setFormData({...this._data.props || {}});
      this.form.visible = true;
    }
  }

  private onResetData() {
    this.form.setFormData({...this._data.default || {}});
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    const title = this.getAttribute('title', true);
    const uiSchema = this.getAttribute('uiSchema', true);
    const dataSchema = this.getAttribute('dataSchema', true);
    const customControls = this.getAttribute('customControls', true);
    const props = this.getAttribute('props', true);
    if (uiSchema || dataSchema) this.setData({ title, uiSchema, dataSchema, customControls, props });
  }

  render() {
    return (
      <i-vstack
        width="100%"
        height="100%"
        margin={{ left: "auto", right: "auto" }}
        position="relative"
      >
        <designer-tool-header
          id ="designerHeader"
          name=""
          tooltipText=""
          onCollapse={this.onCollapse}
          onReset={this.onResetData}
        />
        <i-vstack id="vStackContent" gap={'0.5rem'} padding={{ top: '1rem', bottom: '1rem', left: '0.75rem', right: '0.75rem' }} visible={false}>
          <i-form id="form" class={customFormStyle} visible={false}></i-form>
        </i-vstack>
      </i-vstack>
    )
  }
}

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
import { IMediaQuery, onUpdateCallback } from '../interface';
import { isSameValue } from '../helpers/utils';
import DesignerTemplateAreas from './templateAreas';
import { propertiesJson } from '../languages/index';

const Theme = Styles.Theme.ThemeVars;

type onChangedCallback = (data: any, mediaQuery?: any) => void;

interface DesignerToolGroupElement extends ControlElement {
  title?: string;
  tooltip?: string;
  uiSchema?: IUISchema;
  dataSchema?: IDataSchema;
  props?: any;
  customControls?: any;
  onChanged?: onChangedCallback;
  onUpdate?: onUpdateCallback;
}

interface IDesignerGroup {
  title?: string;
  tooltip?: string;
  uiSchema?: IUISchema;
  dataSchema?: IDataSchema;
  props?: any;
  customControls?: any;
  default?: {[name: string]: any};
  mediaQuery?: IMediaQuery;
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

  onChanged: onChangedCallback;
  onUpdate: onUpdateCallback;

  constructor(parent?: Container, options?: DesignerToolGroupElement) {
    super(parent, options);
    this.onResetData = this.onResetData.bind(this);
    this.onToggleMediaQuery = this.onToggleMediaQuery.bind(this);
  }

  private get isChecked() {
    return this.designerHeader.checked;
  }

  private get customProps() {
    const properties = this._data.dataSchema?.properties;
    return properties ? Object.keys(properties) : [];
  }

  private hasMediaQuery() {
    const breakpointProps = this._data.mediaQuery?.properties || {};
    const props = this.customProps;
    const hasChanged = props.find(prop => {
      const hasProp = Object.hasOwnProperty.call(breakpointProps, prop);
      if (hasProp) {
        return !isSameValue(this._data?.[prop] ?? this._data.default?.[prop], breakpointProps[prop]);
      }
      return false;
    });
    return !!hasChanged;
  }

  private get currentData() {
    const props = this._data.props || {};
    if (this.isChecked) {
      return {...props, ...(this._data.mediaQuery?.properties || {})};
    }
    return props;
  }

  setData(value: IDesignerGroup) {
    this._data = value;
    const olChecked = this.designerHeader.checked;
    this.designerHeader.checked = !!this.hasMediaQuery();
    this.renderUI(olChecked !== this.designerHeader.checked);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI(needUpdate = false) {
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
            caption: '$confirm',
            backgroundColor: Theme.colors.primary.main,
            fontColor: Theme.colors.primary.contrastText,
            hide: false,
            onClick: async () => {
              const data = await this.form.getFormData();
              Object.keys(data).forEach(key => {
                if (data[key] === undefined) delete data[key];
              })
              if (this.isChecked) {
                for (let prop in data) {
                  const isSame = isSameValue(data[prop], this._data.props?.[prop] || this._data.default?.[prop]);
                  if (!isSame)
                    this._data.mediaQuery.properties[prop] = data[prop];
                }
                if (this.onChanged) this.onChanged(this._data.props, this._data.mediaQuery);
                if (this.onUpdate) this.onUpdate(this.isChecked, this.customProps);
              } else {
                if (this.onChanged) this.onChanged(data);
              }
            }
          },
          customControls: {
            "#/properties/templateAreas": {
              render: () => {
                return new DesignerTemplateAreas();
              },
              getData: (control: DesignerTemplateAreas) => {
                return control.getData();
              },
              setData: (control: DesignerTemplateAreas, value: string[][]) => {
                control.setData(value);
              }
            }
          },
          dateTimeFormat: {
            date: 'YYYY-MM-DD',
            time: 'HH:mm:ss',
            dateTime: 'MM/DD/YYYY HH:mm'
          },
      };
      this.form.renderForm();
      this.form.setFormData({...this.currentData || {}});
      this.form.visible = true;
    }
    if (this.onUpdate && needUpdate) this.onUpdate(this.isChecked, this.customProps);
  }

  private onToggleMediaQuery(isChecked: boolean) {
    this.renderUI(true);
  }

  private onResetData() {
    const props = this.customProps;
    if (this.isChecked) {
      const properties = this._data.mediaQuery?.properties || {};
      props.forEach(prop => {
        if (Object.hasOwnProperty.call(properties, prop)) delete properties[prop];
      })
      this.form.setFormData(this._data.props);
      if (this.onChanged) this.onChanged(this._data.props, this._data.mediaQuery);
    } else {
      const clonedData = JSON.parse(JSON.stringify(this._data.default));
      this._data.props = clonedData;
      this.form.setFormData(this._data.props);
      if (this.onChanged) this.onChanged(this._data.props);
    }
    this.renderUI(true);
  }

  init() {
    this.i18n.init({...propertiesJson});
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    this.onUpdate = this.getAttribute('onUpdate', true) || this.onUpdate;
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
          hasMediaQuery={true}
          onCollapse={this.onCollapse}
          onToggleMediaQuery={this.onToggleMediaQuery}
          onReset={this.onResetData}
        />
        <i-vstack id="vStackContent" gap={'0.5rem'} padding={{ top: '1rem', bottom: '1rem', left: '0.75rem', right: '0.75rem' }} visible={false}>
          <i-form id="form" class={customFormStyle} visible={false}></i-form>
        </i-vstack>
      </i-vstack>
    )
  }
}

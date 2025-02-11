import { Container, ControlElement, Form, Module, customElements, Styles, IDataSchema } from "@ijstech/components";
import { ABIField } from "@scom/ton-core";

const Theme = Styles.Theme.ThemeVars;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-designer--deployer-params']: DeployerParamsElement
    }
  }
}

type onChangedCallback = (value: Record<string, any>) => void;

interface DeployerParamsElement extends ControlElement {
  fields?: ABIField[];
  buttonCaption?: string;
  onChanged?: onChangedCallback;
}

interface IDeployerParams {
  fields: ABIField[];
  buttonCaption: string;
}

@customElements('i-scom-designer--deployer-params')
export default class DeployerParams extends Module {
  private formParams: Form;

  private _data: IDeployerParams = {
    fields: [],
    buttonCaption: ''
  };
  private _schema: IDataSchema;

  onChanged: onChangedCallback;

  get fields() {
    return this._data.fields || [];
  }

  set fields(value: ABIField[]) {
    this._data.fields = value || [];
    this.renderForm();
  }

  get buttonCaption() {
    return this._data.buttonCaption;
  }

  set buttonCaption(value: string) {
    this._data.buttonCaption = value;
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  async validate() {
    const formData = await this.formParams.getFormData();
    return this.formParams.validate(formData, this._schema, { changing: false });
  }

  async getFormData() {
    return await this.formParams.getFormData();
  }

  private renderForm() {
    const schema: any = {
      type: 'object',
      properties: {}
    };
    this.fields.forEach((field: ABIField, index: number) => {
      schema.properties[field.name] = {
        type: this.getType(field.type?.type),
        title: field.name,
        required: true
      }
    });

    this._schema = schema;
    this.formParams.jsonSchema = schema as any;
    this.formParams.formOptions = {
      columnWidth: '100%',
      columnsPerRow: 1,
      confirmButtonOptions: {
        caption: this.buttonCaption || '$send',
        backgroundColor: Theme.colors.primary.main,
        fontColor: Theme.colors.primary.contrastText,
        hide: true
      },
      dateTimeFormat: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss',
        dateTime: 'MM/DD/YYYY HH:mm'
      },
    };
    this.formParams.renderForm();
  }

  private getType(type: string) {
    console.log(type);
    let result = 'string';
    switch (type) {
      case 'uint':
      case 'int':
        result = 'number';
        break;
      case 'bool':
        result = 'boolean';
        break;
    }
    return result;
  }

  init(): void {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    const fields = this.getAttribute('fields', true);
    const buttonCaption = this.getAttribute('buttonCaption', true);
    if (buttonCaption) this.buttonCaption = buttonCaption;
    if (fields) this.fields = fields;
  }

  render(): void {
    return <i-vstack gap={'0.5rem'}>
      <i-label caption="Params" font={{ bold: true }}></i-label>
      <i-form id="formParams"></i-form>
    </i-vstack>
  }
}
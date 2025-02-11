import { Container, ControlElement, Form, Module, customElements, IDataSchema, Label } from "@ijstech/components";
import { basicTypes } from "../helpers/utils";
import { ABIField, ABIType } from "@scom/ton-core";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-designer--deployer-params']: DeployerParamsElement
    }
  }
}

interface DeployerParamsElement extends ControlElement {
  fields?: ABIField[];
  name?: string;
  onGetType?: (type: string) => ABIField;
}

interface IDeployerParams {
  fields: ABIField[];
  name?: string;
}

type onGetTypeCallback = (type: string) => ABIType;

@customElements('i-scom-designer--deployer-params')
export default class DeployerParams extends Module {
  private formParams: Form;
  private lblName: Label;

  private _data: IDeployerParams = {
    fields: [],
    name: 'Params'
  };
  private _schema: IDataSchema;

  onGetType?: onGetTypeCallback;

  get fields() {
    return this._data.fields || [];
  }

  set fields(value: ABIField[]) {
    this._data.fields = value || [];
    this.renderForm();
  }

  get name() {
    return this._data.name || 'Params';
  }

  set name(value: string) {
    this._data.name = value || 'Params';
    if (this.lblName) this.lblName.caption = value;
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
      this.renderSchema(schema, field);
    });

    this._schema = schema;
    this.formParams.jsonSchema = schema as any;
    this.formParams.formOptions = {
      columnWidth: '100%',
      columnsPerRow: 1,
      confirmButtonOptions: {
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

  private renderSchema(schema: any, field: ABIField) {
    const type = field.type?.type;
    if (basicTypes.includes(type)) {
      schema.properties[field.name] = {
        type: this.getType(field.type?.type),
        title: field.name,
        required: field.type?.optional === false
      }
      return schema;
    }

    schema.properties[field.name] = {
      type: 'object',
      properties: {},
      required: field.type?.optional === false
    }
    const itemData = this.onGetType(type);
    const childFields = itemData?.fields || [];
  
    if (childFields.length) {
      for (const childField of childFields) {
        schema.properties[field.name] = this.renderSchema(schema.properties[field.name], childField);
      }
    }
    return schema;
  }

  private getType(type: string) {
    let result = 'string';
    switch (type) {
      case 'uint':
      case 'int':
        result = 'number';
        break;
      case 'bool':
        result = 'boolean';
        break;
      case 'slice':
        result = 'string';
    }
    return result;
  }

  init(): void {
    super.init();
    this.onGetType = this.getAttribute('onGetType', true) || this.onGetType;
    const fields = this.getAttribute('fields', true);
    if (fields) this.fields = fields;
    this.name = this.getAttribute('name', true);
  }

  render(): void {
    return <i-vstack gap={'0.5rem'}>
      <i-label id="lblName" caption="Params" font={{ bold: true }}></i-label>
      <i-form id="formParams"></i-form>
    </i-vstack>
  }
}
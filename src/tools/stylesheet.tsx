import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  ComboBox,
  Label
} from '@ijstech/components'
import { customIconBorderStyled } from './index.css';
import { onChangedCallback } from '../interface';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolStylesheetElement extends ControlElement {
  onChanged?: onChangedCallback;
}

interface IDesignerStylesheet {

}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-stylesheet']: DesignerToolStylesheetElement
    }
  }
}

@customElements('designer-tool-stylesheet')
export default class DesignerToolStylesheet extends Module {
  private vStackContent: VStack;
  private stylesSelect: ComboBox;
  private lblStats: Label;

  private _data: IDesignerStylesheet = {};

  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: DesignerToolStylesheetElement) {
    super(parent, options);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleMove = this.handleMove.bind(this);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  setData(value: IDesignerStylesheet) {
    this._data = value;
    this.renderUI();
  }

  private renderUI() {
    this.stylesSelect.items = this.getStylesOptions();
  }

  private getStylesOptions() {
    return [
      {
        value: 'My Style',
        label: 'My Style'
      }
    ]
  }

  private handleEdit() {
    console.log('handleEdit');
  }

  private handleCopy() {
    console.log('handleCopy');
  }

  private handleMove() {
    console.log('handleMove');
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
  }

  render() {
    return (
      <i-vstack
        width="100%"
        height="100%"
        margin={{ left: "auto", right: "auto" }}
        position="relative"
      >
        <designer-tool-header name="Stylesheet" onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" gap={'0.5rem'} padding={{ top: '1rem', bottom: '1rem', left: '0.75rem', right: '0.75rem' }}>
          <i-hstack gap={4} verticalAlignment="center">
            <i-combo-box
              id="stylesSelect"
              items={[]}
              placeholder="Select or Create New..."
            />
            <i-icon name="pen" width={'1.5rem'} height={'1.5rem'} class={customIconBorderStyled} onClick={this.handleEdit} />
            <i-icon name="copy" width={'1.5rem'} height={'1.5rem'} class={customIconBorderStyled} onClick={this.handleCopy} />
            <i-icon name="arrow-up" width={'1.5rem'} height={'1.5rem'} class={customIconBorderStyled} onClick={this.handleMove} />
            <i-icon name="arrow-left" width={'1.5rem'} height={'1.5rem'} class={customIconBorderStyled} onClick={this.handleMove} />
          </i-hstack>
          <i-label id="lblStats" caption="Styles: 0 direct, 0 disabled, 4 inherited" font={{ size: '0.675rem' }} opacity={0.6} />
        </i-vstack>
      </i-vstack>
    )
  }
}

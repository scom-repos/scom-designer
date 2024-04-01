import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Input,
  Range,
  Label,
  Modal
} from '@ijstech/components'
import { bgInputTransparent, textInputRight, unitStyled } from './index.css';
import { onChangedCallback } from '../interface';

const Theme = Styles.Theme.ThemeVars;

interface DesignerToolInputElement extends ControlElement {
  onChanged?: onChangedCallback;
}

interface IDesignerInput {
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-input']: DesignerToolInputElement
    }
  }
}

@customElements('designer-tool-input')
export default class DesignerToolInput extends Module {
  private inputEl: Input;
  private lblUnit: Label;
  private mdUnit: Modal;

  private _data: IDesignerInput = {};

  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: DesignerToolInputElement) {
    super(parent, options);
    this.onInputChanged = this.onInputChanged.bind(this);
  }

  setData(value: IDesignerInput) {
    this._data = value;
    this.renderUI();
  }

  private renderUI() {
  }

  private onInputChanged() {}

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
  }

  render() {
    return (
      <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
        <i-label caption="Opacity" font={{ size: '0.75rem' }} />
        <i-hstack gap={16} verticalAlignment="center">
          <i-hstack verticalAlignment="center" width={80} border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
            <i-input
              id="inputEl"
              inputType="number"
              placeholder="auto"
              background={{ color: 'transparent' }}
              width="calc(100% - 24px)"
              height={24}
              border={{ width: 0 }}
              padding={{ left: 4, right: 2 }}
              font={{ size: '0.725rem' }}
              class={`${textInputRight} ${bgInputTransparent}`}
              onChanged={this.onInputChanged}
            />
            <i-label
              id="lblUnit"
              caption="%"
              font={{ size: '0.725rem' }}
              width={24}
              height={24}
              lineHeight="24px"
              border={{
                left: {
                  width: 1,
                  style: 'solid',
                  color: Theme.action.focus
                }
              }}
              class="text-center"
            />
          </i-hstack>
        </i-hstack>
      </i-grid-layout>
    )
  }
}

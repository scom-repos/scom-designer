import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Input,
  Range
} from '@ijstech/components'
import { bgInputTransparent, textInputRight } from './index.css';
import { onChangedCallback } from '../interface';
import DesignerToolHeader from './header';

const Theme = Styles.Theme.ThemeVars;

interface DesignerToolEffectsElement extends ControlElement {
  onChanged?: onChangedCallback;
}

interface IDesignerEffect {
  opacity?: number|string;
  default?: {[name: string]: any};
}

export const DESIGNER_EFFECT_PROPS = ['opacity'];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-effects']: DesignerToolEffectsElement
    }
  }
}

@customElements('designer-tool-effects')
export default class DesignerToolEffects extends Module {
  private vStackContent: VStack;
  private inputEffect: Input;
  private rangeEffect: Range;
  private designerHeader: DesignerToolHeader;

  private _data: IDesignerEffect = {};

  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: DesignerToolEffectsElement) {
    super(parent, options);
    this.onResetData = this.onResetData.bind(this);
  }

  setData(value: IDesignerEffect) {
    this._data = value;
    this.renderUI();
  }

  private get defaultOpacity() {
    return Number(this._data?.default?.['opacity'] || '1')
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {
    const { opacity = 1 } = this._data;
    this.inputEffect.value = this.rangeEffect.value = Number(opacity) * 100;
    this.updateHighlight();
  }

  private updateHighlight() {
    this.designerHeader.isChanged = Number(this._data?.opacity || 1) !== this.defaultOpacity;
  }

  private onInputEffectChanged() {
    this.rangeEffect.value = this.inputEffect.value;
    this._data.opacity = this.rangeEffect.value / 100;
    this.updateHighlight();
    if (this.onChanged) this.onChanged('opacity', `${this._data.opacity}`);
  }

  private onRangeChanged() {
    this.inputEffect.value = this.rangeEffect.value;
    this._data.opacity = this.rangeEffect.value / 100;
    this.updateHighlight();
    if (this.onChanged) this.onChanged('opacity', `${this._data.opacity}`);
  }

  private onResetData() {
    const clonedData = JSON.parse(JSON.stringify(this._data));
    const cloneDefault = JSON.parse(JSON.stringify(clonedData.default));
    this._data = { ...clonedData, ...cloneDefault };
    if (this.onChanged) this.onChanged('opacity', this._data['opacity']);
    this.renderUI();
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    this.inputEffect.value = this.rangeEffect.value = 100;
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
          id="designerHeader"
          name="Effects"
          tooltipText="Set elevation and opacity for the element."
          onCollapse={this.onCollapse}
          onReset={this.onResetData}
        />
        <i-vstack id="vStackContent" gap={8} padding={{ top: 16, bottom: 16, left: 12, right: 12 }} visible={false}>
          <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
            <i-label caption="Opacity" font={{ size: '0.75rem' }} />
            <i-hstack gap={16} verticalAlignment="center">
              <i-hstack verticalAlignment="center" width={80} border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
                <i-input
                  id="inputEffect"
                  inputType="number"
                  placeholder="auto"
                  background={{ color: 'transparent' }}
                  width="calc(100% - 24px)"
                  height={24}
                  border={{ width: 0 }}
                  padding={{ left: 4, right: 2 }}
                  font={{ size: '0.725rem' }}
                  class={`${textInputRight} ${bgInputTransparent}`}
                  onBlur={this.onInputEffectChanged}
                  onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && this.onInputEffectChanged()}
                />
                <i-label
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
              <i-hstack width="calc(100% - 96px)" verticalAlignment="center">
                <i-range
                  id="rangeEffect"
                  width="100%"
                  height={16}
                  min={0}
                  max={100}
                  onChanged={this.onRangeChanged}
                />
              </i-hstack>
            </i-hstack>
          </i-grid-layout>
        </i-vstack>
      </i-vstack>
    )
  }
}

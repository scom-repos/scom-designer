import {
  Module,
  ControlElement,
  customElements,
  Icon,
  Label,
  Container,
  VStack,
  Modal,
  Styles,
  IconName,
  Button,
  Input
} from '@ijstech/components';
import { bgInputTransparent, textInputRight, unitStyled } from './index.css';
import { parseNumberValue } from '../helpers/utils';
import { propertiesJson } from '../languages/index';
const Theme = Styles.Theme.ThemeVars;

type onChangedCallback = (type: string, position: string, value: string) => void;
interface DesignerToolModalSpacingElement extends ControlElement {
  config?: IConfig;
  data?: ISpacing;
  onChanged?: onChangedCallback;
}

interface ISpacing {
  value?: string|number;
  type?: string;
  position?: string;
}

interface IConfig {
  title?: string;
  breakpointText?: string;
  iconName?: IconName;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-modal-spacing']: DesignerToolModalSpacingElement
    }
  }
}

@customElements('designer-tool-modal-spacing')
export default class DesignerToolModalSpacing extends Module {
  private unit: string = 'px';
  private spacing: ISpacing = {};
  private config: IConfig = {};

  private modal: Modal;
  private vStackIndUnits: VStack;
  private lbIndUnit: Label;
  private lbTitle: Label;
  private lbBreakpoint: Label;
  private iconTitle: Icon;
  private inputValue: Input;

  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: DesignerToolModalSpacingElement) {
    super(parent, options);
  }

  private async initModal() {
    this.modal = await Modal.create({
      visible: false,
      showBackdrop: false,
      minWidth: '16rem',
      height: 'auto',
      popupPlacement: 'bottom'
    });
    const onShowUnits = () => {
      this.vStackIndUnits.visible = true;
      this.vStackIndUnits.display = 'flex';
    }
    const onUnitChanged = (value: 'px' | '%') => {
      this.lbIndUnit.caption = value;
      this.unit = value;
      const { type, position } = this.spacing;
      const valStr = this.inputValue.value !== '' ? `${this.inputValue.value}${this.unit}` : '';
      if (this.onChanged) this.onChanged(type, position, valStr);
      this.vStackIndUnits.visible = false;
    }
    const onValueChanged = (target: Input) => {
      const value = target.value;
      const { type, position } = this.spacing;
      const valueStr = value !== '' ? `${value}${this.unit}` : '';
      if (this.onChanged) this.onChanged(type, position, valueStr);
    }
    const item = new VStack(undefined, { gap: 8, border: { radius: 8 } });
    const { breakpointText, iconName } = this.config;
    item.appendChild(<i-vstack gap={12}>
      <i-hstack gap={8} verticalAlignment="center">
        <i-icon id="iconTitle" name={iconName} width={12} height={12} />
        <i-label id="lbTitle" caption={this.title} font={{ size: '0.875rem', bold: true, transform: 'capitalize' }} />
      </i-hstack>
      <i-label id="lbBreakpoint" caption={breakpointText} font={{ size: '0.75rem' }} opacity={0.8} />
      <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
      <i-grid-layout position="relative" templateColumns={['100px', 'auto']} verticalAlignment="center">
        <i-label caption="$static_value" font={{ size: '0.75rem' }} />
        <i-hstack verticalAlignment="center" width={80} border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
          <i-input
            id="inputValue"
            inputType="number"
            placeholder="auto"
            background={{ color: 'transparent' }}
            width="calc(100% - 24px)"
            height={24}
            border={{ width: 0 }}
            padding={{ left: 4, right: 2 }}
            font={{ size: '0.675rem' }}
            class={`${textInputRight} ${bgInputTransparent}`}
            onBlur={onValueChanged}
            onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && onValueChanged(target)}
            onClick={() => { this.vStackIndUnits.visible = false }}
          />
          <i-label
            id="lbIndUnit"
            caption="px"
            font={{ size: '0.675rem', color: Theme.input.fontColor }}
            cursor="pointer"
            width={24}
            height={24}
            lineHeight="24px"
            opacity={1}
            border={{
              left: {
                width: 1,
                style: 'solid',
                color: Theme.action.focus
              }
            }}
            class={`text-center ${unitStyled}`}
            onClick={() => onShowUnits()}
          />
        </i-hstack>
        <i-vstack id="vStackIndUnits" gap={8} position="absolute" width={24} top={24} left={156} zIndex={100} background={{ color: Theme.background.modal }}>
          <i-button
            background={{ color: 'transparent' }}
            boxShadow="none" caption="px"
            font={{ size: '0.625rem' }}
            padding={{ top: 4, bottom: 4 }}
            onClick={() => onUnitChanged('px')}
          />
          <i-button
            background={{ color: 'transparent' }}
            boxShadow="none" caption="%"
            font={{ size: '0.625rem' }}
            padding={{ top: 4, bottom: 4 }}
            onClick={() => onUnitChanged('%')}
          />
        </i-vstack>
      </i-grid-layout>
      <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
      <i-grid-layout templateColumns={['100px', 'auto']} verticalAlignment="center">
        <i-label caption="$dynamic_value" font={{ size: '0.75rem' }} />
        {/* TODO: get options */}
        <i-combo-box items={[]} placeholder="$select" onClick={() => { this.vStackIndUnits.visible = false }} />
      </i-grid-layout>
      <i-label id="lbNote" caption="$if_configured_will_be_applied_to_mobile_or_larger_breakpoints_if_you_configure_a_static_style_value_it_will_be_used_as_a_fallback_if_the_data_evaluates_to_undefined" font={{ size: '0.675rem' }} opacity={0.8} />
    </i-vstack>)
    this.modal.item = item;
    document.body.appendChild(this.modal);
  }

  private updateHeader() {
    const { value } = this.spacing;
    const { breakpointText, iconName, title } = this.config;
    this.lbTitle.caption = title;
    this.lbBreakpoint.caption = breakpointText;
    this.iconTitle.name = iconName;
    const parsedValue = parseNumberValue(value);
    this.lbIndUnit.caption = parsedValue.unit;
    this.inputValue.value = parsedValue.value;
  }

  onShowModal(target: Button, value: ISpacing, config: IConfig) {
    if (this.vStackIndUnits) this.vStackIndUnits.visible = false;
    const parseValue = parseNumberValue(value.value);
    const unit = parseValue?.unit || 'px';
    this.unit = unit;
    this.inputValue.value = parseValue?.value ?? '';
    this.lbIndUnit.caption = unit;
    this.config = config || {};
    this.spacing = value || {};
    this.updateHeader();

    // const rect = target.getBoundingClientRect();
    // const { x, y } = rect;
    // let pageX = x;
    // let pageY = y;

    // if (x + 321 >= innerWidth) {
    //   pageX = innerWidth - 321;
    // }
    // if (y + 240 >= innerHeight) {
    //   pageY = innerHeight - 240;
    // }

    // const mdWrapper = this.modal.querySelector('.modal-wrapper') as HTMLElement;
    // mdWrapper.style.top = `${pageY + 24}px`;
    // mdWrapper.style.left = `${pageX}px`;
    // mdWrapper.style.position = 'fixed';
    this.modal.linkTo = target;
    this.modal.visible = true;
  }

  init() {
    this.i18n.init({...propertiesJson});
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    this.spacing = this.getAttribute('data', true, {});
    this.config = this.getAttribute('config', true, {});
    this.initModal();
  }

  render() {
    return (
      <i-panel />
    )
  }
}

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
  Button
} from '@ijstech/components';
import { bgInputTransparent, textInputRight, unitStyled } from './index.css';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolModalSpacingElement extends ControlElement {
  titleSpacing?: string;
  iconName?: IconName;
  breakpointText?: string;
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
  private titleSpacing: string;
  private iconName: IconName;
  private breakpointText: string;

  private modal: Modal;
  private vStackIndUnits: VStack;
  private lbIndUnit: Label;
  private lbTitle: Label;
  private lbBreakpoint: Label;
  private iconTitle: Icon;

  constructor(parent?: Container, options?: DesignerToolModalSpacingElement) {
    super(parent, options);
  }

  private async initModal() {
    this.modal = await Modal.create({
      visible: false,
      showBackdrop: false,
      minWidth: '256px',
      height: 'auto',
      popupPlacement: 'bottom'
    });
    const onShowUnits = () => {
      this.vStackIndUnits.visible = true;
    }
    const onUnitChanged = (value: 'pt' | '%') => {
      this.lbIndUnit.caption = value;
      this.vStackIndUnits.visible = false;
    }
    const onValueChanged = () => {

    }
    const item = new VStack(undefined, { gap: 8, border: { radius: 8 } });
    item.appendChild(<i-vstack gap={12}>
      <i-hstack gap={8} verticalAlignment="center">
        <i-icon id="iconTitle" name={this.iconName} width={12} height={12} />
        <i-label id="lbTitle" caption={this.title} font={{ size: '0.875rem', bold: true }} />
      </i-hstack>
      <i-label id="lbBreakpoint" caption={this.breakpointText} font={{ size: '0.75rem' }} opacity={0.8} />
      <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
      <i-grid-layout position="relative" templateColumns={['100px', 'auto']} verticalAlignment="center">
        <i-label caption="Static Value:" font={{ size: '0.75rem' }} />
        <i-hstack verticalAlignment="center" width={80} border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
          <i-input
            inputType="number"
            placeholder="auto"
            background={{ color: 'transparent' }}
            width="calc(100% - 24px)"
            height={24}
            border={{ width: 0 }}
            padding={{ left: 4, right: 2 }}
            font={{ size: '0.675rem' }}
            class={`${textInputRight} ${bgInputTransparent}`}
            onChanged={onValueChanged}
            onClick={() => { this.vStackIndUnits.visible = false }}
          />
          <i-label
            id="lbIndUnit"
            caption="pt"
            font={{ size: '0.675rem' }}
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
        <i-vstack id="vStackIndUnits" gap={8} position="absolute" width={24} top={24} left={156} background={{ color: Theme.background.modal }}>
          <i-button background={{ color: 'transparent' }} boxShadow="none" caption="pt" font={{ size: '0.625rem' }} padding={{ top: 4, bottom: 4 }} onClick={() => onUnitChanged('pt')} />
          <i-button background={{ color: 'transparent' }} boxShadow="none" caption="%" font={{ size: '0.625rem' }} padding={{ top: 4, bottom: 4 }} onClick={() => onUnitChanged('%')} />
        </i-vstack>
      </i-grid-layout>
      <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
      <i-grid-layout templateColumns={['100px', 'auto']} verticalAlignment="center">
        <i-label caption="Dynamic Value" font={{ size: '0.75rem' }} />
        <i-combo-box items={[]} placeholder="Select..." onClick={() => { this.vStackIndUnits.visible = false }} />
      </i-grid-layout>
      <i-label id="lbNote" caption="If configured, will be applied to Mobile or larger breakpoints. If you configure a static style value, it will be used as a fallback if the data evaluates to undefined." font={{ size: '0.675rem' }} opacity={0.8} />
    </i-vstack>)
    this.modal.item = item;
    document.body.appendChild(this.modal);
  }

  private updateHeader() {
    this.lbTitle.caption = this.titleSpacing;
    this.lbBreakpoint.caption = this.breakpointText;
    this.iconTitle.name = this.iconName;
  }

  onShowModal(target: Button, title: string, iconName: IconName, breakpointText: string) {
    this.vStackIndUnits.visible = false;
    this.titleSpacing = title;
    this.iconName = iconName;
    this.breakpointText = breakpointText;
    this.updateHeader();

    const rect = target.getBoundingClientRect();
    const { x, y } = rect;
    let pageX = x;
    let pageY = y;

    if (x + 321 >= innerWidth) {
      pageX = innerWidth - 321;
    }
    if (y + 240 >= innerHeight) {
      pageY = innerHeight - 240;
    }

    const mdWrapper = this.modal.querySelector('.modal-wrapper') as HTMLElement;
    mdWrapper.style.top = `${pageY + 24}px`;
    mdWrapper.style.left = `${pageX}px`;
    this.modal.visible = true;
  }

  init() {
    super.init();
    this.titleSpacing = this.getAttribute('titleSpacing', true, '');
    this.iconName = this.getAttribute('iconName', true, '');
    this.breakpointText = this.getAttribute('breakpointText', true, '');
    this.initModal();
  }

  render() {
    return (
      <i-panel />
    )
  }
}

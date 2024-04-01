import {
  Module,
  Styles,
  Control,
  Input,
  VStack,
  customElements,
  ControlElement,
  HStack,
  Icon,
  Label,
  Image,
  Modal,
  Alert
} from '@ijstech/components'
import { hoverFullOpacity, iconButtonStyled, rowItemActiveStyled, rowItemHoverStyled } from '../index.css';
import { IComponent, IScreen } from '../interface';
import './index.css';
const Theme = Styles.Theme.ThemeVars;

type visibleCallback = (component: IComponent, visible: boolean) => void;
type selectCallback = (component: IComponent) => void;

interface DesignerComponentsElement extends ControlElement {
  onShowComponentPicker: () => void;
  onSelect?: selectCallback;
  onVisible?: visibleCallback;
  onDelete?: selectCallback;
  screen?: IScreen;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-components']: DesignerComponentsElement
    }
  }
}

@customElements('designer-components')
export default class DesignerComponents extends Module {
  private vStackComponents: VStack;
  private _screen: IScreen;
  private mdActions: Modal;
  private mdAlert: Alert;

  private currentComponent: IComponent = null;

  public onShowComponentPicker: () => void;
  onSelect: selectCallback;
  onVisible: visibleCallback;
  onDelete: selectCallback;

  get screen() {
    return this._screen;
  }

  set screen(value: IScreen) {
    this._screen = value;
    this.renderUI();
  }

  private renderUI() {
    if (!this.screen || !this.vStackComponents) return;
    this.vStackComponents.clearInnerHTML();
    this.vStackComponents.appendChild(
      <i-hstack gap={4} verticalAlignment="center" padding={{ top: 4, bottom: 4 }}>
        <i-icon name="mobile-alt" width={14} height={14} />
        <i-label caption={this.screen.name} font={{ size: '0.75rem' }} />
      </i-hstack>
    );
    if (this.screen.elements?.length) {
      this.renderTreeItems(this.screen.elements, this.vStackComponents, 0);
    }
  }

  private renderTreeItems(elements: IComponent[], parentElm: VStack, parentPl: number) {
    const vStack1 = new VStack(parentElm);
    for (const elm of elements) {
      const hStack = new HStack(vStack1, {
        gap: 2,
        width: '100%',
        verticalAlignment: 'center',
        padding: { left: parentPl + 2, right: 4, top: 6, bottom: 6 }
      });
      hStack.classList.add(rowItemHoverStyled, hoverFullOpacity);
      let icon: Icon;
      if (elm.items?.length) {
        let isShown = true;
        icon = new Icon(hStack, { name: 'caret-down', width: 12, height: 12, margin: { right: 2 }, cursor: 'pointer' });
        icon.onClick = () => {
          isShown = !isShown;
          icon.name = isShown ? 'caret-down' : 'caret-right';
          vStack2.visible = isShown;
        }
        const vStack2 = new VStack(vStack1);
        if (elm.items?.length) {
          this.renderTreeItems(elm.items, vStack2, parentPl + 12);
        }
      }
      const image = new Image(hStack, { url: elm.image, width: 14, height: 14, display: 'flex' });
      const label = new Label(hStack, { caption: elm.name, font: { size: '0.75rem' }, lineHeight: 1, opacity: 0.8 });
      const input = new Input(hStack, { value: elm.name, visible: false, font: { size: '0.75rem' }, border: 'none' });

      const hStackActions = new HStack(hStack, {
        gap: 8,
        position: 'relative',
        verticalAlignment: 'center',
        opacity: 0.8,
        margin: { left: 'auto' },
        padding: { left: 4 }
      });

      const onShowActions = (target: Control, event: MouseEvent, component: IComponent) => {
        this.currentComponent = component;
        const { pageX, pageY, screenX } = event;
        let x = pageX;
        if (pageX + 112 >= screenX) {
          x = screenX - 112;
        }
        this.onShowActions(pageY + 5, x);
      }

      hStackActions.appendChild(
        <i-icon
          name="ellipsis-h"
          width={'0.875rem'} height={'0.875rem'}
          opacity={0} cursor="pointer"
          onClick={(target: Control, event: MouseEvent) => onShowActions(target, event, elm)}
        />
      );
      hStackActions.appendChild(
        <i-icon
          name="eye"
          width={'0.875rem'} height={'0.875rem'}
          opacity={0} cursor="pointer"
          onClick={(icon: Icon) => this.onHideComponent(icon, elm)}
        />
      );

      hStack.onClick = () => {
        const currentElm = this.vStackComponents.querySelector(`.${rowItemActiveStyled}`);
        if (currentElm) currentElm.classList.remove(rowItemActiveStyled);
        hStack.classList.add(rowItemActiveStyled);
        if (this.onSelect) this.onSelect(elm);
      }
      hStack.onDblClick = () => {
        label.visible = image.visible = hStackActions.visible = false;
        if (icon) icon.visible = false;
        input.visible = true;
      }
      input.onBlur = () => {
        if (input.value) {
          console.log('on blur', input.value)
          label.caption = input.value;
          // TODO - update list
        } else {
          input.value = label.caption;
        }
        label.visible = image.visible = hStackActions.visible = true;
        image.display = 'flex';
        if (icon) icon.visible = true;
        input.visible = false;
      }
    }
  }

  private onHideComponent(icon: Icon, component: IComponent) {
    icon.name = icon.name === 'eye' ? 'eye-slash' : 'eye';
    if (this.onVisible) this.onVisible(component, icon.name === 'eye');
  }

  private onShowActions(top: number, left: number) {
    const mdWrapper = this.mdActions.querySelector('.modal-wrapper') as HTMLElement;
    mdWrapper.style.top = `${top}px`;
    mdWrapper.style.left = `${left}px`;
    this.mdActions.visible = true;
  }

  private async initModalActions() {
    this.mdActions = await Modal.create({
      visible: false,
      showBackdrop: false,
      minWidth: '11.25rem',
      height: 'auto',
      popupPlacement: 'bottomRight'
    });
    const itemActions = new VStack(undefined, { gap: 8, border: { radius: 8 } });
    itemActions.appendChild(
      <i-button
        background={{ color: 'transparent' }}
        boxShadow="none"
        icon={{ name: 'save', width: 12, height: 12 }}
        caption="Save Custom Block"
        class={iconButtonStyled}
      />
    );
    itemActions.appendChild(
      <i-button
        background={{ color: 'transparent' }}
        boxShadow="none"
        icon={{ name: 'copy', width: 12, height: 12 }}
        caption="Duplicate"
        class={iconButtonStyled} />
      );
    itemActions.appendChild(
      <i-button
        background={{ color: 'transparent' }}
        boxShadow="none"
        icon={{ name: 'trash', width: 12, height: 12 }}
        caption="Delete"
        class={iconButtonStyled}
        onClick={this.handleDelete.bind(this)}
      />
    );
    this.mdActions.item = itemActions;
    document.body.appendChild(this.mdActions);
  }

  private onConfirm() {
    const screen = this.screen?.elements[0]
    if (screen && this.currentComponent) {
      if (this.onDelete) this.onDelete({...this.currentComponent});
      if (screen.path === this.currentComponent.path) {
        screen.items = []
        this.screen = {
          ...this.screen,
          elements: []
        }
        this.currentComponent = null;
        return
      }
      this.removeElements(screen.items);
      this.currentComponent = null;
      this.renderUI();
    }
  }

  private removeElements(elements: IComponent[]) {
    for (let elm of elements) {
      if (elm.path === this.currentComponent.path) {
        const index = elements.indexOf(elm);
        if (index > -1) {
          elements.splice(index, 1);
        }
        return
      }
      if (elm.items) {
        this.removeElements(elm.items);
      }
    }
  }

  private onClose() {
    this.mdAlert.closeModal();
  }

  private handleDelete() {
    this.mdAlert.showModal();
  }

  init() {
    super.init();
    this.onSelect = this.getAttribute('onSelect', true) || this.onSelect;
    this.onVisible = this.getAttribute('onVisible', true) || this.onVisible;
    this.onDelete = this.getAttribute('onDelete', true) || this.onDelete;
    this.onShowComponentPicker = this.getAttribute('onShowComponentPicker', true) || this.onShowComponentPicker;
    this.initModalActions();
    this.screen = this.getAttribute('screen', true);
  }

  render() {
    return (
      <i-vstack
        width="100%"
        height="100%"
        maxWidth={Theme.layout.container.maxWidth}
        margin={{ left: "auto", right: "auto" }}
        position="relative"
        background={{ color: Theme.background.main }}
      >
        <i-hstack
          gap={8}
          verticalAlignment="center"
          horizontalAlignment="space-between"
          padding={{ top: 4, bottom: 4, left: 8 }}
          background={{ color: '#26324b' }}
        >
          <i-label caption="Structure" font={{ bold: true, size: '0.75rem' }} />
          <i-hstack verticalAlignment="center" margin={{ left: 'auto' }}>
            <i-icon
              name="history"
              class={hoverFullOpacity}
              opacity={0.8}
              cursor="pointer"
              width={28}
              height={24}
              padding={{ top: 4, bottom: 4, left: 6, right: 6 }}
              border={{
                left: { style: 'solid', color: Theme.divider, width: 1 },
                right: { style: 'solid', color: Theme.divider, width: 1 }
              }}
              tooltip={{
                content: 'View Deleted Components'
              }}
            />
            <i-icon
              name="plus-circle"
              class={hoverFullOpacity}
              opacity={0.8}
              cursor="pointer"
              width={28}
              height={24}
              padding={{ top: 4, bottom: 4, left: 6, right: 6 }}
              tooltip={{
                content: 'Add Component'
              }}
              onClick={() => this.onShowComponentPicker()}
            />
          </i-hstack>
        </i-hstack>
        <i-vstack id="vStackComponents" gap={4} overflow="auto" maxHeight="calc(100% - 32px)" />

        <i-alert
          id="mdAlert"
          title='Confirm'
          status='confirm'
          content='Are you sure to delete this component?'
          onConfirm={this.onConfirm.bind(this)}
          onClose={this.onClose.bind(this)}
        />
      </i-vstack>
    )
  }
}

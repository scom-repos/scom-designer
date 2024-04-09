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
import { hoverFullOpacity, iconButtonStyled, rowDragOverActiveStyled, rowItemActiveStyled, rowItemHoverStyled } from '../index.css';
import { IComponent, IScreen } from '../interface';
import './index.css';
import { getBreakpoint } from '../helpers/store';
const Theme = Styles.Theme.ThemeVars;

type visibleCallback = (component: IComponent, visible: boolean) => void;
type selectCallback = (component: IComponent) => void;

interface DesignerComponentsElement extends ControlElement {
  onShowComponentPicker: () => void;
  onSelect?: selectCallback;
  onVisible?: visibleCallback;
  onDelete?: selectCallback;
  onUpdate?: () => void;
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
  private _activeComponent: IComponent = null;
  private dragId: string = '';
  private activeId: string = '';
  private elementsMap: Map<string, IComponent> = new Map();

  public onShowComponentPicker: () => void;
  onSelect: selectCallback;
  onVisible: visibleCallback;
  onDelete: selectCallback;
  onUpdate: () => void;

  get screen() {
    return this._screen;
  }

  set screen(value: IScreen) {
    this._screen = value;
    this.renderUI();
  }

  get activeComponent() {
    return this._activeComponent;
  }
  set activeComponent(value: IComponent) {
    this._activeComponent = value;
    const elm = value?.path &&this.vStackComponents?.querySelector(`#elm-${value.path}`) as Control;
    this.updateActiveStyle(elm)
  }

  private updateActiveStyle(el: Control) {
    const currentElm = this.vStackComponents?.querySelector(`.${rowItemActiveStyled}`);
    if (currentElm) currentElm.classList.remove(rowItemActiveStyled);
    if (el) el.classList.add(rowItemActiveStyled);
  }

  renderUI() {
    this.elementsMap = new Map();
    if (!this.screen || !this.vStackComponents) return;
    this.vStackComponents.clearInnerHTML();
    this.vStackComponents.appendChild(
      <i-hstack visible={false} gap={4} verticalAlignment="center" padding={{ top: 4, bottom: 4 }}>
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
      hStack.setAttribute('draggable', 'true');
      hStack.id = `elm-${elm.path}`;
      this.elementsMap.set(hStack.id, elm);
      hStack.classList.add('drag-item', rowItemHoverStyled, hoverFullOpacity);
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
      const breakpoint = getBreakpoint();
      const queriesStr = elm.props?.mediaQueries;
      const mediaQueries = typeof queriesStr === 'string' ? JSON.parse(queriesStr.substring(1, queriesStr.length - 1)) : [];
      const breakpointProps = mediaQueries[breakpoint]?.properties || {};
      let isHidden = false;
      if (Object.hasOwnProperty.call(breakpointProps, 'visible')) {
        isHidden = breakpointProps['visible'] === "{false}" || breakpointProps['visible'] === false;
      } else {
        isHidden = elm.props?.visible === "{false}" || elm.props?.visible === false;
      }
      hStackActions.appendChild(
        <i-icon
          name={isHidden ? 'eye-slash' : 'eye'}
          width={'0.875rem'} height={'0.875rem'}
          opacity={isHidden ? 1 : 0}
          cursor="pointer"
          onClick={(icon: Icon) => this.onHideComponent(icon, elm)}
        />
      );

      hStack.onClick = () => {
        this.updateActiveStyle(hStack);
        if (this.onSelect) this.onSelect(elm);
      }
      hStack.onDblClick = () => {
        label.visible = image.visible = hStackActions.visible = false;
        if (icon) icon.visible = false;
        input.visible = true;
      }
      input.onBlur = () => {
        if (input.value) {
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

  private initEvents() {
    this.addEventListener('dragstart', (event) => {
      const target = (event.target as HTMLElement).closest('.drag-item');
      if (!target) {
        event.preventDefault()
        return;
      }
      this.dragId = target.id;
    })

    this.addEventListener('dragend', (event) => {
      if (!this.dragId) {
        event.preventDefault();
        return;
      }
      this.changeParent(this.dragId, this.activeId);
      const currentElm = this.vStackComponents.querySelector(`.${rowDragOverActiveStyled}`);
      if (currentElm) currentElm.classList.remove(rowDragOverActiveStyled);
      this.dragId = null;
    })

    this.addEventListener('dragover', (event) => {
      event.preventDefault();
      if (!this.dragId) {
        event.preventDefault();
        return;
      }
      this.showHightlight(event.x, event.y);
    });

    this.addEventListener('drop', (event) => {
      if (!this.dragId) {
        event.preventDefault();
        return;
      }
    });
  }

  private showHightlight(x: number, y: number) {
    const elms = this.vStackComponents.querySelectorAll('.drag-item');
    for (let elm of elms) {
      const rect = elm.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        const currentElm = this.vStackComponents.querySelector(`.${rowDragOverActiveStyled}`);
        if (currentElm) currentElm.classList.remove(rowDragOverActiveStyled);
        elm.classList.add(rowDragOverActiveStyled);
        this.activeId = elm?.id;
      }
    }
  }

  private changeParent(dragId: string, targetId: string) {
    const targetData = this.elementsMap.get(targetId);
    const dragData = this.elementsMap.get(dragId);
    if (!dragData || !targetData) return;

    const parentPath = this.getParentID(this.screen.elements[0], dragId);

    const targetItems = targetData?.items || [];
    const posProps = ['left', 'top', 'right', 'bottom', 'position'];
    if (dragData) {
      for (let prop in dragData.props) {
        if (posProps.includes(prop))
          delete dragData.props[prop];
      }
      targetItems.push(dragData);
      targetData.items = [...targetItems];
      this.elementsMap.set(targetId, targetData);
      this.elementsMap.delete(dragId);
    }

    const parentId = parentPath && `elm-${parentPath}`;
    const parentData = parentId && this.elementsMap.get(parentId);
    if (parentData) {
      parentData.items = parentData.items || [];
      const findedIndex = parentData.items.findIndex(x => x.path === dragId.replace('elm-', ''));
      parentData.items.splice(findedIndex, 1);
      this.elementsMap.set(parentId, parentData);
    }
    this.renderUI();
    if (this.onUpdate) this.onUpdate();
  }

  private getParentID(el: IComponent, id: string) {
    const path = id.replace('elm-', '');
    if (el.path === path) return null;
    if (el.items) {
      for (const item of el.items) {
        if (item.path === path) return el.path;
        const parent = this.getParentID(item, id);
        if (parent) return parent;
      }
    }
    return null;
  }

  private onHideComponent(icon: Icon, component: IComponent) {
    icon.name = icon.name === 'eye' ? 'eye-slash' : 'eye';
    if (icon.name === 'eye-slash') icon.opacity = 1
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
    this.onUpdate = this.getAttribute('onUpdate', true) || this.onUpdate;
    this.onShowComponentPicker = this.getAttribute('onShowComponentPicker', true) || this.onShowComponentPicker;
    this.initModalActions();
    this.screen = this.getAttribute('screen', true);
    this.initEvents();
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

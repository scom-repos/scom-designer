import {
  Module,
  Styles,
  Control,
  Input,
  VStack,
  customElements,
  ControlElement,
  Icon,
  Label,
  HStack,
  Modal,
  Panel,
  IdUtils,
  Alert
} from '@ijstech/components'
import { hoverFullOpacity, rowItemActiveStyled, rowItemHoverStyled, iconButtonStyled } from '../index.css';
import { IScreen } from '../interface';
const Theme = Styles.Theme.ThemeVars;

interface DesignerScreensElement extends ControlElement {
  onScreenChanged: callbackType;
  onScreenHistoryShown: callbackShowType;
}

type callbackType = (screen?: IScreen) => void;
type callbackShowType = (shown: boolean) => void;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-screens']: DesignerScreensElement
    }
  }
}

@customElements('designer-screens')
export default class DesignerScreens extends Module {
  private wrapperScreens: VStack;
  private wrapperDeletedScreens: VStack;
  private vStackScreens: VStack;
  private vStackDeletedScreens: VStack;
  private lbScreens: Label;
  private lbDeletedScreens: Label;
  private mdActions: Modal;
  private mdAlert: Alert;

  private listScreen: IScreen[] = [];
  private selectedId: string = '';
  public onScreenChanged: callbackType;
  public onScreenHistoryShown: callbackShowType;

  onShow(options?: any): void {

  }

  get screens() {
    return this.listScreen;
  }

  private onHideScreen(icon: Icon, id: string) {
    const idx = this.listScreen.findIndex(screen => screen.id === id);
    this.listScreen[idx].isHidden = !this.listScreen[idx].isHidden;
    if (this.listScreen[idx].isHidden) {
      icon.name = 'eye-slash';
    } else {
      icon.name = 'eye';
    }
  }

  private onShowModalDelete(id: string) {
    this.mdAlert.title = 'Delete Screen';
    this.mdAlert.status = 'confirm';
    this.mdAlert.content = 'Are you sure you want to delete this Screen?';
    this.mdAlert.onConfirm = () => this.onDeleteScreen(id);
    this.mdAlert.showModal();
  }

  private onDeleteScreen(id: string) {
    const idx = this.listScreen.findIndex(screen => screen.id === id);
    const deletedScreen = this.listScreen[idx];
    this.listScreen[idx].isDeleted = true;
    const screenElm = this.vStackScreens.querySelector(`#screen-${id}`);
    this.vStackScreens.removeChild(screenElm);
    this.mdActions.visible = false;
    this.lbScreens.caption = `Screens (${this.listScreen.filter(v => !v.isDeleted).length})`;
    this.lbDeletedScreens.caption = `Deleted Screens (${this.listScreen.filter(v => v.isDeleted).length})`;

    const onRestore = () => {
      this.listScreen[idx].isDeleted = false;
      this.onAddScreen(deletedScreen.name, deletedScreen.elements, deletedScreen.id);
      this.vStackDeletedScreens.removeChild(pnl);
      this.lbDeletedScreens.caption = `Deleted Screens (${this.listScreen.filter(v => v.isDeleted).length})`;
    }
    const pnl = new Panel();
    pnl.appendChild(<i-hstack
      verticalAlignment="center"
      horizontalAlignment="space-between"
      padding={{ top: 4, bottom: 4, left: 8, right: 8 }}
      class={`${hoverFullOpacity} ${rowItemHoverStyled}`}
    >
      <i-label caption={`${deletedScreen.name} (Deleted)`} font={{ size: '0.75rem' }} />
      <i-icon name="trash-restore" width={14} height={14} opacity={0} cursor="pointer" tooltip={{ content: 'Restore Deleted Screen' }} onClick={onRestore} />
    </i-hstack>);
    this.vStackDeletedScreens.appendChild(pnl);
  }

  private onDuplicateScreen(id: string) {
    const screen = this.listScreen.find(screen => screen.id === id);
    this.onAddScreen(screen.name, screen.elements);
    this.mdActions.visible = false;
  }

  private getNewName(name: string) {
    let newName = name;
    while (this.listScreen.some(screen => screen.name === newName && !screen.isDeleted)) {
      const regex = /(\d+)$/;
      const matches = newName.match(regex);
      if (matches) {
        const lastNumber = parseInt(matches[1]);
        const updatedString = newName.replace(/\s\d+$/, '');
        newName = `${updatedString} ${lastNumber + 1}`;
      } else {
        newName = `${newName} 1`;
      }
    }
    return newName;
  }

  private onUpdateName(id: string, name: string) {
    const idx = this.listScreen.findIndex(screen => screen.id === id);
    this.listScreen[idx].name = name;
  }

  private onAddScreen(name: string, elements?: any[], _id?: string) {
    const _name = this.getNewName(name);
    const id = _id || IdUtils.generateUUID();
    if (!_id) {
      const obj = {
        id,
        name: _name,
        elements: elements || []
      }
      this.listScreen.push(obj);
    } else {
      const index = this.listScreen.findIndex(v => v.id === _id);
      this.listScreen[index].name = _name;
    }
    const lb = new Label(undefined, { caption: _name, font: { size: '0.75rem' } });
    const input = new Input(undefined, { width: '100%', value: _name, visible: false, font: { size: '0.75rem' }, border: 'none' });
    input.onBlur = () => {
      if (input.value) {
        lb.caption = this.getNewName(input.value);
        this.onUpdateName(id, lb.caption);
      } else {
        input.value = lb.caption;
      }
      lb.visible = true;
      hStackActions.visible = true;
      input.visible = false;
    }

    const onEditName = () => {
      lb.visible = false;
      hStackActions.visible = false;
      input.visible = true;
    }

    const onShowActions = (target: Control, event: MouseEvent) => {
      this.selectedId = id;
      onScreenChanged();
      const { pageX, pageY, screenX } = event;
      let x = pageX;
      if (pageX + 112 >= screenX) {
        x = screenX - 112;
      }
      this.onShowActions(pageY + 5, x);
    }

    const onScreenChanged = () => {
      for (const elm of this.vStackScreens.children) {
        elm.classList.remove(rowItemActiveStyled);
      }
      pnl.classList.add(rowItemActiveStyled);
      this.onScreenChanged(this.listScreen.find(screen => screen.id === id));
    }

    const hStackActions = new HStack(undefined, {
      gap: 8,
      position: 'relative',
      verticalAlignment: 'center',
      opacity: 0.8,
      margin: { left: 4 }
    });
    hStackActions.appendChild(<i-icon name="ellipsis-h" width={14} height={14} opacity={0} cursor="pointer" onClick={onShowActions} />);
    hStackActions.appendChild(<i-icon name="eye" width={14} height={14} opacity={0} cursor="pointer" onClick={(icon: Icon) => this.onHideScreen(icon, id)} />);

    const pnl = new Panel();
    pnl.id = `screen-${id}`;
    pnl.onClick = () => onScreenChanged();
    pnl.appendChild(
      <i-hstack
        verticalAlignment="center"
        horizontalAlignment="space-between"
        padding={{ top: 4, bottom: 4, left: 8, right: 8 }}
        class={`${hoverFullOpacity} ${rowItemHoverStyled}`}
        onDblClick={onEditName}
      >
        {lb}
        {input}
        {hStackActions}
      </i-hstack>
    );
    this.vStackScreens.appendChild(pnl);
    this.lbScreens.caption = `Screens (${this.listScreen.filter(v => !v.isDeleted).length})`;
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
      minWidth: '7rem',
      height: 'auto',
      popupPlacement: 'bottomRight'
    });
    const itemActions = new VStack(undefined, { gap: 8, border: { radius: 8 } });
    itemActions.appendChild(<i-button background={{ color: 'transparent' }} boxShadow="none" icon={{ name: 'copy', width: 12, height: 12 }} caption="Duplicate" class={iconButtonStyled} onClick={() => this.onDuplicateScreen(this.selectedId)} />);
    itemActions.appendChild(<i-button background={{ color: 'transparent' }} boxShadow="none" icon={{ name: 'trash', width: 12, height: 12 }} caption="Delete" class={iconButtonStyled} onClick={() => this.onShowModalDelete(this.selectedId)} />);
    this.mdActions.item = itemActions;
    document.body.appendChild(this.mdActions);
  }

  private onShowDeletedScreens(value: boolean) {
    this.wrapperScreens.visible = !value;
    this.wrapperDeletedScreens.visible = value;
    this.onScreenHistoryShown(value);
  }

  init() {
    super.init();
    this.initModalActions();
    this.onScreenChanged = this.getAttribute('onScreenChanged', true) || this.onScreenChanged;
    this.onScreenHistoryShown = this.getAttribute('onScreenHistoryShown', true) || this.onScreenHistoryShown;
    this.onAddScreen('Blank');
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
        <i-vstack id="wrapperScreens" height="100%">
          <i-hstack
            gap={8}
            verticalAlignment="center"
            horizontalAlignment="space-between"
            padding={{ top: 4, bottom: 4, left: 8 }}
            background={{ color: '#26324b' }}
          >
            <i-hstack gap={8} verticalAlignment="center" wrap="wrap">
              <i-label id="lbScreens" caption="Screens (1)" font={{ bold: true, size: '0.75rem' }} />
              <i-label caption="Last Updated" font={{ bold: true, size: '0.75rem' }} opacity={0.8} />
            </i-hstack>
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
                  content: 'View Deleted Screens'
                }}
                onClick={() => this.onShowDeletedScreens(true)}
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
                  content: 'Add Screen'
                }}
                onClick={() => this.onAddScreen('Blank')}
              />
            </i-hstack>
          </i-hstack>
          <i-vstack id="vStackScreens" gap={2} overflow="auto" maxHeight="calc(100% - 32px)" />
        </i-vstack>

        <i-vstack id="wrapperDeletedScreens" visible={false}>
          <i-hstack
            gap={8}
            verticalAlignment="center"
            horizontalAlignment="space-between"
            padding={{ top: 4, bottom: 4, left: 8 }}
            background={{ color: '#26324b' }}
          >
            <i-label id="lbDeletedScreens" caption="Deleted Screens (0)" font={{ bold: true, size: '0.75rem' }} />
            <i-icon
              name="history"
              margin={{ left: 'auto' }}
              class={hoverFullOpacity}
              opacity={0.8}
              cursor="pointer"
              width={28}
              height={24}
              padding={{ top: 4, bottom: 4, left: 6, right: 6 }}
              border={{
                left: { style: 'solid', color: Theme.divider, width: 1 },
              }}
              tooltip={{
                content: 'View Live Screens'
              }}
              onClick={() => this.onShowDeletedScreens(false)}
            />
          </i-hstack>
          <i-vstack id="vStackDeletedScreens" gap={2} overflow="auto" />
        </i-vstack>

        <i-alert id="mdAlert" />
      </i-vstack>
    )
  }
}

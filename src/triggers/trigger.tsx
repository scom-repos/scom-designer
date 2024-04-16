import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Input,
  DataGrid,
  DataGridCell
} from '@ijstech/components'
import { onEventChangedCallback, onEventDblClickCallback } from '../interface';
const Theme = Styles.Theme.ThemeVars;

interface DesignerTriggerElement extends ControlElement {
  events?: {[name: string]: any};
  props?: {[name: string]: any};
  onChanged?: onEventChangedCallback;
  onEventDblClick?: onEventDblClickCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-trigger']: DesignerTriggerElement
    }
  }
}

@customElements('designer-trigger')
export default class DesignerTrigger extends Module {
  private vStackContent: VStack;
  private gdEvents: DataGrid

  private _events: {[name: string]: any} = {};
  private _props: {[name: string]: any} = {};

  onChanged: onEventChangedCallback;
  onEventDblClick: onEventDblClickCallback;

  constructor(parent?: Container, options?: DesignerTriggerElement) {
    super(parent, options);
  }

  static async create(options?: DesignerTriggerElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get events() {
    return this._events;
  }
  set events(value: {[name: string]: any}) {
    this._events = value;
  }

  get props() {
    return this._props;
  }
  set props(value: {[name: string]: any}) {
    this._props = value;
  }

  setData({events, props}: {events: {[name: string]: any}, props?: {[name: string]: any}}) {
    this._events = events;
    this._props = props;
    this.renderUI();
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {
    // this.vStackContent.clearInnerHTML();
    // const events = Object.keys(this.events);
    // for (let key of events) {
    //   let func = this.props?.[key] || '';
    //   if (func.startsWith("this.")) func = func.substring(5);
    //   const elm = <i-vstack gap={8}>
    //     <i-label caption={key} font={{ size: '0.725rem', bold: true }} />
    //     <i-input
    //       inputType="text"
    //       height={24} width={`100%`}
    //       padding={{top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem'}}
    //       border={{radius: '0.5rem', style: 'none'}}
    //       font={{size: '0.875rem'}}
    //       value={func}
    //       onKeyUp={(target: Input, event: KeyboardEvent) => this.onInputChanged(target, event, key)}
    //       onDblClick={() => this.onEventDblClick && this.onEventDblClick(func)}
    //     ></i-input>
    //   </i-vstack>
    //   this.vStackContent.appendChild(elm)
    // }
    this.gdEvents.rowCount = 0;
    this.gdEvents.fixedCol = 1;
    let row = 1;
    for (let name in this.events) {
      this.gdEvents.rowCount = row + 1;
      this.gdEvents.cells(0, row).value = name;
      let value = this.props?.[name] || '';
      if (typeof value === "string" && value.startsWith("this.")) {
        value = value.substring(5);
      }
      this.gdEvents.cells(1, row).value = value;
      ++row;
    };
    this.gdEvents.fixedRow = 0;
  }

  private onInputChanged(source: DataGrid, cell: DataGridCell, oldValue: any, newValue: any) {
    const prop = source.cells(0, cell.row).value;
    this.onChanged && this.onChanged(prop, newValue, oldValue);
  }

  private onHandleDbClick(source: DataGrid) {
    const funcName = source.cells(1, source.row).value;
    this.onEventDblClick && this.onEventDblClick(funcName);
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    this.onEventDblClick = this.getAttribute('onEventDblClick', true) || this.onEventDblClick;
    const events = this.getAttribute('events', true);
    const props = this.getAttribute('props', true);
    if (events) this.setData({ events, props });
    this.gdEvents.fixedRow = 0;
    this.gdEvents.fixedCol = 1;
    this.gdEvents.colCount = 2;
    this.gdEvents.onCellChange = this.onInputChanged.bind(this);
    this.gdEvents.onDblClick = this.onHandleDbClick.bind(this);
  }

  render() {
    return (
      <i-vstack
        width="100%"
        height="100%"
        margin={{ left: "auto", right: "auto" }}
        position="relative"
      >
        <designer-tool-header name="Trigger" tooltipText="Add a trigger for an action." onCollapse={this.onCollapse} hasClear={false} />
        <i-vstack
          id="vStackContent"
          gap={16}
          padding={{ top: 16, bottom: 16, left: 12, right: 12 }}
          position='relative'
          stack={{grow: '1', shrink: '1'}}
        >
          <i-data-grid id="gdEvents" dock='fill'></i-data-grid>
          {/* <i-grid-layout
            templateColumns={['auto', '60px']}
            verticalAlignment="center"
            padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
            border={{ radius: 4 }}
            background={{ color: '#26324b' }}
            cursor="pointer"
          >
            <i-vstack gap={4}>
              <i-hstack gap={4} verticalAlignment="center">
                <i-icon name="hand-point-up" width={14} height={14} />
                <i-label caption="On Screen Focus" font={{ size: '0.725rem', bold: true }} />
              </i-hstack>
              <i-label caption="Runs when the screen comes into focus" font={{ size: '0.725rem' }} opacity={0.8} />
            </i-vstack>
            <i-label
              caption="0"
              font={{ size: '0.625rem' }}
              padding={{ top: 2, bottom: 2, left: 4, right: 4 }}
              border={{ radius: 4, width: 1, style: 'solid', color: Theme.divider }}
            />
          </i-grid-layout> */}
        </i-vstack>
      </i-vstack>
    )
  }
}

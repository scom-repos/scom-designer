import {
  Module,
  customElements,
  Styles,
  Panel,
  GridLayout,
  Input,
  ControlElement,
  Container,
  Control
} from '@ijstech/components'
import {
  DesignerScreens,
  DesignerComponents,
  DesignerProperties,
  DesignerPickerComponents,
  DesignerPickerBlocks
} from './components/index'
import { IComponentPicker, IScreen } from './interface'
import { customLabelTabStyled, labelActiveStyled } from './index.css'
import {
  blockComponents,
  pickerComponents,
  recentComponents,
  screen,
} from './data'
import { borderRadiusLeft, borderRadiusRight } from './tools/index'
const Theme = Styles.Theme.ThemeVars

enum TABS {
  RECENT,
  BITS,
  BLOCKS,
}

interface ScomDesignerElement extends ControlElement {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-designer']: ScomDesignerElement
    }
  }
}

interface IFileHandler {
  openFile(file: IIPFSData, transportEndpoint: string, parentCid: string, parent: Control): Promise<void>;
}

interface IIPFSData {
  cid: string;
  name?: string;
  size?: number;
  type?: string | 'dir' | 'file';
  links?: IIPFSData[];
  path?: string;
  sort?: 'asc' | 'desc';
  root?: boolean;
}

@customElements('i-scom-designer')
export class ScomDesigner extends Module implements IFileHandler {
  private designerScreens: DesignerScreens
  private designerComponents: DesignerComponents
  private designerProperties: DesignerProperties
  private pnlComponentPicker: Panel
  private pnlBlockPicker: Panel
  private wrapperComponentPicker: Panel
  private wrapperTab: GridLayout
  private inputSearch: Input
  private currentTab = TABS.BITS

  constructor(parent?: Container, options?: any) {
    super(parent, options)
  }

  static async create(options?: ScomDesignerElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get pickerComponentsFiltered() {
    let components: IComponentPicker[]
    if (this.currentTab === TABS.RECENT) {
      components = recentComponents
    } else {
      components = pickerComponents
    }
    if (this.inputSearch.value) {
      const val = this.inputSearch.value.toLowerCase()
      components = components
        .map((component) => {
          const filteredItems = component.items.filter((item) =>
            item.caption.toLowerCase().includes(val)
          )
          return {
            ...component,
            items: filteredItems,
          }
        })
        .filter((component) => component.items.length > 0)
    }
    return components
  }

  get pickerBlocksFiltered() {
    if (this.inputSearch.value) {
      return blockComponents.filter((v) =>
        v.caption.toLowerCase().includes(this.inputSearch.value.toLowerCase())
      )
    }
    return blockComponents
  }

  private onScreenChanged(screen: IScreen) {}

  private onScreenHistoryShown(shown: boolean) {
    this.designerComponents.visible = !shown
    this.designerScreens.height = shown ? '100%' : '40%'
  }

  private onTabChanged(value: number) {
    if (this.currentTab === value) return
    for (let i = 0; i < this.wrapperTab.children.length; i++) {
      if (value === i) {
        this.wrapperTab.children[i].classList.add(labelActiveStyled)
      } else {
        this.wrapperTab.children[i].classList.remove(labelActiveStyled)
      }
    }
    this.currentTab = value
    const isBlock = value === TABS.BLOCKS
    if (isBlock) {
      this.initBlockPicker()
    } else {
      this.initComponentPicker()
    }
    this.pnlComponentPicker.visible = !isBlock
    this.pnlBlockPicker.visible = isBlock
  }

  private onFilterComponent() {
    if (this.currentTab === TABS.BLOCKS) {
      this.initBlockPicker()
    } else {
      this.initComponentPicker()
    }
  }

  private onShowComponentPicker() {
    this.wrapperComponentPicker.visible = true
  }

  private onCloseComponentPicker() {
    this.wrapperComponentPicker.visible = false
  }

  private initComponentPicker() {
    const nodeItems: HTMLElement[] = []
    for (const picker of this.pickerComponentsFiltered) {
      const pickerElm = new DesignerPickerComponents(undefined, {
        ...picker,
        display: 'block',
        margin: { bottom: 1 },
      })
      nodeItems.push(pickerElm)
    }
    this.pnlComponentPicker.clearInnerHTML()
    this.pnlComponentPicker.append(...nodeItems)
  }

  private initBlockPicker() {
    const pickerElm = new DesignerPickerBlocks(undefined, {
      items: this.pickerBlocksFiltered,
    })
    this.pnlBlockPicker.clearInnerHTML()
    this.pnlBlockPicker.append(pickerElm)
  }

  private initComponentScreen() {
    this.designerComponents.screen = screen
  }

  private initDesignerProperties() {
    this.designerProperties.component = {
      path: '',
      caption: 'First Screen',
      iconName: 'mobile-alt',
      category: 'Screen',
    }
  }

  private renderUI() {
    this.initComponentPicker()
    this.initBlockPicker()
    this.initComponentScreen()
    this.initDesignerProperties()
  }

  init() {
    super.init()
    this.wrapperComponentPicker.style.borderBottom = 'none'
    this.renderUI()
  }

  async openFile(file: IIPFSData, endpoint: string, parentCid: string, parent: Control) {
    parent.append(this);
    const path = file.path.startsWith('/') ? file.path.slice(1) : file.path;
    const mediaUrl = `${endpoint}/ipfs/${parentCid}/${path}`;
    console.log('Open: ', mediaUrl)
    // TODO: fetch data
  }

  render() {
    return (
      <i-vstack
        width='100%'
        height='100%'
        maxWidth={Theme.layout.container.maxWidth}
        margin={{ left: 'auto', right: 'auto' }}
        position='relative'
      >
        <i-hstack width='100%' height='100%'>
          <i-vstack
            width='100%'
            height='100%'
            border={{
              top: { width: 1, style: 'solid', color: Theme.divider },
            }}
            maxWidth={300}
          >
            <designer-screens
              id='designerScreens'
              height='40%'
              minHeight={160}
              onScreenChanged={this.onScreenChanged}
              onScreenHistoryShown={this.onScreenHistoryShown}
            />
            <designer-components
              id='designerComponents'
              height='60%'
              minHeight={200}
              onShowComponentPicker={this.onShowComponentPicker}
            />
          </i-vstack>
          <i-vstack
            id='wrapperComponentPicker'
            visible={false}
            width={250}
            height='100%'
            border={{
              width: 1,
              style: 'solid',
              color: Theme.divider,
              bottom: { width: 0 },
            }}
            background={{ color: Theme.background.main }}
            overflow='auto'
          >
            <i-vstack
              gap={12}
              padding={{ top: 12, bottom: 12, left: 8, right: 8 }}
              border={{
                bottom: { width: 1, style: 'solid', color: Theme.divider },
              }}
            >
              <i-hstack
                gap={8}
                verticalAlignment='center'
                horizontalAlignment='space-between'
              >
                <i-label
                  caption='Add Components'
                  font={{ size: '0.75rem', bold: true }}
                />
                <i-icon
                  name='times'
                  width={14}
                  height={14}
                  cursor='pointer'
                  onClick={this.onCloseComponentPicker}
                />
              </i-hstack>
              <i-grid-layout
                id='wrapperTab'
                width='100%'
                background={{ color: Theme.action.hoverBackground }}
                templateColumns={['1fr', '1fr', '1fr']}
                class={`${borderRadiusLeft} ${borderRadiusRight}`}
              >
                <i-label
                  caption='Recent'
                  class={`${customLabelTabStyled} ${borderRadiusLeft}`}
                  onClick={() => this.onTabChanged(TABS.RECENT)}
                />
                <i-label
                  caption='Bits'
                  class={`${customLabelTabStyled} ${labelActiveStyled}`}
                  border={{
                    radius: 0,
                    left: { width: 1, style: 'solid', color: Theme.divider },
                    right: { width: 1, style: 'solid', color: Theme.divider },
                  }}
                  onClick={() => this.onTabChanged(TABS.BITS)}
                />
                <i-label
                  caption='Blocks'
                  class={`${customLabelTabStyled} ${borderRadiusRight}`}
                  onClick={() => this.onTabChanged(TABS.BLOCKS)}
                />
              </i-grid-layout>
              <i-input
                id='inputSearch'
                placeholder='Search'
                width='100%'
                height={24}
                border={{
                  radius: 8,
                  width: 0,
                }}
                padding={{ left: 4, right: 4 }}
                font={{ size: '0.75rem' }}
                onChanged={this.onFilterComponent}
              />
            </i-vstack>
            <i-panel id='pnlComponentPicker' width='100%' />
            <i-panel id='pnlBlockPicker' width='100%' visible={false} />
          </i-vstack>
          <designer-properties
            id='designerProperties'
            margin={{ left: 'auto' }}
            display='flex'
          />
        </i-hstack>
      </i-vstack>
    )
  }
}

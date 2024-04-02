import {
  Module,
  Styles,
  ControlElement,
  customElements,
  HStack,
  Container,
  StackLayout
} from '@ijstech/components'
import { customTabStyled } from '../index.css';
import { IControl } from '../interface';
import {
  DesignerToolStylesheet,
  borderRadiusLeft,
  borderRadiusRight,
  DesignerToolLayout,
  DesignerToolBackground,
  DesignerToolSize,
  DesignerToolMarginsAndPadding,
  DesignerToolPosition,
  DesignerToolBorders,
  DesignerToolEffects,
  DesignerToolContent,
  DesignerToolGroup,
  DesignerSelector
} from '../tools/index';
import '../settings/index';
import '../triggers/index';
import '../setting-data/index';
import { breakpoints, previews } from '../helpers/config';
import { parseProps } from '../helpers/utils';
const Theme = Styles.Theme.ThemeVars;

type onChangedCallback = (prop: string, value: any) => void

interface DesignerPropertiesElement extends ControlElement {
  component?: IControl;
  onChanged?: onChangedCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-properties']: DesignerPropertiesElement
    }
  }
}

@customElements('designer-properties')
export default class DesignerProperties extends Module {
  private hStackInfo: HStack;
  private designerStylesheet: DesignerToolStylesheet;
  private designerLayout: DesignerToolLayout;
  private designerBackground: DesignerToolBackground;
  private designerSize: DesignerToolSize;
  private designerSpacing: DesignerToolMarginsAndPadding;
  private designerPosition: DesignerToolPosition;
  private designerBorders: DesignerToolBorders;
  private designerEffects: DesignerToolEffects;
  private designerContent: DesignerToolContent;
  private customGroup: DesignerToolGroup;
  private breakpointSelector: DesignerSelector;
  private previewSelector: DesignerSelector;

  private _component: IControl;

  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    this.onPropChanged = this.onPropChanged.bind(this);
  }

  static async create(options?: DesignerPropertiesElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get component() {
    return this._component;
  }

  set component(value: IControl) {
    this._component = value;
    this.renderUI();
  }

  private renderUI() {
    this.updateInfo();
    this.updateProps();
    this.renderCustomGroup();
  }

  private renderCustomGroup() {
    const designProps = parseProps(this.component?.control._getDesignProps());
    const dataSchema: any = this.component?.control._getCustomProperties()?.dataSchema || null;

    this.customGroup.setData({
      title: 'Custom Properties',
      tooltip: 'Set custom properties for component',
      uiSchema: null,
      dataSchema: dataSchema,
      props: {...designProps}
    })
  }

  private updateInfo() {
    if (!this.hStackInfo) return;
    const { name, image, icon, category } = this.component;
    this.hStackInfo.clearInnerHTML();
    this.hStackInfo.appendChild(
      <i-hstack gap={8} verticalAlignment="center" width="100%">
        {icon ? <i-icon name={icon} width={'1.5rem'} height={'1.5rem'} /> : image ? <i-image url={image} width={'1.5rem'} height={'1.5rem'} /> : []}
        <i-label caption={name} font={{ size: '1rem', bold: true }} />
        <i-label caption={category || ''} opacity={0.6} font={{ size: '0.625rem' }} margin={{ left: 'auto' }} display="flex" />
      </i-hstack>
    )
  }

  private updateProps() {
    const control = this.component.control;
    const {
      margin,
      padding,
      background,
      width,
      height,
      opacity,
      position,
      zIndex,
      border,
      top,
      right,
      bottom,
      left,
      overflow,
      display,
      stack,
      font
    } = control;
    const computedStyle =  window.getComputedStyle(control);
    const designerProps: any = this.component.control._getDesignProps();
    this.designerBackground.setData({ color: background?.color || '' })
    this.designerSize.setData({
      width: this.getValue(width, designerProps?.width, computedStyle?.width),
      height: this.getValue(height, designerProps?.height, computedStyle?.height),
    })
    this.designerEffects.setData({ opacity })
    let marginObj = {}
    let paddingObj = {}
    if (margin) {
      marginObj = {
        top: this.getValue(margin.top, designerProps?.margin?.top, computedStyle?.marginTop),
        bottom: this.getValue(margin.bottom, designerProps?.margin?.bottom, computedStyle?.marginBottom),
        left: this.getValue(margin.left, designerProps?.margin?.left, computedStyle?.marginLeft),
        right: this.getValue(margin.right, designerProps?.margin?.right, computedStyle?.marginRight),
      }
    }
    if (padding) {
      paddingObj = {
        top: this.getValue(padding.top, designerProps?.padding?.top, computedStyle?.paddingTop),
        bottom: this.getValue(padding.bottom, designerProps?.padding?.bottom, computedStyle?.paddingBottom),
        left: this.getValue(padding.left, designerProps?.padding?.left, computedStyle?.paddingLeft),
        right: this.getValue(padding.right, designerProps?.padding?.right, computedStyle?.paddingRight),
      }
    }
    this.designerSpacing.setData({
      margin: marginObj,
      padding: paddingObj
    });
    this.designerPosition.setData({
      position,
      zIndex,
      top: this.getValue(top, designerProps?.top, computedStyle?.top),
      left: this.getValue(left, designerProps?.left, computedStyle?.left),
      right: this.getValue(right, designerProps?.right, computedStyle?.right),
      bottom: this.getValue(bottom, designerProps?.bottom, computedStyle?.bottom),
      overflow: (overflow?.y === 'hidden') ? 'hidden' : 'auto'
    })
    let borderObj = {}
    if (border) {
      const topObj: any = border.top || {}
      topObj.width = this.getValue(topObj.width, designerProps?.border?.top?.width, computedStyle?.borderTopWidth)
      const bottomObj: any = border.bottom || {}
      bottomObj.width = this.getValue(bottomObj.width, designerProps?.border?.bottom?.width, computedStyle?.borderBottomWidth)
      const leftObj: any = border.left || {}
      leftObj.width = this.getValue(leftObj.width, designerProps?.border?.left?.width, computedStyle?.borderLeftWidth)
      const rightObj: any = border.right || {}
      rightObj.width = this.getValue(rightObj.width, designerProps?.border?.right?.width, computedStyle?.borderRightWidth)
      borderObj = {
        top: topObj,
        right: rightObj,
        bottom: bottomObj,
        left: leftObj,
        radius: this.getValue(border.radius, designerProps?.border?.radius, computedStyle?.borderRadius),
        width: this.getValue(border.width, designerProps?.border?.width, computedStyle?.borderWidth),
        style: border.style,
        color: border.color
      }
    }
    this.designerBorders.setData({
      border: borderObj
    })
    this.designerLayout.setData({
      name: this.component?.name,
      display: display || control?.style.display,
      stack,
      direction: (control as StackLayout).direction
    })
    this.designerContent.setData({
      font
    })
  }

  private getValue(controlVal: any, designVal: any, computedVal: any) {
    const hasUnit = (value: string|number) => {
      if (value === undefined || value === '') return true
      if (typeof value === 'number') return true
      return value.includes('px') || value.includes('%')
    }
    if (designVal !== undefined) return designVal;
    return hasUnit(controlVal) ? controlVal : (computedVal || controlVal || undefined)
  }

  private onPropChanged(prop: string, value: any) {
    if (this.onChanged) this.onChanged(prop, value);
  }

  private onGroupChanged(data: any) {
    for (let prop in data) {
      this.onPropChanged(prop, data[prop]);
    }
  }

  private onBreakpointClick(type: string, value: any) {
    console.log('break point  clicked', type, value)
  }

  private onPreviewClick(type: string, value: any) {
    console.log('preview clicked', type, value)
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    const component = this.getAttribute('component', true);
    if (component) this.component = component;
    this.breakpointSelector.activeItem = breakpoints[0].value;
    this.previewSelector.activeItem = previews[0].value;
  }

  render() {
    return (
      <i-vstack
        width={360}
        height="100%"
        minWidth={350}
        maxWidth="100%"
        margin={{ left: "auto", right: "auto" }}
        position="relative"
        background={{ color: Theme.background.main }}
        border={{ top: { width: 1, style: 'solid', color: Theme.divider } }}
        gap={1}
      >
        <i-hstack
          gap={4} width="100%"
          verticalAlignment="center" horizontalAlignment="space-between"
          padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
          background={{ color: '#26324b' }}
          stack={{shrink: '0'}}
        >
          <designer-selector
            id="breakpointSelector"
            title='BREAKPOINT'
            items={breakpoints}
            direction='vertical'
            onChanged={this.onBreakpointClick.bind(this)}
          />
          <designer-selector
            id="previewSelector"
            title='PREVIEW' // letterSpacing="0.1rem" font={{ size: '0.675rem' }}
            items={previews}
            direction='vertical'
            onChanged={this.onPreviewClick.bind(this)}
          />
          <i-vstack gap={'0.5rem'}>
            <i-hstack gap={4} verticalAlignment="center">
              <i-label caption="ENV" letterSpacing="0.1rem" font={{ size: '0.675rem' }} />
              <i-icon name="exclamation-circle" width={12} height={12} tooltip={{ content: 'You can configure some values in your app to change based on which environment the app is running in. If unspecified, Development (Dev) values will be used.' }} />
            </i-hstack>
            <i-label
              caption="Dev"
              font={{ size: '0.675rem' }}
              width="5rem"
              background={{ color: Theme.action.hoverBackground }}
              class={`${borderRadiusLeft} ${borderRadiusRight}`}
              padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }}
            />
          </i-vstack>
        </i-hstack>
        <i-hstack
          id="hStackInfo"
          width="100%"
          verticalAlignment="center"
          padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
          background={{ color: '#26324b' }}
          stack={{shrink: '0'}}
        />
        <i-tabs
          mode="horizontal"
          activeTabIndex={0}
          class={customTabStyled}
          stack={{grow: '1'}} overflow={'hidden'}
        >
          <i-tab icon={{ name: 'paint-brush', width: '1.5rem', height: '1.5rem' }}>
            <i-vstack gap={1} width="100%">
              <designer-tool-group id="customGroup" display='block' onChanged={this.onGroupChanged}/>
              <designer-tool-stylesheet id="designerStylesheet" display="block" onChanged={this.onPropChanged} />
              <designer-tool-layout id='designerLayout' display="block" onChanged={this.onPropChanged} />
              <designer-tool-background id="designerBackground" display="block" onChanged={this.onPropChanged} />
              <designer-tool-size id="designerSize" display="block" onChanged={this.onPropChanged} />
              <designer-tool-margins-padding id="designerSpacing" display="block" onChanged={this.onPropChanged} />
              <designer-tool-position id="designerPosition" display="block" onChanged={this.onPropChanged} />
              <designer-tool-borders id="designerBorders" display="block" onChanged={this.onPropChanged} />
              <designer-tool-content id="designerContent" display="block" onChanged={this.onPropChanged} />
              <designer-tool-effects id="designerEffects" display="block" onChanged={this.onPropChanged} />
            </i-vstack>
          </i-tab>
          <i-tab icon={{ name: 'sliders-h', width: '1.5rem', height: '1.5rem' }}>
            <i-vstack gap={1} width="100%">
              <designer-settings-basic display="block" />
              <designer-settings-advanced display="block" />
            </i-vstack>
          </i-tab>
          <i-tab icon={{ name: 'database', width: '1.5rem', height: '1.5rem' }}>
            <i-vstack gap={1} width="100%">
              <designer-data-params display="block" />
              <designer-data-linking display="block" />
            </i-vstack>
          </i-tab>
          <i-tab icon={{ name: 'magic', width: '1.5rem', height: '1.5rem' }}>
            <i-vstack gap={1} width="100%">
              <designer-trigger display="block" />
            </i-vstack>
          </i-tab>
        </i-tabs>
      </i-vstack>
    )
  }
}

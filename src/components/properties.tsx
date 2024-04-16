import {
  Module,
  Styles,
  ControlElement,
  customElements,
  HStack,
  Container,
  Input
} from '@ijstech/components'
import { customTabStyled } from '../index.css';
import { IControl, onChangedCallback, onEventChangedCallback, onEventDblClickCallback } from '../interface';
import {
  DesignerToolStylesheet,
  DesignerToolLayout,
  DesignerToolBackground,
  DesignerToolSize,
  DesignerToolMarginsAndPadding,
  DesignerToolPosition,
  DesignerToolBorders,
  DesignerToolEffects,
  DesignerToolContent,
  DesignerToolGroup,
  DesignerSelector,
  textInputRight,
  bgInputTransparent,
  DESIGNER_BACKGROUND_PROPS,
  DESIGNER_POSITION_PROPS,
  DESIGNER_BORDER_PROPS,
  DESIGNER_SIZE_PROPS,
  DESIGNER_SPACING_PROPS,
  DESIGNER_LAYOUT_PROPS,
  DESIGNER_CONTENT_PROPS,
  DESIGNER_EFFECT_PROPS
} from '../tools/index';
import '../settings/index';
import '../triggers/index';
import '../setting-data/index';
import { breakpoints, getDefaultMediaQuery, getMediaQuery, previews } from '../helpers/config';
import { parseProps } from '../helpers/utils';
import { DesignerTrigger } from '../triggers/index';
import { getBreakpoint, setBreakpoint } from '../helpers/store'

const Theme = Styles.Theme.ThemeVars;

interface DesignerPropertiesElement extends ControlElement {
  component?: IControl;
  onChanged?: onChangedCallback;
  onEventChanged?: onEventChangedCallback;
  onEventDblClick?: onEventDblClickCallback;
  onBreakpointChanged?: (value: number) => void;
  onPreviewChanged?: onChangedCallback;
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
  private designerTrigger: DesignerTrigger;
  private inputId: Input;

  private _component: IControl;

  onChanged: onChangedCallback;
  onBreakpointChanged: (value: number) => void;
  onPreviewChanged: onChangedCallback;
  onEventChanged: onEventChangedCallback;
  onEventDblClick: onEventDblClickCallback;

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    this.onPropChanged = this.onPropChanged.bind(this);
    this.onUpdateUI = this.onUpdateUI.bind(this);
    this.onControlEventChanged = this.onControlEventChanged.bind(this);
    this.onBreakpointClick = this.onBreakpointClick.bind(this);
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

  private get designerProps() {
    return this.component?.control._getDesignProps() || {};
  }

  clear() {
    this.component = null;
    this.renderUI();
  }

  private renderUI() {
    this.updateInfo();
    this.updateProps();
    this.renderCustomGroup();
    const events = this._component?.control?._getCustomProperties()?.events;
    const designProps = this.component?.control._getDesignProps();
    this.designerTrigger.setData({ events, props: designProps });
  }

  private renderCustomGroup() {
    const designProps: any = parseProps(this.designerProps);
    const dataSchema: any = this.component?.control._getCustomProperties()?.dataSchema;
    this.customGroup.visible = !!dataSchema && Object.keys(dataSchema).length > 0;
    const properties = dataSchema?.properties;
    let defaultValue = {};
    if (properties) {
      const keys = Object.keys(properties);
      defaultValue = this.getDefaultValues(keys);
    }
    this.customGroup.setData({
      title: 'Custom Properties',
      tooltip: 'Set custom properties for component',
      uiSchema: null,
      dataSchema: dataSchema,
      props: {...designProps},
      default: defaultValue
    })
  }

  private updateInfo() {
    if (!this.hStackInfo) return;
    this.hStackInfo.clearInnerHTML();
    this.hStackInfo.visible = !!this.component;
    if (!this.component) return;
    const { name, image, icon, category } = this.component;
    this.hStackInfo.appendChild(
      <i-hstack gap={8} verticalAlignment="center" width="100%">
        {icon ? <i-icon name={icon} width={'1.5rem'} height={'1.5rem'} /> : image ? <i-image url={image} width={'1.5rem'} height={'1.5rem'} /> : []}
        <i-label caption={name} font={{ size: '1rem', bold: true }} />
        <i-label caption={category || ''} opacity={0.6} font={{ size: '0.625rem' }} margin={{ left: 'auto' }} display="flex" />
      </i-hstack>
    )
  }

  onUpdate() {
    const {
      top,
      right,
      bottom,
      left,
      zIndex,
      position,
      width,
      height,
      overflow,
      minHeight,
      minWidth,
      maxHeight,
      maxWidth,
      mediaQueries = []
    }: any = this.designerProps;
    const mediaQuery = getMediaQuery(mediaQueries);
    this.designerSize.setData({ width, height, minHeight, minWidth, maxHeight, maxWidth, mediaQuery, default: this.getDefaultValues(DESIGNER_SIZE_PROPS) });
    this.designerPosition.setData({ position, zIndex, top, left, right, bottom, overflow, mediaQuery, default: this.getDefaultValues(DESIGNER_POSITION_PROPS) });
  }

  private updateProps() {
    const control = this.component?.control;
    let {
      id,
      margin = {top: '', right: '', bottom: '', left: ''},
      padding = {top: '', right: '', bottom: '', left: ''},
      border = {},
      top,
      right,
      bottom,
      left,
      zIndex,
      position,
      background,
      width,
      height,
      opacity,
      overflow = {x: '', y: ''},
      display,
      stack,
      direction,
      font,
      minHeight,
      minWidth,
      maxHeight,
      maxWidth,
      mediaQueries = []
    }: any = this.designerProps;
    const {
      id: controlId
    } = this.component?.control || {};
    const mediaQuery = getMediaQuery(mediaQueries);
    this.inputId.value = id || controlId || '';

    this.designerBackground.setData({ background, mediaQuery, default: this.getDefaultValues(DESIGNER_BACKGROUND_PROPS) });
    this.designerSize.setData({ width, height, minHeight, minWidth, maxHeight, maxWidth, mediaQuery, default: this.getDefaultValues(DESIGNER_SIZE_PROPS) });
    this.designerEffects.setData({ opacity: opacity || 1, default: this.getDefaultValues(DESIGNER_EFFECT_PROPS) });
    this.designerSpacing.setData({ margin, padding, mediaQuery, default: this.getDefaultValues(DESIGNER_SPACING_PROPS) });
    this.designerPosition.setData({ position, zIndex, top, left, right, bottom, overflow, mediaQuery, default: this.getDefaultValues(DESIGNER_POSITION_PROPS) });
    this.designerBorders.setData({ border, mediaQuery, default: this.getDefaultValues(DESIGNER_BORDER_PROPS) });
    this.designerLayout.setData({
      name: this.component?.name,
      display: display || control?.style.display,
      stack: stack || undefined,
      direction: direction || undefined,
      mediaQueries,
      default: this.getDefaultValues(DESIGNER_LAYOUT_PROPS)
    });
    this.designerContent.setData({ font, default: this.getDefaultValues(DESIGNER_CONTENT_PROPS) });
  }

  private getDefaultValues(props: string[]) {
    let result: any = {};
    const customProps = this.component?.control?._getCustomProperties()?.props;
    if (!customProps) return result;
    for (let prop of props) {
      if (customProps.hasOwnProperty(prop)) {
        result[prop] = customProps[prop].default ?? undefined;
      }
    }
    return result;
  }

  private onPropChanged(prop: string, value: any, mediaQueryProp?: string) {
    if (this.onChanged) this.onChanged(prop, value, mediaQueryProp);
  }

  private onGroupChanged(data: any) {
    for (let prop in data) {
      this.onPropChanged(prop, data[prop]);
    }
  }

  private onUpdateUI(isChecked: boolean, props: string[]) {
    if (!this.component?.control) return;
    const designerProps = this.component?.control?._getDesignProps() || {};
    const breakpoint = getBreakpoint();
    const defaultBreakpoint = getDefaultMediaQuery(breakpoint);
    const findedBreakpoint = (designerProps?.mediaQueries as any[] || []).find((v) => v && v.minWidth === defaultBreakpoint.minWidth);
    if (!findedBreakpoint) return;
    const breakpointProps: any = findedBreakpoint?.properties || {};
    const customProps = this.component?.control?._getCustomProperties()?.props || {};
    for (let prop of props) {
      if (isChecked) {
        this.component.control[prop] = breakpointProps?.[prop] ?? designerProps?.[prop] ?? customProps?.[prop]?.default;
      } else {
        this.component.control[prop] = designerProps?.[prop] ?? customProps?.[prop]?.default;
        console.log('onUpdateUI', designerProps?.[prop], customProps?.[prop]?.default)
      }
    }
  }

  private onIDChanged(target: Input) {
    const value = target.value;
    this.onPropChanged('id', value);
  }

  private onControlEventChanged(prop: string, newVal: string, oldVal: string) {
    if (this.onEventChanged) this.onEventChanged(prop, newVal, oldVal);
  }

  private onBreakpointClick(type: string, value: number) {
    setBreakpoint(value);
    if (this.onBreakpointChanged) this.onBreakpointChanged(value);
  }

  private onPreviewClick(type: string, value: any) {
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    this.onBreakpointChanged = this.getAttribute('onBreakpointChanged', true) || this.onBreakpointChanged;
    this.onPreviewChanged = this.getAttribute('onPreviewChanged', true) || this.onPreviewChanged;
    this.onEventChanged = this.getAttribute('onEventChanged', true) || this.onEventChanged;
    this.onEventDblClick = this.getAttribute('onEventDblClick', true) || this.onEventDblClick;
    const component = this.getAttribute('component', true);
    if (component) this.component = component;
    this.breakpointSelector.activeItem = breakpoints[0].value;
    this.previewSelector.activeItem = previews[0].value;
    this.onBreakpointClick('breakpoint', 0);
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
          gap={'1rem'} width="100%"
          verticalAlignment="center" horizontalAlignment="center"
          padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
          background={{ color: '#26324b' }}
          stack={{shrink: '0'}}
        >
          <designer-selector
            id="breakpointSelector"
            title='BREAKPOINT'
            items={breakpoints}
            direction='vertical'
            stack={{grow: '1', shrink: '1'}}
            onChanged={this.onBreakpointClick}
          />
          <designer-selector
            id="previewSelector"
            title='PREVIEW' // letterSpacing="0.1rem" font={{ size: '0.675rem' }}
            items={previews}
            direction='vertical'
            stack={{grow: '1', shrink: '1'}}
            onChanged={this.onPreviewClick.bind(this)}
          />
          {/* <i-vstack gap={'0.5rem'}>
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
          </i-vstack> */}
        </i-hstack>
        <i-hstack
          id="hStackInfo"
          width="100%"
          verticalAlignment="center"
          padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
          background={{ color: '#26324b' }}
          stack={{shrink: '0'}}
          visible={false}
        />
        <i-tabs
          mode="horizontal"
          activeTabIndex={0}
          class={customTabStyled}
          stack={{grow: '1'}} overflow={'hidden'}
        >
          <i-tab icon={{ name: 'sliders-h', width: '1.5rem', height: '1.5rem' }}>
            <i-vstack gap={1} width="100%">
              <i-grid-layout
                id="gridSelector"
                templateColumns={['70px', 'auto']}
                verticalAlignment="center"
                gap={{column: '0.5rem', row: '0.5rem'}}
                padding={{ top: '1rem', bottom: '1rem', left: '0.75rem', right: '0.75rem' }}
              >
                <i-label caption="ID" font={{ size: '0.75rem' }} />
                <i-hstack
                  verticalAlignment="center"
                  border={{ radius: 8 }}
                  background={{ color: Theme.input.background }}
                  overflow="hidden"
                >
                  <i-input
                    id="inputId"
                    inputType="text"
                    placeholder="Enter ID"
                    background={{ color: 'transparent' }}
                    width="calc(100% - 1.5rem)"
                    height={24}
                    border={{ width: 0 }}
                    padding={{ left: 4, right: 2 }}
                    font={{ size: '0.675rem' }}
                    class={`${textInputRight} ${bgInputTransparent}`}
                    onBlur={(target: Input) => this.onIDChanged(target)}
                    onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && this.onIDChanged(target)}
                  />
                </i-hstack>
              </i-grid-layout>
              <designer-tool-group id="customGroup" display='block' onChanged={this.onGroupChanged}/>
              <designer-tool-background id="designerBackground" display="block" onChanged={this.onPropChanged} onUpdate={this.onUpdateUI} />
              <designer-tool-borders id="designerBorders" display="block" onChanged={this.onPropChanged} onUpdate={this.onUpdateUI} />
              <designer-tool-effects id="designerEffects" display="block" onChanged={this.onPropChanged} />
              <designer-tool-layout id='designerLayout' display="block" onChanged={this.onPropChanged} />
              <designer-tool-margins-padding id="designerSpacing" display="block" onChanged={this.onPropChanged} onUpdate={this.onUpdateUI} />
              <designer-tool-position id="designerPosition" display="block" onChanged={this.onPropChanged} onUpdate={this.onUpdateUI} />
              <designer-tool-size id="designerSize" display="block" onChanged={this.onPropChanged} onUpdate={this.onUpdateUI} />
              <designer-tool-stylesheet id="designerStylesheet" display="block" onChanged={this.onPropChanged} />
              <designer-tool-content id="designerContent" display="block" onChanged={this.onPropChanged} />
            </i-vstack>
          </i-tab>
          {/* <i-tab icon={{ name: 'sliders-h', width: '1.5rem', height: '1.5rem' }}>
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
          </i-tab> */}
          <i-tab icon={{ name: 'magic', width: '1.5rem', height: '1.5rem' }}>
            <i-vstack gap={1} width="100%" height={'100%'}>
              <designer-trigger
                id="designerTrigger"
                display="block"
                width="100%" minHeight={250}
                onChanged={this.onControlEventChanged}
                onEventDblClick={(name: string) => this.onEventDblClick && this.onEventDblClick(name)}
              />
            </i-vstack>
          </i-tab>
        </i-tabs>
      </i-vstack>
    )
  }
}

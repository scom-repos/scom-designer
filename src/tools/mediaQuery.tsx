import {
  Module,
  ControlElement,
  customElements,
  Container,
  VStack,
} from '@ijstech/components'
import { onChangedCallback } from '../interface';
import { getBreakpoint } from '../helpers/store';
import DesignerToolSize from './size';
import { getDefaultMediaQuery } from '../helpers/config';

interface DesignerToolMediaQueryElement extends ControlElement {
  onChanged?: onChangedCallback;
}


interface IDesignerQueries {
  mediaQueries: any[];
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-media-query']: DesignerToolMediaQueryElement
    }
  }
}

@customElements('designer-tool-media-query')
export default class DesignerToolMediaQuery extends Module {
  private vStackContent: VStack;
  private designerSize: DesignerToolSize;

  private _data: IDesignerQueries = {
    mediaQueries: [],
  };

  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: DesignerToolMediaQueryElement) {
    super(parent, options);
    this.onPropChanged = this.onPropChanged.bind(this)
  }

  setData(value: any) {
    this._data = value;
    this.renderUI();
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {
    const { mediaQueries = [] } = this._data;
    const { properties = {} } = mediaQueries[getBreakpoint()] || {};
    this.designerSize.setData({
      width: properties?.width,
      height: properties?.height,
      minHeight: properties?.minHeight,
      minWidth: properties?.minWidth,
      maxWidth: properties?.maxWidth,
      maxHeight: properties?.maxHeight
    })
  }

  private onPropChanged(prop: string, value: any) {
    if (!this._data.mediaQueries) this._data.mediaQueries = [];
    const breakpoint = getBreakpoint();
    if (!this._data.mediaQueries[breakpoint]) this._data.mediaQueries[breakpoint] = getDefaultMediaQuery(breakpoint);
    this._data.mediaQueries[breakpoint]['properties'][prop] = value;
    if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQueries, prop);
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
  }

  render() {
    return (
      <i-vstack
        width="100%"
        height="100%"
        margin={{ left: "auto", right: "auto" }}
        position="relative"
      >
        <designer-tool-header name="Media query" tooltipText="Set media queries for the element." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" gap={8} padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <designer-tool-size id="designerSize" display="block" onChanged={this.onPropChanged} />
        </i-vstack>
      </i-vstack>
    )
  }
}

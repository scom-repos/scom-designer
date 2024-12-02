import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack
} from '@ijstech/components'
import { buttonAutoStyled } from './index.css';
import { propertiesJson } from '../languages/index';

const Theme = Styles.Theme.ThemeVars;

interface DesignerToolWidgetElement extends ControlElement {
  onChanged?: (data: any) => void;
  onConfig?: () => void;
}

interface IDesignerWidgetSetting {
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-widget-settings']: DesignerToolWidgetElement
    }
  }
}

@customElements('designer-tool-widget-settings')
export default class DesignerToolWidget extends Module {
  private vStackContent: VStack;

  private _data: IDesignerWidgetSetting = {};

  onChanged: (data: any) => void;
  onConfig: () => void;

  constructor(parent?: Container, options?: DesignerToolWidgetElement) {
    super(parent, options);
    this.onConfigClicked = this.onConfigClicked.bind(this);
  }

  setData(value: IDesignerWidgetSetting) {
    this._data = value;
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private onConfigClicked() {
    if (this.onConfig) this.onConfig();
  }

  init() {
    this.i18n.init({...propertiesJson});
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    this.onConfig = this.getAttribute('onConfig', true) || this.onConfig;
  }

  render() {
    return (
      <i-vstack
        width="100%"
        height="100%"
        margin={{ left: "auto", right: "auto" }}
        position="relative"
      >
        <designer-tool-header
          id ="designerHeader"
          name="$widget_settings"
          tooltipText=""
          onCollapse={this.onCollapse}
        />
        <i-hstack
          id="vStackContent"
          gap={'0.5rem'}
          padding={{ top: '1rem', bottom: '1rem', left: '0.75rem', right: '0.75rem' }}
          visible={false}
        >
          <i-button
            caption=''
            icon={{ name: 'cog', fill: Theme.text.primary, width: '1rem', height: '1rem' }}
            class={buttonAutoStyled}
            onClick={this.onConfigClicked}
          ></i-button>
        </i-hstack>
      </i-vstack>
    )
  }
}

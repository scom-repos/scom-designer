import { Module, customModule, Styles } from '@ijstech/components';

@customModule
export default class Main extends Module {
  set maxWidth(value: number | string) {
    this.style.maxWidth = "";
  }

  init() {
    super.init();
  }

  render() {
    return <i-panel width={'100%'} height={'100%'}>
      <i-button caption="Test"></i-button>
   </i-panel>
  }
}
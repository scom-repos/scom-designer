import { Panel, Control } from "@ijstech/components";
import { ActionType } from "../interface";
import { selectedStyle } from './index.css'

class ControlResizer {
  private _control: Control;
  private _type: ActionType = 'click';
  private resizers: HTMLElement[] = [];

  constructor(control: Control, type: ActionType) {
    this._control = control;
    this._type = type ?? 'click';
  }

  get type() {
    return this._type ?? 'click';
  }

  set type(value: ActionType) {
    this._type = value ?? 'click';
  }

  addResizer(className: string) {
    let resizer = document.createElement("div");
    this._control.appendChild(resizer);
    this.resizers.push(resizer);
    resizer.className = "i-resizer " + className;
  }

  hideResizers() {
    if (this.type === 'click') {
      this.resizers.forEach(resizer => this._control?.contains(resizer) && this._control.removeChild(resizer));
      this.resizers = [];
    } else {
      const parentEl = this._control.closest('#designerWrapper') as Control;
      const selectedEl = parentEl?.querySelector(`.${selectedStyle}`) as Control;
      if (selectedEl) selectedEl.classList.remove(selectedStyle);
      const addToChatPanel = parentEl?.querySelector('#pnlAddToChat') as Panel;
      if (addToChatPanel) addToChatPanel.visible = false;
    }
  }

  showResizers() {
    if (this.type === 'click') {
      if (this.resizers.length == 0) {
        this.addResizer("tl");
        this.addResizer("tm");
        this.addResizer("tr");
        this.addResizer("ml");
        this.addResizer("mr");
        this.addResizer("bl");
        this.addResizer("bm");
        this.addResizer("br");
      }
    } else {
      if (this._control.tagName === 'I-PANEL') return

      if (this._control.tag?.isGenerated === false) return;

      this._control.classList.add(selectedStyle);
      const parentEl = this._control.closest('#designerWrapper') as Control;
      const addToChatPanel = parentEl.querySelector('#pnlAddToChat') as Panel;
      if (addToChatPanel) {
        const { top, left } = this._control.getBoundingClientRect();
        addToChatPanel.visible = true;
        addToChatPanel.position = 'fixed';
        addToChatPanel.top = top + window.scrollY - 35 + 'px';
        addToChatPanel.left = left + window.scrollX + 'px';
        addToChatPanel.zIndex = 1000;
      }
    } 
  }
}

export {
  ControlResizer
}
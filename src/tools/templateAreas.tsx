import {
  Module,
  ControlElement,
  customElements,
  Styles,
  VStack,
  Control,
  Container,
  Input
} from '@ijstech/components'
import { propertiesJson } from '../languages/index';
const Theme = Styles.Theme.ThemeVars;

interface DesignerTemplateAreasElement extends ControlElement {
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-template-areas']: DesignerTemplateAreasElement
    }
  }
}

@customElements('designer-template-areas')
export default class DesignerTemplateAreas extends Module {
  private pnlGroup: VStack;

  private _data: string[][] = [];
  private groupsMap: Control[] = [];

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: DesignerTemplateAreasElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  getData() {
    return this._data.filter(group => {
      return group.filter(item => item.length > 0).length > 0
    });
  }

  setData(value: string[][]) {
    this._data = JSON.parse(JSON.stringify(value || []));
    this.pnlGroup.clearInnerHTML();
    this.groupsMap = [];
    this.renderGroups();
  }

  private onAddGroup() {
    this._data.push([]);
    this.renderGroup(this._data.length - 1);
  }

  private onAddItem(groupIndex: number) {
    this._data[groupIndex].push('');
    const groupEl = this.groupsMap[groupIndex];
    const parent = groupEl?.querySelector('.item-list') as Control;
    this.renderItem(parent, groupIndex, this._data[groupIndex].length - 1);
  }

  private onDeleteGroup(target: Control, groupIndex: number) {
    target.remove();
    this._data.splice(groupIndex, 1);
  }

  private onDeleteItem(target: Control, groupIndex: number, itemIndex: number) {
    target.remove();
    this._data[groupIndex].splice(itemIndex, 1);
  }

  private renderGroups() {
    for (let i = 0; i < this._data.length; i++) {
      this.renderGroup(i);
    }
  }

  private renderGroup(groupIndex: number) {
    const childItems = this._data[groupIndex] || [];
    const itemWrap = <i-vstack width={'100%'} gap="10px" padding={{top: 10, bottom: 10}} class="item-list"></i-vstack>
    const groupEl = (
      <i-vstack width={'100%'}>
        <i-hstack
          horizontalAlignment='space-between'
          verticalAlignment='center'
          gap="0.5rem"
          width={'100%'}
          padding={{top: 10, bottom: 10}}
          border={{bottom: {width: 1, style: 'solid', color: Theme.divider}}}
        >
          <i-label caption="$items"></i-label>
          <i-hstack gap="0.5rem" verticalAlignment='center' horizontalAlignment='end'>
            <i-button
              caption='$add'
              icon={{name: 'plus'}}
              padding={{top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem'}}
              border={{radius: 0}}
              boxShadow='none'
              onClick={() => this.onAddItem(groupIndex)}
            ></i-button>
            <i-icon
              name="trash"
              cursor='pointer'
              stack={{shrink: '0'}}
              width={'1rem'} height={'1rem'}
              onClick={() => this.onDeleteGroup(groupEl, groupIndex)}
            ></i-icon>
          </i-hstack>
        </i-hstack>
        { itemWrap }
      </i-vstack>
    );
    this.groupsMap.push(groupEl);
    this.pnlGroup.appendChild(groupEl);
    if (childItems?.length) {
      for(let i = 0; i < childItems.length; i++) {
        this.renderItem(itemWrap, groupIndex, i);
      }
    }
  }

  private renderItem(parent: Control, groupIndex: number, itemIndex: number) {
    const item = this._data[groupIndex][itemIndex];
    const itemEl = (
      <i-hstack width={'100%'} verticalAlignment='center' gap="0.5rem">
        <i-input
          width={'100%'}
          height={'32px'}
          value={item}
          border={{radius: '0.5rem', width: 0}}
          padding={{left: '1rem', right: '1rem'}}
          onChanged={(v: Input) => this.onUpdate(v, groupIndex, itemIndex)}
        ></i-input>
        <i-icon
          name="trash"
          cursor='pointer'
          stack={{shrink: '0'}}
          width={'1rem'} height={'1rem'}
          onClick={() => this.onDeleteItem(itemEl, groupIndex, itemIndex)}
        ></i-icon>
      </i-hstack>
    )
    parent.appendChild(itemEl);
  }

  private onUpdate(v: Input, groupIndex: number, itemIndex: number) {
    this._data[groupIndex][itemIndex] = v.value;
  }

  init() {
    this.i18n.init({...propertiesJson});
    super.init();
  }

  render() {
    return <i-vstack gap="0.5rem">
        <i-hstack
          horizontalAlignment='space-between'
          verticalAlignment='center'
          gap="0.5rem"
          padding={{top: 10, bottom: 10}}
          border={{bottom: {width: 1, style: 'solid', color: Theme.divider}}}
        >
          <i-label caption=""></i-label>
          <i-button
            caption='$add'
            icon={{name: 'plus'}}
            padding={{top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem'}}
            border={{radius: 0}}
            boxShadow='none'
            onClick={this.onAddGroup}
          ></i-button>
        </i-hstack>
        <i-vstack id="pnlGroup" gap="0.5rem"></i-vstack>
      <i-vstack>
      </i-vstack>
    </i-vstack>
  }
}

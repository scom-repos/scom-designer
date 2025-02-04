import { Container, ControlElement, Module, customElements, Styles, VStack } from '@ijstech/components';
import { bundleTactContract } from '@ijstech/compiler';
import { Storage } from './build/index';
import { IFileData } from './interface';

const Theme = Styles.Theme.ThemeVars;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-designer--deployer']: DeployerElement
    }
  }
}

interface DeployerElement extends ControlElement {
  path?: string;
  content?: string;
}

@customElements('i-scom-designer--deployer')
export class ScomDesignerDeployer extends Module {
  private _data: IFileData = {
    path: '',
    content: ''
  };
  private storage: Storage = new Storage('');

  private pnlMessage: VStack;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  setData(value: IFileData) {
    this.pnlMessage.clearInnerHTML();
    this._data = value;
  }

  private async handleCompile() {
    this.storage.data = this._data;
    const path = this._data.path;
    const options = {
      projects: [{
      "name": "sample",
      "path": path,
      "output": "./src/output",
      "mode": "full",
      "options": {
        "external": false,
        "debug": false,
        "ipfsAbiGetter": false,
        "interfacesGetter": false,
        "experimental": {
          "inline": false
        }
      }
    }]}
    const result = await bundleTactContract(this.storage, '', options);
    return result;
  }

  private async handleDeploy() {
    this.pnlMessage.clearInnerHTML();
    this.pnlMessage.appendChild(
      <i-label caption='Deploying...'></i-label>
    )
    const result = await this.handleCompile();
    console.log(result);
  }

  init(): void {
    super.init();
  }

  render() {
    return <i-vstack
      width="100%"
      height="100dvh"
      padding={{left: '1rem', right: '1rem', top: '1rem', bottom: '1rem'}}
      overflow="hidden"
    >
      <i-hstack
        padding={{top: '0.5rem', bottom: '0.5rem'}}
      >
        <i-button
          caption='$deploy'
          stack={{ shrink: '0' }}
          padding={{top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem'}}
          boxShadow='none'
          minHeight={'2.25rem'}
          onClick={this.handleDeploy}
        ></i-button>
      </i-hstack>
      <i-vstack
        id="pnlMessage"
        stack={{grow: '1'}}
        overflow={{y: 'auto'}}
        padding={{top: '1rem', bottom: '1rem'}}
        gap={8}
        border={{top: {width: '1px', style: 'solid', color: Theme.divider}}}
      ></i-vstack>
    </i-vstack>
  }
}
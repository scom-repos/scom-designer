import { Container, ControlElement, Module, customElements, Styles, VStack, Button, application } from '@ijstech/components';
import { bundleTactContract, Compiler } from '@ijstech/compiler';
import { Storage, TonConnectSender } from './build/index';
import { IDeployConfig, IFileData } from './interface';
import { TonClient, Cell, TonCrypto, WalletContractV4, toNano, TonConnector, Address } from '@scom/ton-core';
import { extractContractName, fromJSModule, parseInputs } from './helpers/utils';

const Theme = Styles.Theme.ThemeVars;

declare const window: any;

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
  config?: IDeployConfig;
}

@customElements('i-scom-designer--deployer')
export class ScomDesignerDeployer extends Module {
  private _data: IFileData = {
    path: '',
    content: ''
  };
  private _config: IDeployConfig;
  private storage: Storage = new Storage('');

  private pnlMessage: VStack;
  private btnDeploy: Button;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  setConfig(value: IDeployConfig) {
    this._config = value;
  }

  setData(value: IFileData) {
    this.pnlMessage.clearInnerHTML();
    this._data = value;
    this.storage.data = this._data;
  }

  private async handleCompile() {
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

  private async initDeploy(result: any, fileNames: {ts: string, boc: string, pkg: string}, address: string) {
    let tsFileName = fileNames.ts;
    let pkgFileName = fileNames.pkg;
    const contractName = extractContractName(tsFileName);
    const contractScript = result.get(tsFileName).toString();
    const pkgData = JSON.parse(result.get(pkgFileName).toString());
    const initParams: any = {};

    if (pkgData?.init?.args?.length) {
      for (let i = 0; i < pkgData.init.args.length; i++) {
        const arg = pkgData.init.args[i];
        if (arg.type === 'address') {
          initParams[arg.name] = address;
        }
      };
    }

    const compiler = new Compiler();
    await compiler.addFile(
      'tact.ts',
      contractScript,
      this.getImportFile.bind(this)
    );
    const compiledResult = await compiler.compile(true);
    if (compiledResult.errors?.length > 0) {
      return null;
    }
    const jsOutout = compiledResult.script['index.js'];
    const jsModule = fromJSModule(jsOutout);
    const _code = `async function main(initParams) {
      ${jsModule}
      const contractInit = await ${contractName}.fromInit(...Object.values(initParams));
      return contractInit;
    } return main(initParams)`;

    try {
      const contractInit = await new Function('initParams', _code)({
        ...(initParams as unknown as object),
      });
      console.info('contractInit', contractInit);
      return contractInit;
    } catch {}
    return null;
  }

  private async getImportFile(fileName?: string, isPackage?: boolean): Promise<{fileName: string, content: string}>{
    if (isPackage){
      const content = await application.getContent(`${application.rootDir}libs/${fileName}/index.d.ts`);
      return {
        fileName: 'index.d.ts',
        content: content
      }
    };
  }

  private checkWalletConnection(): Promise<TonConnector.ITonConnect> {
    return new Promise((resolve, reject) => {
      const tonConnect = new TonConnector.TonConnect();
      if (!tonConnect.connected) {
        tonConnect.connect({
          jsBridgeKey: 'tonkeeper'
        });
        tonConnect.onStatusChange((wallet: any) => {
          if (wallet?.account?.address) {
            resolve(tonConnect);
          }
        })
      } else {
        tonConnect.restoreConnection();
        resolve(tonConnect);
      }
    });
  }

  private async deploy() {
    const result = await this.handleCompile();
    if (result?.size) {
      const tonConnect = await this.checkWalletConnection();
      if (!tonConnect?.wallet?.account) return;
      const fileNames = this.getFileNames(result);
      const { apiKey, endpoint } = this._config;
      const client = new TonClient({ apiKey, endpoint });
      const connectedWallet = tonConnect.wallet.account;
      const addr = Address.parse(connectedWallet.address);
      const walletAddress = addr.toString({ bounceable: false });
      const tonAmount = toNano(0.05);

      if (!await client.isContractDeployed(walletAddress)) {
        return {
          message: "Wallet is not deployed"
        };
      }

      const balance = await client.getBalance(walletAddress);
      if (balance < tonAmount) {
        return {
          message: "Wallet has no enough funds. Please send some testnet TON."
        };
      }

      const abiFile = result.get(fileNames.abi).toString();
      const abi = JSON.parse(abiFile);
      const contractName = abi.name;
      const abiTypes = abi.types || [];
      if (abiTypes.length && contractName) {
        let initData = null;
        for (const type of abiTypes) {
          if (type.name === `${contractName}$Data`) {
            initData = type;
            break;
          }
        }
        if (initData?.fields?.length) {
          const inputs = await parseInputs(initData?.fields, {});
          // TODO: add inputs to initData
        }
      }

      const contractInit = await this.initDeploy(result, fileNames, addr);
      let stateInit = { code: new Cell(), data: new Cell() };

      if (contractInit) {
        stateInit = contractInit.init
        const userContract = client.open(contractInit);
        const userContractAddr = userContract.address.toString({ bounceable: false });

        if (await client.isContractDeployed(userContractAddr)) {
          return {
            address: userContractAddr,
            message: "Contract is deployed"
          }
        }

        const messageParams = {
          $$type: 'Deploy',
          queryId: BigInt(0),
        };
        const sender = new TonConnectSender(tonConnect);

        try {
          await userContract.send(
            sender,
            {
              value: tonAmount,
              bounce: false
            },
            messageParams,
          );
        } catch (error) {
          console.error(error);
          return {
            message: "Contract is not deployed"
          }
        }

        return {
          address: userContract.address.toString({ bounceable: false }),
          message: "Contract is deployed"
        }
      }

      return {
        message: "Cannot init contract"
      }

      // const contractCode = fileNames.boc ? Cell.fromBoc(result.get(fileNames.boc))[0] : new Cell();
      // stateInit = { code: contractCode, data: new Cell() };
      // const contractAddr = contractAddress(workchain, stateInit);
      // const contractAddrStr = contractAddr.toString({ bounceable: false });

      // if (await client.isContractDeployed(contractAddrStr)) {
      //   return {
      //     address: contractAddrStr,
      //     message: "Contract is deployed"
      //   }
      // }

      // const walletContract = client.open(walletV4R2);
      // const seqno = await walletContract.getSeqno();
      // const transfer = walletContract.createTransfer({
      //   secretKey: keyPair.secretKey,
      //   seqno: seqno,
      //   messages: [
      //     internal({
      //       to: contractAddrStr,
      //       value: tonAmount,
      //       body: contractCode,
      //       init: stateInit,
      //       bounce: false
      //     })
      //   ]
      // });

      // const response = await tonConnect.sendTransaction({
      //   validUntil: Math.floor(Date.now() / 1000) + 60,
      //   messages: [{
      //     address: contractAddrStr,
      //     amount: tonAmount.toString(),
      //     payload: transfer.toBoc().toString("base64"),
      //   }]
      // });

      // console.log('response', response);

      // return {
      //   address: contractAddrStr,
      //   message: "Contract is deployed"
      // }
    }
  }

  private async deployUsingMnemonic() {
    const workchain = 0;
    const mnemonic = this._config.mnemonic;
    const keyPair = await TonCrypto.mnemonicToPrivateKey(mnemonic.split(" "));
    const walletV4R2 = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    const walletAddress = walletV4R2.address.toString({ bounceable: false });
    const tonAmount = toNano(0.05);

    // Deploy
  }

  private getFileNames(result: any) {
    let bocFileName = '';
    let pkgFileName = '';
    let tsFileName = '';
    let abiFileName = '';

    for (let [key, _] of result.entries()) {
      if (key.endsWith('.boc')) {
        bocFileName = key;
      } else if (key.endsWith('.pkg')) {
        pkgFileName = key;
      } else if (key.endsWith('.ts')) {
        tsFileName = key;
      } else if (key.endsWith('.abi')) {
        abiFileName = key;
      }
    }
    return {
      boc: bocFileName,
      pkg: pkgFileName,
      ts: tsFileName,
      abi: abiFileName
    }
  }

  private async handleDeploy() {
    this.btnDeploy.rightIcon.visible = true;
    this.btnDeploy.enabled = false;
    this.pnlMessage.clearInnerHTML();
    this.pnlMessage.appendChild(
      <i-label caption='Deploying...'></i-label>
    )
    try {

      const { address, message } = await this.deploy() || {};
      if (address) {
        this.pnlMessage.appendChild(
          <i-label caption={`Contract deployed on Testnet at address ${address}`}></i-label>
        )
        this.pnlMessage.appendChild(
          <i-label
            caption={`View deployed contract`}
            link={{href: `https://testnet.tonviewer.com/${address}`, target: '_blank'}}
          ></i-label>
        )
      } else if (message) {
        this.pnlMessage.appendChild(
          <i-label caption={message}></i-label>
        )
      }
    } catch(error) {
      console.error(error);
    }
    this.btnDeploy.rightIcon.visible = false;
    this.btnDeploy.enabled = true;
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
          id="btnDeploy"
          caption='$deploy'
          stack={{ shrink: '0' }}
          padding={{top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem'}}
          boxShadow='none'
          minHeight={'2.25rem'}
          rightIcon={{name: "spinner", spin: true, visible: false}}
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
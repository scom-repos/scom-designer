import { Container, ControlElement, Module, customElements, Styles, VStack, Button, application, Panel } from '@ijstech/components';
import { bundleTactContract, Compiler } from '@ijstech/compiler';
import { Storage, TonConnectSender } from './build/index';
import { IDeployConfig, IFileData } from './interface';
import { TonClient, TonCrypto, WalletContractV4, toNano, TonConnector, Address, ABIField, ABIType, Contract } from '@scom/ton-core';
import { basicTypes, extractContractName, fromJSModule, parseInputs } from './helpers/utils';
import { DeployerParams } from './components/index';
import { mainJson } from './languages/index';

const Theme = Styles.Theme.ThemeVars;
const TON_AMOUNT = toNano(0.05);
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
  private initFields: ABIField[] = [];
  private builtResult: Record<string, IFileData> = {};
  private contract: Contract|null = null;

  private pnlMessage: VStack;
  private btnDeploy: Button;
  private pnlParams: Panel;
  private formParams: DeployerParams;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  setConfig(value: IDeployConfig) {
    this._config = value;
  }

  async setData(value: IFileData) {
    this.pnlMessage.clearInnerHTML();
    this.pnlParams.visible = false;
    this.pnlParams.clearInnerHTML();
    this._data = value;
    this.storage.data = this._data;
    await this.build();
  }

  private renderMessage(message: string, link?: string) {
    if (link) {
      this.pnlMessage.appendChild(
        <i-label
          caption={message}
          link={{href: link, target: '_blank'}}
        ></i-label>
      )
    } else {
      this.pnlMessage.appendChild(
        <i-label caption={message}></i-label>
      )
    }
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

  private async initDeploy(params: Record<string, any>) {
    const tsFileName = this.builtResult.ts?.path;
    const contractName = extractContractName(tsFileName);
    const contractScript = this.builtResult.ts?.content || '';

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
        ...(params as unknown as object),
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

  private async build() {
    this.btnDeploy.enabled = false;
    const result = await this.handleCompile();
    if (!result?.size) return;

    const fileNames = this.getFileNames(result);

    for (let key in fileNames) {
      this.builtResult[key] = {
        path: fileNames[key],
        content: result.get(fileNames[key]).toString()
      }
    }

    const pkgData = this.builtResult.pkg?.content && JSON.parse(this.builtResult.pkg?.content);
    if (pkgData?.init?.args?.length) {
      const fields = pkgData.init.args || [];
      this.initFields = fields;
      this.pnlParams.visible = true;
      this.pnlParams.appendChild(
        <i-scom-designer--deployer-params
          id="formParams"
          fields={fields}
          name='Init Params'
        />
      );
    }

    
    this.btnDeploy.enabled = true;
  }

  private async deploy(params: Record<string, any>) {
    return await this.callDeploy(params);
  }

  private async callDeploy(params: Record<string, any>) {
    const tonConnect = await this.checkWalletConnection();
    if (!tonConnect?.wallet?.account) return;
    const { apiKey, endpoint } = this._config;
    const client = new TonClient({ apiKey, endpoint });
    const connectedWallet = tonConnect.wallet.account;
    const addr = Address.parse(connectedWallet.address);
    const walletAddress = addr.toString({ bounceable: false });

    if (!await client.isContractDeployed(walletAddress)) {
      return {
        message: "Wallet is not deployed"
      };
    }

    const balance = await client.getBalance(walletAddress);
    if (balance < TON_AMOUNT) {
      return {
        message: "Wallet has no enough funds. Please send some testnet TON."
      };
    }

    const contractInit = await this.initDeploy(params);

    if (contractInit) {
      const userContract = client.open(contractInit);
      this.contract = userContract;
      const userContractAddr = userContract.address.toString({ bounceable: false });

      if (await client.isContractDeployed(userContractAddr)) {
        return {
          address: userContractAddr,
          message: "Contract is deployed"
        }
      }

      const deployType = contractInit?.abi?.receivers?.find(item => item?.message?.type === 'Deploy');
      const messageParams = deployType ? {
        $$type: 'Deploy',
        queryId: BigInt(0),
      } : 'Deploy';
      const sender = new TonConnectSender(tonConnect);

      try {
        await userContract.send(
          sender,
          {
            value: TON_AMOUNT,
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

    // return {
    //   address: contractAddrStr,
    //   message: "Contract is deployed"
    // }
  }

  private async parseParams(value: Record<string, any>) {
    const inputsPromises = [...this.initFields].map(async(field: ABIField) => {
      field.value = value[field.name];
      const fieldType = field.type?.type;

      if (basicTypes.includes(fieldType)) {
        const parsedValue = await parseInputs(field);
        field.value = parsedValue;
      } else {
        const itemData = this.getType(fieldType);
        const childFields = itemData?.fields || [];
        if (!field.value) field.value = {};
        if (childFields.length) {
          for (const childField of childFields) {
            childField.value = value[field.name]?.[childField.name];
            const val = await parseInputs(childField);
            field.value[childField.name] = val;
          }
        }
      }
      
      return field;
    });
    return await Promise.all(inputsPromises);
  }

  private getType(type: string) {
    const types = this.contract?.abi?.types || [];
    const field = types.find((item: ABIType) => item.name === type);
    return field;
  }

  private async deployUsingMnemonic() {
    const workchain = 0;
    const mnemonic = this._config.mnemonic;
    const keyPair = await TonCrypto.mnemonicToPrivateKey(mnemonic.split(" "));
    const walletV4R2 = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    const walletAddress = walletV4R2.address.toString({ bounceable: false });

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
    this.pnlMessage.clearInnerHTML();
    const validateResult = this.formParams && await this.formParams.validate();

    let initParams: Record<string, any> = {};

    if (validateResult) {
      if (!validateResult.valid) {
        this.renderMessage("Invalid params");
        return;
      } else {
        const data = await this.formParams.getFormData();
        try {
          const parsedData = await this.parseParams(data);
          for (const item of parsedData) {
            initParams[item.name] = item.value;
          }
        } catch (error) {
          return;
        }
      }
    }

    this.btnDeploy.rightIcon.visible = true;
    this.btnDeploy.enabled = false;
    this.renderMessage('Deploying contract...');

    try {
      const { address, message } = await this.deploy(initParams) || {};
      if (address) {
        this.renderMessage(`Contract deployed on Testnet at address ${address}`);
        this.renderMessage(`View deployed contract`, 'https://testnet.tonviewer.com/' + address);
      } else if (message) {
        this.renderMessage(message);
      }
    } catch(error) {
      console.error(error);
    }
    this.btnDeploy.rightIcon.visible = false;
    this.btnDeploy.enabled = true;
  }

  init(): void {
    this.i18n.init({...mainJson});
    super.init();
  }

  render() {
    return <i-vstack
      width="100%"
      height="100dvh"
      padding={{left: '1rem', right: '1rem', top: '1rem', bottom: '1rem'}}
      gap="0.5rem"
      overflow="hidden"
    >
      <i-panel
        id="pnlParams"
        visible={false}
        width={'100%'}
        padding={{left: '0.5rem', right: '0.5rem', top: '0.5rem', bottom: '0.5rem'}}
        border={{radius: 8}}
        background={{color: Theme.background.main}}
      ></i-panel>
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
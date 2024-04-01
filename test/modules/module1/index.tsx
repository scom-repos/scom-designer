import { Module, customModule, Container, Button } from '@ijstech/components';
import { ScomDesigner } from '@scom/scom-designer';

@customModule
export default class Module1 extends Module {
    private scomDesigner: ScomDesigner;
    private export: Button;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
    }

    onShow() {
        this.scomDesigner.onShow();
    }

    onChanged(value: string) {
        console.log('content: ', value)
    }

    onButton() {
        const value = this.scomDesigner.value;
        const aElement = document.createElement('a');
        aElement.setAttribute('download', 'demo.tsx');
        const res = new Blob([value], { type: 'text/plain' });
        const href = URL.createObjectURL(res);
        aElement.href = href;
        aElement.setAttribute('target', '_blank');
        aElement.click();
        URL.revokeObjectURL(href);
    }

    render() {
        return (
            <i-panel width="100%" height="100%">
                <i-button id="export" caption='Get value' onClick={this.onButton.bind(this)}></i-button>
                <i-scom-designer
                    id="scomDesigner"
                    display='block' width="100%" height="100%"
                    url="https://storage.decom.app/ipfs/bafybeiekmzv3mmjgmfclcqe2gwpkzpptloolm4merj3cwnvb7d7pdv4v2m/demo.tsx"
                    onChanged={this.onChanged.bind(this)}
                ></i-scom-designer>
            </i-panel>
        )
    }
}
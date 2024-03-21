import { Module, customModule, Container } from '@ijstech/components';
import { ScomDesigner } from '@scom/scom-designer';

@customModule
export default class Module1 extends Module {
    private scomDesigner: ScomDesigner;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
    }

    onShow() {
        this.scomDesigner.onShow();
    }

    render() {
        return (
            <i-panel width="100%" height="100%">
                <i-scom-designer
                    display='block' width="100%" height="100%"
                ></i-scom-designer>
            </i-panel>
        )
    }
}
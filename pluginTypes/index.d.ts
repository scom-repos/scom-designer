/// <amd-module name="@scom/scom-designer/index.css.ts" />
declare module "@scom/scom-designer/index.css.ts" {
    export const hoverFullOpacity: string;
    export const rowItemHoverStyled: string;
    export const rowItemActiveStyled: string;
    export const iconButtonStyled: string;
    export const blockItemHoverStyled: string;
    export const customLabelTabStyled: string;
    export const labelActiveStyled: string;
    export const customIconTabStyled: string;
    export const customIconTabActiveStyled: string;
    export const customTabStyled: string;
}
/// <amd-module name="@scom/scom-designer/interface.ts" />
declare module "@scom/scom-designer/interface.ts" {
    import { IconName } from "@ijstech/components";
    export interface IScreen {
        id: string;
        name: string;
        elements: IComponent[];
        isHidden?: boolean;
        isDeleted?: boolean;
    }
    export interface IComponentPicker {
        name: string;
        tooltipText?: string;
        items: IComponentItem[];
    }
    export interface IComponentItem {
        path: string;
        caption: string;
        image?: string;
        iconName?: IconName;
        category?: string;
    }
    export interface IComponent extends IComponentItem {
        children?: IComponent[];
    }
    export interface IBlock {
        id: string;
        path: string;
        caption: string;
        image: string;
    }
}
/// <amd-module name="@scom/scom-designer/components/components.tsx" />
declare module "@scom/scom-designer/components/components.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import { IScreen } from "@scom/scom-designer/interface.ts";
    interface DesignerComponentsElement extends ControlElement {
        onShowComponentPicker: () => void;
        screen?: IScreen;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-components']: DesignerComponentsElement;
            }
        }
    }
    export default class DesignerComponents extends Module {
        private vStackComponents;
        private _screen;
        private mdActions;
        private mdAlert;
        onShowComponentPicker: () => void;
        get screen(): IScreen;
        set screen(value: IScreen);
        private renderUI;
        private renderTreeItems;
        private onHideComponent;
        private onShowActions;
        private initModalActions;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/assets.ts" />
declare module "@scom/scom-designer/assets.ts" {
    function fullPath(path: string): string;
    const _default: {
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-designer/tools/index.css.ts" />
declare module "@scom/scom-designer/tools/index.css.ts" {
    export const customIconBorderStyled: string;
    export const customIconLayoutStyled: string;
    export const customIconLayoutActiveStyled: string;
    export const borderRadiusLeft: string;
    export const borderRadiusRight: string;
    export const textInputRight: string;
    export const bgInputTransparent: string;
    export const customColorStyled: string;
    export const unitStyled: string;
    export const buttonAutoStyled: string;
}
/// <amd-module name="@scom/scom-designer/tools/header.tsx" />
declare module "@scom/scom-designer/tools/header.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerToolHeaderElement extends ControlElement {
        name: string;
        tooltipText?: string;
        onCollapse: (isShown: boolean) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-header']: DesignerToolHeaderElement;
            }
        }
    }
    export default class DesignerToolHeader extends Module {
        private name;
        private tooltipText;
        private isShown;
        private lbName;
        private iconArrow;
        private iconTooltip;
        onCollapse: (isShown: boolean) => void;
        constructor(parent?: Container, options?: DesignerToolHeaderElement);
        private renderUI;
        private _onCollapse;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/stylesheet.tsx" />
declare module "@scom/scom-designer/tools/stylesheet.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerToolStylesheetElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-stylesheet']: DesignerToolStylesheetElement;
            }
        }
    }
    export default class DesignerToolStylesheet extends Module {
        private vStackContent;
        constructor(parent?: Container, options?: DesignerToolStylesheetElement);
        private onCollapse;
        private renderUI;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/layout.tsx" />
declare module "@scom/scom-designer/tools/layout.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerToolLayoutElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-layout']: DesignerToolLayoutElement;
            }
        }
    }
    export default class DesignerToolLayout extends Module {
        private vStackContent;
        private isBasicFlex;
        private lbTypeFlex;
        private inputBasicFlex;
        private wrapperAdvancedFlex;
        constructor(parent?: Container, options?: DesignerToolLayoutElement);
        private onCollapse;
        private onFlexChanged;
        private renderUI;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/background.tsx" />
declare module "@scom/scom-designer/tools/background.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerToolBackgroundElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-background']: DesignerToolBackgroundElement;
            }
        }
    }
    export default class DesignerToolBackground extends Module {
        private vStackContent;
        constructor(parent?: Container, options?: DesignerToolBackgroundElement);
        private onCollapse;
        private renderUI;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/size.tsx" />
declare module "@scom/scom-designer/tools/size.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerToolSizeElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-size']: DesignerToolSizeElement;
            }
        }
    }
    export default class DesignerToolSize extends Module {
        private vStackContent;
        private mdUnits;
        private currentLabel;
        constructor(parent?: Container, options?: DesignerToolSizeElement);
        private onCollapse;
        private renderUI;
        private onShowUnits;
        private initModalUnits;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/modal-spacing.tsx" />
declare module "@scom/scom-designer/tools/modal-spacing.tsx" {
    import { Module, ControlElement, Container, IconName, Button } from '@ijstech/components';
    interface DesignerToolModalSpacingElement extends ControlElement {
        titleSpacing?: string;
        iconName?: IconName;
        breakpointText?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-modal-spacing']: DesignerToolModalSpacingElement;
            }
        }
    }
    export default class DesignerToolModalSpacing extends Module {
        private titleSpacing;
        private iconName;
        private breakpointText;
        private modal;
        private vStackIndUnits;
        private lbIndUnit;
        private lbTitle;
        private lbBreakpoint;
        private iconTitle;
        constructor(parent?: Container, options?: DesignerToolModalSpacingElement);
        private initModal;
        private updateHeader;
        onShowModal(target: Button, title: string, iconName: IconName, breakpointText: string): void;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/margins-padding.tsx" />
declare module "@scom/scom-designer/tools/margins-padding.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerToolMarginsAndPaddingElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-margins-padding']: DesignerToolMarginsAndPaddingElement;
            }
        }
    }
    export default class DesignerToolMarginsAndPadding extends Module {
        private vStackContent;
        private mdUnits;
        private mdSpacing;
        private currentLabel;
        private currentButton;
        constructor(parent?: Container, options?: DesignerToolMarginsAndPaddingElement);
        private onCollapse;
        private renderUI;
        private onShowUnitsModal;
        private initModalUnits;
        private onShowSpacingModal;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/position.tsx" />
declare module "@scom/scom-designer/tools/position.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerToolPositionElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-position']: DesignerToolPositionElement;
            }
        }
    }
    export default class DesignerToolPosition extends Module {
        private vStackContent;
        private mdSpacing;
        constructor(parent?: Container, options?: DesignerToolPositionElement);
        private onCollapse;
        private renderUI;
        private onShowModal;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/borders.tsx" />
declare module "@scom/scom-designer/tools/borders.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerToolBordersElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-borders']: DesignerToolBordersElement;
            }
        }
    }
    export default class DesignerToolBorders extends Module {
        private vStackContent;
        private mdSpacing;
        private currentButton;
        constructor(parent?: Container, options?: DesignerToolBordersElement);
        private onCollapse;
        private renderUI;
        private onShowSpacingModal;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/effects.tsx" />
declare module "@scom/scom-designer/tools/effects.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerToolEffectsElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-effects']: DesignerToolEffectsElement;
            }
        }
    }
    export default class DesignerToolEffects extends Module {
        private vStackContent;
        private inputEffect;
        private rangeEffect;
        constructor(parent?: Container, options?: DesignerToolEffectsElement);
        private onCollapse;
        private renderUI;
        private onInputEffectChanged;
        private onRangeChanged;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/index.ts" />
declare module "@scom/scom-designer/tools/index.ts" {
    import DesignerToolStylesheet from "@scom/scom-designer/tools/stylesheet.tsx";
    import DesignerToolLayout from "@scom/scom-designer/tools/layout.tsx";
    import DesignerToolBackground from "@scom/scom-designer/tools/background.tsx";
    import DesignerToolSize from "@scom/scom-designer/tools/size.tsx";
    import DesignerToolMarginsAndPadding from "@scom/scom-designer/tools/margins-padding.tsx";
    import DesignerToolPosition from "@scom/scom-designer/tools/position.tsx";
    import DesignerToolBorders from "@scom/scom-designer/tools/borders.tsx";
    import DesignerToolEffects from "@scom/scom-designer/tools/effects.tsx";
    import DesignerToolHeader from "@scom/scom-designer/tools/header.tsx";
    export * from "@scom/scom-designer/tools/index.css.ts";
    export { DesignerToolStylesheet, DesignerToolLayout, DesignerToolBackground, DesignerToolSize, DesignerToolMarginsAndPadding, DesignerToolPosition, DesignerToolBorders, DesignerToolEffects, DesignerToolHeader };
}
/// <amd-module name="@scom/scom-designer/settings/basic.tsx" />
declare module "@scom/scom-designer/settings/basic.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerSettingsBasicElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-settings-basic']: DesignerSettingsBasicElement;
            }
        }
    }
    export default class DesignerSettingsBasic extends Module {
        private vStackContent;
        private inputName;
        constructor(parent?: Container, options?: DesignerSettingsBasicElement);
        private onCollapse;
        private renderUI;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/settings/advanced.tsx" />
declare module "@scom/scom-designer/settings/advanced.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerSettingsAdvancedElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-settings-advanced']: DesignerSettingsAdvancedElement;
            }
        }
    }
    export default class DesignerSettingsAdvanced extends Module {
        private vStackContent;
        constructor(parent?: Container, options?: DesignerSettingsAdvancedElement);
        private onCollapse;
        private renderUI;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/settings/index.ts" />
declare module "@scom/scom-designer/settings/index.ts" {
    import DesignerSettingsBasic from "@scom/scom-designer/settings/basic.tsx";
    import DesignerSettingsAdvanced from "@scom/scom-designer/settings/advanced.tsx";
    export { DesignerSettingsBasic, DesignerSettingsAdvanced };
}
/// <amd-module name="@scom/scom-designer/triggers/trigger.tsx" />
declare module "@scom/scom-designer/triggers/trigger.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerTriggerElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-trigger']: DesignerTriggerElement;
            }
        }
    }
    export default class DesignerTrigger extends Module {
        private vStackContent;
        constructor(parent?: Container, options?: DesignerTriggerElement);
        private onCollapse;
        private renderUI;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/triggers/index.ts" />
declare module "@scom/scom-designer/triggers/index.ts" {
    import DesignerTrigger from "@scom/scom-designer/triggers/trigger.tsx";
    export { DesignerTrigger };
}
/// <amd-module name="@scom/scom-designer/components/properties.tsx" />
declare module "@scom/scom-designer/components/properties.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import { IComponentItem } from "@scom/scom-designer/interface.ts";
    import "@scom/scom-designer/settings/index.ts";
    import "@scom/scom-designer/triggers/index.ts";
    interface DesignerPropertiesElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-properties']: DesignerPropertiesElement;
            }
        }
    }
    export default class DesignerProperties extends Module {
        private hStackInfo;
        private _component;
        get component(): IComponentItem;
        set component(value: IComponentItem);
        private updateInfo;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/components/screens.tsx" />
declare module "@scom/scom-designer/components/screens.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import { IScreen } from "@scom/scom-designer/interface.ts";
    interface DesignerScreensElement extends ControlElement {
        onScreenChanged: callbackType;
        onScreenHistoryShown: callbackShowType;
    }
    type callbackType = (screen?: IScreen) => void;
    type callbackShowType = (shown: boolean) => void;
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-screens']: DesignerScreensElement;
            }
        }
    }
    export default class DesignerScreens extends Module {
        private wrapperScreens;
        private wrapperDeletedScreens;
        private vStackScreens;
        private vStackDeletedScreens;
        private lbScreens;
        private lbDeletedScreens;
        private mdActions;
        private mdAlert;
        private listScreen;
        private selectedId;
        onScreenChanged: callbackType;
        onScreenHistoryShown: callbackShowType;
        onShow(options?: any): void;
        get screens(): IScreen[];
        private onHideScreen;
        private onShowModalDelete;
        private onDeleteScreen;
        private onDuplicateScreen;
        private getNewName;
        private onUpdateName;
        private onAddScreen;
        private onShowActions;
        private initModalActions;
        private onShowDeletedScreens;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/components/pickerBlocks.tsx" />
declare module "@scom/scom-designer/components/pickerBlocks.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { IBlock } from "@scom/scom-designer/interface.ts";
    interface DesignerPickerBlocksElement extends ControlElement {
        items: IBlock[];
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-picker-blocks']: DesignerPickerBlocksElement;
            }
        }
    }
    export default class DesignerPickerBlocks extends Module {
        private items;
        private isShown;
        private iconArrow;
        private vStackItems;
        constructor(parent?: Container, options?: DesignerPickerBlocksElement);
        private onDeleteCustomBlock;
        private renderUI;
        private onCollapse;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/components/pickerComponents.tsx" />
declare module "@scom/scom-designer/components/pickerComponents.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { IComponentItem } from "@scom/scom-designer/interface.ts";
    interface DesignerPickerComponentsElement extends ControlElement {
        name: string;
        tooltipText?: string;
        items: IComponentItem[];
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-picker-components']: DesignerPickerComponentsElement;
            }
        }
    }
    export default class DesignerPickerComponents extends Module {
        private name;
        private tooltipText;
        private items;
        private isShown;
        private lbName;
        private iconArrow;
        private iconTooltip;
        private hStackItems;
        constructor(parent?: Container, options?: DesignerPickerComponentsElement);
        private renderUI;
        private onCollapse;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/components/index.ts" />
declare module "@scom/scom-designer/components/index.ts" {
    import DesignerComponents from "@scom/scom-designer/components/components.tsx";
    import DesignerProperties from "@scom/scom-designer/components/properties.tsx";
    import DesignerScreens from "@scom/scom-designer/components/screens.tsx";
    import DesignerPickerBlocks from "@scom/scom-designer/components/pickerBlocks.tsx";
    import DesignerPickerComponents from "@scom/scom-designer/components/pickerComponents.tsx";
    export { DesignerComponents, DesignerProperties, DesignerScreens, DesignerPickerBlocks, DesignerPickerComponents };
}
/// <amd-module name="@scom/scom-designer/data.ts" />
declare module "@scom/scom-designer/data.ts" {
    import { IBlock, IComponentPicker, IScreen } from "@scom/scom-designer/interface.ts";
    export const recentComponents: IComponentPicker[];
    export const pickerComponents: IComponentPicker[];
    export const blockComponents: IBlock[];
    export const screen: IScreen;
}
/// <amd-module name="@scom/scom-designer" />
declare module "@scom/scom-designer" {
    import { Module, ControlElement, Container, Control } from '@ijstech/components';
    import { IComponentPicker } from "@scom/scom-designer/interface.ts";
    interface ScomDesignerElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-designer']: ScomDesignerElement;
            }
        }
    }
    interface IFileHandler {
        openFile(file: IIPFSData, transportEndpoint: string, parentCid: string, parent: Control): Promise<void>;
    }
    interface IIPFSData {
        cid: string;
        name?: string;
        size?: number;
        type?: string | 'dir' | 'file';
        links?: IIPFSData[];
        path?: string;
        sort?: 'asc' | 'desc';
        root?: boolean;
    }
    export class ScomDesigner extends Module implements IFileHandler {
        private designerScreens;
        private designerComponents;
        private designerProperties;
        private pnlComponentPicker;
        private pnlBlockPicker;
        private wrapperComponentPicker;
        private wrapperTab;
        private inputSearch;
        private currentTab;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomDesignerElement, parent?: Container): Promise<ScomDesigner>;
        get pickerComponentsFiltered(): IComponentPicker[];
        get pickerBlocksFiltered(): import("@scom/scom-designer/interface.ts").IBlock[];
        private onScreenChanged;
        private onScreenHistoryShown;
        private onTabChanged;
        private onFilterComponent;
        private onShowComponentPicker;
        private onCloseComponentPicker;
        private initComponentPicker;
        private initBlockPicker;
        private initComponentScreen;
        private initDesignerProperties;
        private renderUI;
        init(): void;
        openFile(file: IIPFSData, endpoint: string, parentCid: string, parent: Control): Promise<void>;
        render(): any;
    }
}

/// <reference path="@ijstech/components/index.d.ts" />
/// <amd-module name="@scom/scom-designer/index.css.ts" />
declare module "@scom/scom-designer/index.css.ts" {
    export const hoverFullOpacity: string;
    export const rowItemHoverStyled: string;
    export const rowItemActiveStyled: string;
    export const rowDragOverActiveStyled: string;
    export const iconButtonStyled: string;
    export const blockItemHoverStyled: string;
    export const customLabelTabStyled: string;
    export const labelActiveStyled: string;
    export const customIconTabStyled: string;
    export const customIconTabActiveStyled: string;
    export const customTabStyled: string;
    export const blockStyle: string;
    export const customTransition: string;
    export const customScrollbar: string;
    export const toggleClass: string;
    export const customActivedStyled: string;
    export const customModalStyled: string;
}
/// <amd-module name="@scom/scom-designer/assets.ts" />
declare module "@scom/scom-designer/assets.ts" {
    function fullPath(path: string): string;
    const _default: {
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-designer/helpers/store.ts" />
declare module "@scom/scom-designer/helpers/store.ts" {
    const setBreakpoint: (breakpoint: number) => void;
    const getBreakpoint: () => number;
    export { setBreakpoint, getBreakpoint };
}
/// <amd-module name="@scom/scom-designer/helpers/utils.ts" />
declare module "@scom/scom-designer/helpers/utils.ts" {
    export const backgroundOptions: {
        value: string;
        label: string;
    }[];
    export function getAlignProps(type: string): any;
    export const justifyProps: ({
        tooltip: string;
        value: string;
        type: string;
        icon: {
            image: {
                url: string;
            };
        };
        rotate?: undefined;
        placement?: undefined;
    } | {
        tooltip: string;
        value: string;
        type: string;
        icon: {
            image: {
                url: string;
            };
        };
        rotate: number;
        placement?: undefined;
    } | {
        tooltip: string;
        placement: string;
        value: string;
        type: string;
        icon: {
            image: {
                url: string;
            };
        };
        rotate?: undefined;
    })[];
    export const alignContentProps: ({
        tooltip: string;
        value: string;
        type: string;
        icon: {
            image: {
                url: string;
            };
        };
        rotate?: undefined;
    } | {
        tooltip: string;
        value: string;
        type: string;
        icon: {
            image: {
                url: string;
            };
        };
        rotate: number;
    })[];
    export const borderStyles: {
        tooltip: string;
        value: string;
        type: string;
        icon: {
            image: {
                url: string;
            };
        };
    }[];
    export const fontStyles: {
        tooltip: string;
        value: string;
        type: string;
        icon: {
            name: string;
        };
    }[];
    export const fontTransforms: ({
        tooltip: string;
        value: string;
        type: string;
        icon: {
            name: string;
            image?: undefined;
        };
    } | {
        tooltip: string;
        value: string;
        type: string;
        icon: {
            image: {
                url: string;
            };
            name?: undefined;
        };
    })[];
    export const fontDecorations: {
        tooltip: string;
        value: string;
        type: string;
        icon: {
            name: string;
        };
    }[];
    export const getFileContent: (url: string) => Promise<string>;
    export const extractFileName: (path: string) => string;
    export const parseProps: (props: any, baseUrl?: string) => {};
    export const parsePropValue: (value: any, baseUrl?: string) => any;
    export const handleParse: (value: string, baseUrl?: string) => any;
    export const parseNumberValue: (value: string | number) => {
        value: any;
        unit: string;
    };
    export const isSameValue: (defaultVal: any, value: any) => boolean;
    export const isNumber: (value: string | number) => boolean;
    export function getTranslationKey(text: string): string;
    export const sleep: (ms: number) => Promise<unknown>;
    export const extractContractName: (filePath: string) => string;
    export const fromJSModule: (jsModuleCode: string) => string;
    export const parseInputs: (inputFields: any, key?: string) => Promise<any>;
    export const basicTypes: string[];
    export const mergeObjects: (target: any, source: any) => void;
    export const debounce: (func: any, wait: number) => (...args: any) => void;
}
/// <amd-module name="@scom/scom-designer/designer/utils.ts" />
declare module "@scom/scom-designer/designer/utils.ts" {
    import { IComponent } from "@scom/scom-designer/interface.ts";
    export const parseMD: (html: string, baseUrl: string) => any[];
    export const renderMd: (root: IComponent, result: string, positions: number[], hasParentPageBlock?: boolean) => string;
}
/// <amd-module name="@scom/scom-designer/components/index.css.ts" />
declare module "@scom/scom-designer/components/index.css.ts" { }
/// <amd-module name="@scom/scom-designer/helpers/config.ts" />
declare module "@scom/scom-designer/helpers/config.ts" {
    import { IconName } from "@ijstech/components";
    import { IMediaQuery } from "@scom/scom-designer/interface.ts";
    const enum BREAKPOINTS {
        MOBILE = 0,
        TABLET = 1,
        LAPTOP = 2,
        DESKTOP = 3,
        BIG_SCREEN = 4
    }
    const breakpoints: {
        tooltip: string;
        type: string;
        icon: {
            width: string;
            height: string;
            padding: {
                top: number;
                left: number;
                right: number;
                bottom: number;
            };
            name: string;
        };
        value: BREAKPOINTS;
    }[];
    const getBreakpointInfo: (index: number) => {
        icon?: undefined;
        name?: undefined;
    } | {
        icon: IconName;
        name: string;
    };
    const breakpointsMap: {
        [key: number]: IMediaQuery;
    };
    const enum PREVIEWS {
        DRAFT = 0,
        WEB = 1,
        IOS = 2,
        ANDROID = 3
    }
    const previews: {
        tooltip: string;
        icon: {
            width: string;
            height: string;
            padding: {
                top: number;
                left: number;
                right: number;
                bottom: number;
            };
            name: string;
        };
        type: string;
        value: PREVIEWS;
    }[];
    const getMediaQueries: () => IMediaQuery[];
    const getDefaultMediaQuery: (breakpoint: number) => any;
    const findMediaQueryCallback: (v: any, mediaQuery: any) => boolean;
    const getMediaQuery: (mediaQueries: any) => any;
    const getMediaQueryProps: (mediaQueries: any) => any;
    const getFont: (value: boolean) => {
        size: string;
        color: string;
    };
    const GroupMetadata: {
        Layout: {
            name: string;
            tooltipText: string;
        };
        Basic: {
            name: string;
            tooltipText: string;
        };
        Fields: {
            name: string;
            tooltipText: string;
        };
    };
    const ITEMS: string[];
    const ITEM_PARENTS: string[];
    const CONTAINERS: string[];
    const ControlItemMapper: {
        [key: string]: string;
    };
    const themesConfig: {
        dark: {
            backgroundColor: string;
            fontColor: string;
            wrapperBgColor: string;
            actionBgColor: string;
            actionFontColor: string;
            secondaryColor: string;
            inputBgColor: string;
            inputFontColor: string;
            paperBgColor: string;
            divider: string;
            selected: string;
            selectedBackground: string;
        };
        light: {
            backgroundColor: string;
            fontColor: string;
            wrapperBgColor: string;
            actionBgColor: string;
            actionFontColor: string;
            secondaryColor: string;
            divider: string;
            selected: string;
            selectedBackground: string;
        };
    };
    const pageWidgets: string[];
    export { BREAKPOINTS, breakpoints, previews, breakpointsMap, getMediaQueries, getDefaultMediaQuery, GroupMetadata, getBreakpointInfo, getMediaQueryProps, getMediaQuery, getFont, CONTAINERS, ITEM_PARENTS, ITEMS, ControlItemMapper, themesConfig, findMediaQueryCallback, pageWidgets };
}
/// <amd-module name="@scom/scom-designer/languages/main.json.ts" />
declare module "@scom/scom-designer/languages/main.json.ts" {
    const _default_1: {
        en: {
            add_components: string;
            basic: string;
            bits: string;
            blocks: string;
            code: string;
            components_that_you_use_most_frequently: string;
            design: string;
            fields: string;
            frequently_used: string;
            layout: string;
            recent: string;
            search: string;
            the_content_of_your_screen: string;
            the_layout_of_your_screen: string;
            the_most_simple__and_essential_components_to_build_a_screen: string;
            with_flexbox_you_can_specify_the_layout_of_an_element_and_its_children_to_provide_a_consistent_layout_on_different_screen_sizes: string;
            deploy: string;
        };
        "zh-hant": {
            add_components: string;
            basic: string;
            bits: string;
            blocks: string;
            code: string;
            components_that_you_use_most_frequently: string;
            design: string;
            fields: string;
            frequently_used: string;
            layout: string;
            recent: string;
            search: string;
            the_content_of_your_screen: string;
            the_layout_of_your_screen: string;
            the_most_simple_and_essential_components_to_build_a_screen: string;
            with_flexbox_you_can_specify_the_layout_of_an_element_and_its_children_to_provide_a_consistent_layout_on_different_screen_sizes: string;
            deploy: string;
        };
        vi: {
            add_components: string;
            basic: string;
            bits: string;
            blocks: string;
            code: string;
            components_that_you_use_most_frequently: string;
            design: string;
            fields: string;
            frequently_used: string;
            layout: string;
            recent: string;
            search: string;
            the_content_of_your_screen: string;
            the_layout_of_your_screen: string;
            the_most_simple_and_essential_components_to_build_a_screen: string;
            with_flexbox_you_can_specify_the_layout_of_an_element_and_its_children_to_provide_a_consistent_layout_on_different_screen_sizes: string;
            deploy: string;
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-designer/languages/properties.json.ts" />
declare module "@scom/scom-designer/languages/properties.json.ts" {
    const _default_2: {
        en: {
            absolute: string;
            add: string;
            advanced: string;
            align_content: string;
            align: string;
            auto: string;
            baseline: string;
            basic: string;
            basis: string;
            border_bottom_width: string;
            border_bottomleft_radius: string;
            border_bottomright_radius: string;
            border_left_width: string;
            border_right_width: string;
            border_top_width: string;
            border_topleft_radius: string;
            border_topright_radius: string;
            bottom: string;
            breakpoint: string;
            capitalize: string;
            center: string;
            color: string;
            column: string;
            configure_a_value_for_screen_sizes_or_larger: string;
            confirm: string;
            content: string;
            dashed: string;
            decoration: string;
            desktop: string;
            direction: string;
            display: string;
            dotted: string;
            draft_view: string;
            dynamic_value: string;
            enter_font_size: string;
            enter_font_weight: string;
            enter_text_shadow: string;
            flex_end: string;
            flex_items: string;
            flex_start: string;
            flex: string;
            grow: string;
            hidden: string;
            if_configured_will_be_applied_to_mobile_or_larger_breakpoints_if_you_configure_a_static_style_value_it_will_be_used_as_a_fallback_if_the_data_evaluates_to_undefined: string;
            individual_edges: string;
            individual: string;
            italic: string;
            items: string;
            justify: string;
            left: string;
            line_through: string;
            lowercase: string;
            margin_bottom: string;
            margin_left: string;
            margin_right: string;
            margin_top: string;
            margin: string;
            mobile: string;
            normal: string;
            opacity: string;
            overall: string;
            overflow: string;
            overline: string;
            padding_bottom: string;
            padding_left: string;
            padding_right: string;
            padding_top: string;
            padding: string;
            position: string;
            preview: string;
            radius: string;
            relative: string;
            reverse: string;
            right: string;
            row: string;
            select_display: string;
            select: string;
            selected_item: string;
            shadow: string;
            shrink: string;
            size: string;
            solid: string;
            space_around: string;
            space_between: string;
            space_evenly: string;
            static_value: string;
            stretch: string;
            style: string;
            tablet: string;
            top: string;
            transform: string;
            type_or_select_a_color: string;
            underline: string;
            uppercase: string;
            visible: string;
            web_preview: string;
            weight: string;
            width: string;
            wrap: string;
            z_index: string;
            data: string;
        };
        "zh-hant": {
            absolute: string;
            add: string;
            advanced: string;
            align_content: string;
            align: string;
            auto: string;
            baseline: string;
            basic: string;
            basis: string;
            border_bottom_width: string;
            border_bottomleft_radius: string;
            border_bottomright_radius: string;
            border_left_width: string;
            border_right_width: string;
            border_top_width: string;
            border_topleft_radius: string;
            border_topright_radius: string;
            bottom: string;
            breakpoint: string;
            capitalize: string;
            center: string;
            color: string;
            column: string;
            configure_a_value_for_screen_sizes_or_larger: string;
            confirm: string;
            content: string;
            dashed: string;
            decoration: string;
            desktop: string;
            direction: string;
            display: string;
            dotted: string;
            draft_view: string;
            dynamic_value: string;
            enter_font_size: string;
            enter_font_weight: string;
            enter_text_shadow: string;
            flex_end: string;
            flex_items: string;
            flex_start: string;
            flex: string;
            grow: string;
            hidden: string;
            if_configured_will_be_applied_to_mobile_or_larger_breakpoints_if_you_configure_a_static_style_value_it_will_be_used_as_a_fallback_if_the_data_evaluates_to_undefined: string;
            individual_edges: string;
            individual: string;
            italic: string;
            items: string;
            justify: string;
            left: string;
            line_through: string;
            lowercase: string;
            margin_bottom: string;
            margin_left: string;
            margin_right: string;
            margin_top: string;
            margin: string;
            mobile: string;
            normal: string;
            opacity: string;
            overall: string;
            overflow: string;
            overline: string;
            padding_bottom: string;
            padding_left: string;
            padding_right: string;
            padding_top: string;
            padding: string;
            position: string;
            preview: string;
            radius: string;
            relative: string;
            reverse: string;
            right: string;
            row: string;
            select_display: string;
            select: string;
            selected_item: string;
            shadow: string;
            shrink: string;
            size: string;
            solid: string;
            space_around: string;
            space_between: string;
            space_evenly: string;
            static_value: string;
            stretch: string;
            style: string;
            tablet: string;
            top: string;
            transform: string;
            type_or_select_a_color: string;
            underline: string;
            uppercase: string;
            visible: string;
            web_preview: string;
            weight: string;
            width: string;
            wrap: string;
            z_index: string;
            data: string;
        };
        vi: {
            absolute: string;
            add: string;
            advanced: string;
            align_content: string;
            align: string;
            auto: string;
            baseline: string;
            basic: string;
            basis: string;
            border_bottom_width: string;
            border_bottomleft_radius: string;
            border_bottomright_radius: string;
            border_left_width: string;
            border_right_width: string;
            border_top_width: string;
            border_topleft_radius: string;
            border_topright_radius: string;
            bottom: string;
            breakpoint: string;
            capitalize: string;
            center: string;
            color: string;
            column: string;
            configure_a_value_for_screen_sizes_or_larger: string;
            confirm: string;
            content: string;
            dashed: string;
            decoration: string;
            desktop: string;
            direction: string;
            display: string;
            dotted: string;
            draft_view: string;
            dynamic_value: string;
            enter_font_size: string;
            enter_font_weight: string;
            enter_text_shadow: string;
            flex_end: string;
            flex_items: string;
            flex_start: string;
            flex: string;
            grow: string;
            hidden: string;
            if_configured_will_be_applied_to_mobile_or_larger_breakpoints_if_you_configure_a_static_style_value_it_will_be_used_as_a_fallback_if_the_data_evaluates_to_undefined: string;
            individual_edges: string;
            individual: string;
            italic: string;
            items: string;
            justify: string;
            left: string;
            line_through: string;
            lowercase: string;
            margin_bottom: string;
            margin_left: string;
            margin_right: string;
            margin_top: string;
            margin: string;
            mobile: string;
            normal: string;
            opacity: string;
            overall: string;
            overflow: string;
            overline: string;
            padding_bottom: string;
            padding_left: string;
            padding_right: string;
            padding_top: string;
            padding: string;
            position: string;
            preview: string;
            radius: string;
            relative: string;
            reverse: string;
            right: string;
            row: string;
            select_display: string;
            select: string;
            selected_item: string;
            shadow: string;
            shrink: string;
            size: string;
            solid: string;
            space_around: string;
            space_between: string;
            space_evenly: string;
            static_value: string;
            stretch: string;
            style: string;
            tablet: string;
            top: string;
            transform: string;
            type_or_select_a_color: string;
            underline: string;
            uppercase: string;
            visible: string;
            web_preview: string;
            weight: string;
            width: string;
            wrap: string;
            z_index: string;
            data: string;
        };
    };
    export default _default_2;
}
/// <amd-module name="@scom/scom-designer/languages/components.json.ts" />
declare module "@scom/scom-designer/languages/components.json.ts" {
    const _default_3: {
        en: {
            add_component: string;
            add_item: string;
            are_you_sure_to_delete_this_component: string;
            confirm: string;
            data: string;
            delete_custom_block: string;
            delete: string;
            duplicate: string;
            enter_id: string;
            view_deleted_components: string;
            widget_settings: string;
            your_blocks: string;
            your_own_custom_components: string;
            structure: string;
        };
        "zh-hant": {
            add_component: string;
            add_item: string;
            are_you_sure_to_delete_this_component: string;
            confirm: string;
            data: string;
            delete_custom_block: string;
            delete: string;
            duplicate: string;
            enter_id: string;
            view_deleted_components: string;
            widget_settings: string;
            your_blocks: string;
            your_own_custom_components: string;
            structure: string;
        };
        vi: {
            add_component: string;
            add_item: string;
            are_you_sure_to_delete_this_component: string;
            confirm: string;
            data: string;
            delete_custom_block: string;
            delete: string;
            duplicate: string;
            enter_id: string;
            view_deleted_components: string;
            widget_settings: string;
            your_blocks: string;
            your_own_custom_components: string;
            structure: string;
        };
    };
    export default _default_3;
}
/// <amd-module name="@scom/scom-designer/languages/toolsHeader.json.ts" />
declare module "@scom/scom-designer/languages/toolsHeader.json.ts" {
    const _default_4: {
        en: {
            add_a_trigger_for_an_action: string;
            background: string;
            borders: string;
            custom_properties: string;
            define_a_relative_or_absolute_position_from_the_parent_element: string;
            define_the_border_size_and_styles: string;
            effects: string;
            layout: string;
            margins_and_padding: string;
            margins_create_extra_space_around_an_element_while_padding_creates_extra_space_within_an_element: string;
            media_query: string;
            position_and_display: string;
            reset_values: string;
            set_a_background_color_or_image_for_the_element: string;
            set_custom_properties_for_component: string;
            set_elevation_and_opacity_for_the_element: string;
            set_font_for_the_element: string;
            set_the_position_size_and_alignment_of_the_element: string;
            set_the_width_and_height_of_the_element: string;
            size: string;
            trigger: string;
            typography: string;
            widget_settings: string;
        };
        "zh-hant": {
            add_a_trigger_for_an_action: string;
            background: string;
            borders: string;
            custom_properties: string;
            define_a_relative_or_absolute_position_from_the_parent_element: string;
            define_the_border_size_and_styles: string;
            effects: string;
            layout: string;
            margins_and_padding: string;
            margins_create_extra_space_around_an_element_while_padding_creates_extra_space_within_an_element: string;
            media_query: string;
            position_and_display: string;
            reset_values: string;
            set_a_background_color_or_image_for_the_element: string;
            set_custom_properties_for_component: string;
            set_elevation_and_opacity_for_the_element: string;
            set_font_for_the_element: string;
            set_the_position_size_and_alignment_of_the_element: string;
            set_the_width_and_height_of_the_element: string;
            size: string;
            trigger: string;
            typography: string;
            widget_settings: string;
        };
        vi: {
            add_a_trigger_for_an_action: string;
            background: string;
            borders: string;
            custom_properties: string;
            define_a_relative_or_absolute_position_from_the_parent_element: string;
            define_the_border_size_and_styles: string;
            effects: string;
            layout: string;
            margins_and_padding: string;
            margins_create_extra_space_around_an_element_while_padding_creates_extra_space_within_an_element: string;
            media_query: string;
            position_and_display: string;
            reset_values: string;
            set_a_background_color_or_image_for_the_element: string;
            set_custom_properties_for_component: string;
            set_elevation_and_opacity_for_the_element: string;
            set_font_for_the_element: string;
            set_the_position_size_and_alignment_of_the_element: string;
            set_the_width_and_height_of_the_element: string;
            size: string;
            trigger: string;
            typography: string;
            widget_settings: string;
        };
    };
    export default _default_4;
}
/// <amd-module name="@scom/scom-designer/languages/index.ts" />
declare module "@scom/scom-designer/languages/index.ts" {
    import mainJson from "@scom/scom-designer/languages/main.json.ts";
    import propertiesJson from "@scom/scom-designer/languages/properties.json.ts";
    import componentsJson from "@scom/scom-designer/languages/components.json.ts";
    import toolsHeaderJson from "@scom/scom-designer/languages/toolsHeader.json.ts";
    export { mainJson, propertiesJson, componentsJson, toolsHeaderJson };
}
/// <amd-module name="@scom/scom-designer/components/components.tsx" />
declare module "@scom/scom-designer/components/components.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { IComponent, IScreen } from "@scom/scom-designer/interface.ts";
    import "@scom/scom-designer/components/index.css.ts";
    type visibleCallback = (component: IComponent, visible: boolean) => void;
    type selectCallback = (component: IComponent) => void;
    interface DesignerComponentsElement extends ControlElement {
        onShowComponentPicker: selectCallback;
        onSelect?: selectCallback;
        onVisible?: visibleCallback;
        onDelete?: selectCallback;
        onDuplicate?: selectCallback;
        onAdd?: selectCallback;
        onUpdate?: () => void;
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
        private pnlSide;
        private currentComponent;
        private _activeComponent;
        private dragId;
        private targetConfig;
        private elementsMap;
        private handleDragStart;
        private handleDrop;
        private handleDragEnd;
        private handleDragOver;
        onShowComponentPicker: selectCallback;
        onSelect: selectCallback;
        onVisible: visibleCallback;
        onDelete: selectCallback;
        onDuplicate: selectCallback;
        onAdd: selectCallback;
        onUpdate: () => void;
        constructor(parent?: Container, options?: any);
        get screen(): IScreen;
        set screen(value: IScreen);
        get activeComponent(): IComponent;
        set activeComponent(value: IComponent);
        private get isContainer();
        private get hasItem();
        private updateActiveStyle;
        renderUI(): void;
        private renderTreeItems;
        private initEvents;
        private onDragStart;
        private onDragEnd;
        private onDragOver;
        private onDrop;
        private removeEvents;
        onHide(): void;
        private isRootPanel;
        private showHightlight;
        private clearHoverStyle;
        private resetData;
        private dragEnd;
        private appendItem;
        private changeParent;
        private getParentID;
        private onHideComponent;
        private onShowActions;
        private initModalActions;
        private onConfirm;
        private removeElements;
        private onClose;
        private handleDelete;
        private handleDuplicate;
        init(): void;
        render(): any;
    }
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
    export const customFormStyle: string;
    export const customSwitchStyle: string;
    export const customModalStyle: string;
}
/// <amd-module name="@scom/scom-designer/tools/stylesheet.tsx" />
declare module "@scom/scom-designer/tools/stylesheet.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { onChangedCallback } from "@scom/scom-designer/interface.ts";
    interface DesignerToolStylesheetElement extends ControlElement {
        onChanged?: onChangedCallback;
    }
    interface IDesignerStylesheet {
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
        private stylesSelect;
        private lblStats;
        private _data;
        onChanged: onChangedCallback;
        constructor(parent?: Container, options?: DesignerToolStylesheetElement);
        private onCollapse;
        setData(value: IDesignerStylesheet): void;
        private renderUI;
        private getStylesOptions;
        private handleEdit;
        private handleCopy;
        private handleMove;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/selector.tsx" />
declare module "@scom/scom-designer/tools/selector.tsx" {
    import { ControlElement, Module } from "@ijstech/components";
    type selectorChanged = (type: string, value: string | number) => void;
    interface DesignerSelectorElement extends ControlElement {
        items?: IItem[];
        title?: string;
        direction?: 'horizontal' | 'vertical';
        activeItem?: string;
        isChanged?: boolean;
        onChanged?: selectorChanged;
    }
    interface IItem {
        caption?: string;
        tooltip?: string;
        value: string | number;
        type: string;
        icon?: any;
        placement?: string;
        rotate?: number;
        isActive?: boolean;
    }
    interface ISelector {
        items: IItem[];
        title?: string;
        direction?: 'horizontal' | 'vertical';
        activeItem?: string | number;
        isChanged?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                'designer-selector': DesignerSelectorElement;
            }
        }
    }
    export default class DesignerSelector extends Module {
        private pnlList;
        private lblTitle;
        private currentTarget;
        private gridSelector;
        private listMap;
        onChanged: selectorChanged;
        private _data;
        private selectedItem;
        get items(): IItem[];
        set items(value: IItem[]);
        get title(): string;
        set title(value: string);
        get activeItem(): string | number;
        set activeItem(value: string | number);
        get direction(): 'horizontal' | 'vertical';
        set direction(value: 'horizontal' | 'vertical');
        get isChanged(): boolean;
        set isChanged(value: boolean);
        set font(value: any);
        get font(): any;
        setData(value: ISelector): void;
        private renderUI;
        private onActiveChanged;
        private updateActiveItem;
        init(): void;
        render(): void;
    }
}
/// <amd-module name="@scom/scom-designer/tools/header.tsx" />
declare module "@scom/scom-designer/tools/header.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerToolHeaderElement extends ControlElement {
        name: string;
        tooltipText?: string;
        hasMediaQuery?: boolean;
        hasClear?: boolean;
        onCollapse: (isShown: boolean) => void;
        onReset?: () => void;
        onToggleMediaQuery?: (value: boolean) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-header']: DesignerToolHeaderElement;
            }
        }
    }
    export default class DesignerToolHeader extends Module {
        private _name;
        private _tooltipText;
        private _hasMediaQuery;
        private _hasClear;
        private isShown;
        private lbName;
        private iconArrow;
        private iconTooltip;
        private querySwitch;
        private lblSwitch;
        private pnlSwitch;
        private pnlClear;
        onCollapse: (isShown: boolean) => void;
        onReset: () => void;
        onToggleMediaQuery: (value: boolean) => void;
        constructor(parent?: Container, options?: DesignerToolHeaderElement);
        get name(): string;
        set name(value: string);
        get tooltipText(): string;
        set tooltipText(value: string);
        get hasMediaQuery(): boolean;
        set hasMediaQuery(value: boolean);
        get checked(): boolean;
        set checked(value: boolean);
        set isChanged(value: boolean);
        get hasClear(): boolean;
        set hasClear(value: boolean);
        set isQueryChanged(value: boolean);
        private renderUI;
        private _onCollapse;
        private _onClear;
        private onQueryChanged;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/layout.tsx" />
declare module "@scom/scom-designer/tools/layout.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { IMediaQuery, onChangedCallback, onUpdateCallback } from "@scom/scom-designer/interface.ts";
    interface IDesignerLayout {
        wrap?: string;
        direction?: string;
        alignItems?: string;
        justifyContent?: string;
        alignSelf?: string;
        alignContent?: string;
        name?: string;
        stack?: IStack;
        reverse?: boolean;
        mediaQuery?: IMediaQuery;
        default?: {
            [name: string]: any;
        };
    }
    export const DESIGNER_LAYOUT_PROPS: string[];
    interface IStack {
        basis?: string;
        grow?: string;
        shrink?: string;
    }
    interface DesignerToolLayoutElement extends ControlElement {
        onChanged?: onChangedCallback;
        onUpdate?: onUpdateCallback;
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
        private lbTypeFlex;
        private inputBasicFlex;
        private wrapperAdvancedFlex;
        private pnlFlexContent;
        private pnlFlexItems;
        private pnlSelectedItem;
        private directionSelector;
        private wrapSelector;
        private justifySelector;
        private alignSelector;
        private alignSelfSelector;
        private alignContentSelector;
        private reverseSwitch;
        private shrinkInput;
        private growInput;
        private basisInput;
        private designerHeader;
        private lblReverse;
        private lblFlex;
        private pnlReverse;
        private _data;
        private isBasicFlex;
        onChanged: onChangedCallback;
        onUpdate: onUpdateCallback;
        constructor(parent?: Container, options?: DesignerToolLayoutElement);
        get name(): string;
        set name(value: string);
        get isStack(): boolean;
        get isRepeater(): boolean;
        private get isChecked();
        private get currentData();
        private hasMediaQuery;
        setData(data: IDesignerLayout): void;
        private renderUI;
        private updateHighlight;
        private checkValues;
        private togglePanels;
        private onCollapse;
        private onFlexChanged;
        private onSelectChanged;
        private onReverseSwitch;
        private onBasicFlexChanged;
        private onAdvFlexChanged;
        private handleValueChanged;
        private handleMediaQuery;
        private onToggleMediaQuery;
        private onResetData;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/background.tsx" />
declare module "@scom/scom-designer/tools/background.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { IMediaQuery, onChangedCallback, onUpdateCallback } from "@scom/scom-designer/interface.ts";
    interface DesignerToolBackgroundElement extends ControlElement {
        onChanged?: onChangedCallback;
        onUpdate?: onUpdateCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-background']: DesignerToolBackgroundElement;
            }
        }
    }
    interface IDesignerBackground {
        background?: {
            color?: string;
            image?: string;
        };
        mediaQuery?: IMediaQuery;
        default?: {
            [name: string]: any;
        };
    }
    export const DESIGNER_BACKGROUND_PROPS: string[];
    export default class DesignerToolBackground extends Module {
        private vStackContent;
        private bgColor;
        private designerHeader;
        private lblColor;
        private _data;
        onChanged: onChangedCallback;
        onUpdate: onUpdateCallback;
        constructor(parent?: Container, options?: DesignerToolBackgroundElement);
        static create(options?: DesignerToolBackgroundElement, parent?: Container): Promise<DesignerToolBackground>;
        private get isChecked();
        private hasMediaQuery;
        setData(value: IDesignerBackground): void;
        private renderUI;
        private updateHighlight;
        private onCollapse;
        private onTypeChanged;
        private onColorChanged;
        private handleValueChanged;
        private handleMediaQuery;
        private onToggleMediaQuery;
        private onResetData;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/size.tsx" />
declare module "@scom/scom-designer/tools/size.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { IMediaQuery, onChangedCallback, onUpdateCallback } from "@scom/scom-designer/interface.ts";
    interface DesignerToolSizeElement extends ControlElement {
        onChanged?: onChangedCallback;
        onUpdate?: onUpdateCallback;
    }
    interface IDesignerSize {
        width?: number | string;
        height?: number | string;
        minWidth?: number | string;
        minHeight?: number | string;
        maxWidth?: number | string;
        maxHeight?: number | string;
        mediaQuery?: IMediaQuery;
        default?: {
            [name: string]: any;
        };
    }
    export const DESIGNER_SIZE_PROPS: string[];
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
        private pnlSizes;
        private designerHeader;
        private _data;
        private currentProp;
        onChanged: onChangedCallback;
        onUpdate: onUpdateCallback;
        constructor(parent?: Container, options?: DesignerToolSizeElement);
        private get isChecked();
        private hasMediaQuery;
        setData(value: IDesignerSize): void;
        private onCollapse;
        private renderUI;
        private checkValues;
        private onValueChanged;
        private handleValueChanged;
        private handleMediaQuery;
        private onToggleMediaQuery;
        private onResetData;
        private onShowUnits;
        private initModalUnits;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/modal-spacing.tsx" />
declare module "@scom/scom-designer/tools/modal-spacing.tsx" {
    import { Module, ControlElement, Container, IconName, Button } from '@ijstech/components';
    type onChangedCallback = (type: string, position: string, value: string) => void;
    interface DesignerToolModalSpacingElement extends ControlElement {
        config?: IConfig;
        data?: ISpacing;
        onChanged?: onChangedCallback;
    }
    interface ISpacing {
        value?: string | number;
        type?: string;
        position?: string;
    }
    interface IConfig {
        title?: string;
        breakpointText?: string;
        iconName?: IconName;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-modal-spacing']: DesignerToolModalSpacingElement;
            }
        }
    }
    export default class DesignerToolModalSpacing extends Module {
        private unit;
        private spacing;
        private config;
        private modal;
        private vStackIndUnits;
        private lbIndUnit;
        private lbTitle;
        private lbBreakpoint;
        private iconTitle;
        private inputValue;
        onChanged: onChangedCallback;
        constructor(parent?: Container, options?: DesignerToolModalSpacingElement);
        private initModal;
        private updateHeader;
        onShowModal(target: Button, value: ISpacing, config: IConfig): void;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/margins-padding.tsx" />
declare module "@scom/scom-designer/tools/margins-padding.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { IMediaQuery, onChangedCallback, onUpdateCallback } from "@scom/scom-designer/interface.ts";
    interface DesignerToolMarginsAndPaddingElement extends ControlElement {
        onChanged?: onChangedCallback;
        onUpdate?: onUpdateCallback;
    }
    interface IDesignerSpacing {
        margin?: {
            top?: string | number;
            right?: string | number;
            bottom?: string | number;
            left?: string | number;
        };
        padding?: {
            top?: string | number;
            right?: string | number;
            bottom?: string | number;
            left?: string | number;
        };
        mediaQuery?: IMediaQuery;
        default?: {
            [name: string]: any;
        };
    }
    export const DESIGNER_SPACING_PROPS: string[];
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
        private marginInput;
        private paddingInput;
        private vStackIndividual;
        private designerHeader;
        private lblPadding;
        private lblMargin;
        private _data;
        private currentProp;
        private _idvChanged;
        onChanged: onChangedCallback;
        onUpdate: onUpdateCallback;
        constructor(parent?: Container, options?: DesignerToolMarginsAndPaddingElement);
        private get isChecked();
        private get currentData();
        private hasMediaQuery;
        setData(data: IDesignerSpacing): void;
        private onCollapse;
        private renderUI;
        private resetInputs;
        private updateHighlight;
        private checkValues;
        private updateButtons;
        private onOverallChanged;
        private onShowUnitsModal;
        private initModalUnits;
        private onShowSpacingModal;
        private onSpacingChanged;
        private handleValueChanged;
        private handleMediaQuery;
        private onToggleMediaQuery;
        private onResetData;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/position.tsx" />
declare module "@scom/scom-designer/tools/position.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { IMediaQuery, onChangedCallback, onUpdateCallback } from "@scom/scom-designer/interface.ts";
    interface DesignerToolPositionElement extends ControlElement {
        onChanged?: onChangedCallback;
        onUpdate?: onUpdateCallback;
    }
    interface IDesignerPosition {
        position?: string;
        top?: number | string;
        right?: number | string;
        bottom?: number | string;
        left?: number | string;
        overflow?: {
            x?: string;
            y?: string;
        };
        zIndex?: string;
        display?: string;
        mediaQuery?: IMediaQuery;
        default?: {
            [name: string]: any;
        };
    }
    export const DESIGNER_POSITION_PROPS: string[];
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
        private zIndexInput;
        private pnlPosition;
        private overflowSelector;
        private posSelector;
        private designerHeader;
        private lblZIndex;
        private displaySelect;
        private lblDisplay;
        private _data;
        private _idvChanged;
        onChanged: onChangedCallback;
        onUpdate: onUpdateCallback;
        constructor(parent?: Container, options?: DesignerToolPositionElement);
        private get isChecked();
        private get currentData();
        private hasMediaQuery;
        setData(data: IDesignerPosition): void;
        private onCollapse;
        private renderUI;
        private updateHighlight;
        private checkValues;
        private updateButtons;
        private onShowModal;
        private onSelectChanged;
        private onSpacingChanged;
        private onDisplayChanged;
        private handleValueChanged;
        private handleMediaQuery;
        private onToggleMediaQuery;
        private onResetData;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/borders.tsx" />
declare module "@scom/scom-designer/tools/borders.tsx" {
    import { Module, ControlElement, Container, IBorder } from '@ijstech/components';
    import { IMediaQuery, onChangedCallback, onUpdateCallback } from "@scom/scom-designer/interface.ts";
    interface DesignerToolBordersElement extends ControlElement {
        onChanged?: onChangedCallback;
        onUpdate?: onUpdateCallback;
    }
    interface IDesignerBorder {
        border?: IBorder;
        mediaQuery?: IMediaQuery;
        default?: {
            [name: string]: any;
        };
    }
    export const DESIGNER_BORDER_PROPS: string[];
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
        private inputRadius;
        private inputWidth;
        private pnlIndividual;
        private styleSelector;
        private bgColor;
        private lblColor;
        private designerHeader;
        private lblWidth;
        private lblRadius;
        private _data;
        private radiusObj;
        private widthObj;
        private _idvChanged;
        onChanged: onChangedCallback;
        onUpdate: onUpdateCallback;
        constructor(parent?: Container, options?: DesignerToolBordersElement);
        private get isChecked();
        private get currentData();
        private hasMediaQuery;
        setData(value: IDesignerBorder): void;
        private onCollapse;
        private renderUI;
        private updateOverall;
        private updateHighlight;
        private checkValues;
        private updateButtons;
        private onShowSpacingModal;
        private radiusByPosition;
        private widthByPosition;
        private onPropChanged;
        private onSpacingChanged;
        private handleValueChanged;
        private handleMediaQuery;
        private onToggleMediaQuery;
        private onResetData;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/effects.tsx" />
declare module "@scom/scom-designer/tools/effects.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { onChangedCallback } from "@scom/scom-designer/interface.ts";
    interface DesignerToolEffectsElement extends ControlElement {
        onChanged?: onChangedCallback;
    }
    interface IDesignerEffect {
        opacity?: number | string;
        default?: {
            [name: string]: any;
        };
    }
    export const DESIGNER_EFFECT_PROPS: string[];
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
        private designerHeader;
        private _data;
        onChanged: onChangedCallback;
        constructor(parent?: Container, options?: DesignerToolEffectsElement);
        setData(value: IDesignerEffect): void;
        private get defaultOpacity();
        private onCollapse;
        private renderUI;
        private updateHighlight;
        private onInputEffectChanged;
        private onRangeChanged;
        private onResetData;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/content.tsx" />
declare module "@scom/scom-designer/tools/content.tsx" {
    import { Module, ControlElement, Container, IFont } from '@ijstech/components';
    import { IMediaQuery, onChangedCallback, onUpdateCallback } from "@scom/scom-designer/interface.ts";
    interface DesignerToolContentElement extends ControlElement {
        onChanged?: onChangedCallback;
        onUpdate?: onUpdateCallback;
    }
    interface IDesignerContent {
        name?: string;
        font?: IFont;
        mediaQuery?: IMediaQuery;
        default?: {
            [name: string]: any;
        };
    }
    export const DESIGNER_CONTENT_PROPS: string[];
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-content']: DesignerToolContentElement;
            }
        }
    }
    export default class DesignerToolContent extends Module {
        private vStackContent;
        private inputFontSize;
        private inputFontWeight;
        private designerHeader;
        private lblWeight;
        private lblSize;
        private transformSelector;
        private styleSelector;
        private inputShadow;
        private lblShadow;
        private _data;
        onChanged: onChangedCallback;
        onUpdate: onUpdateCallback;
        constructor(parent?: Container, options?: DesignerToolContentElement);
        private get isChecked();
        private hasMediaQuery;
        private get currentData();
        setData(value: IDesignerContent): void;
        private onCollapse;
        private renderUI;
        private updateHighlight;
        private checkFontProp;
        private onFontChanged;
        private onStyleChanged;
        private handleValueChanged;
        private handleMediaQuery;
        private onToggleMediaQuery;
        private onResetData;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/widgetSetting.tsx" />
declare module "@scom/scom-designer/tools/widgetSetting.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerToolWidgetElement extends ControlElement {
        onChanged?: (data: any) => void;
        onConfig?: () => void;
    }
    interface IDesignerWidgetSetting {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-widget-settings']: DesignerToolWidgetElement;
            }
        }
    }
    export default class DesignerToolWidget extends Module {
        private vStackContent;
        private _data;
        onChanged: (data: any) => void;
        onConfig: () => void;
        constructor(parent?: Container, options?: DesignerToolWidgetElement);
        setData(value: IDesignerWidgetSetting): void;
        private onCollapse;
        private onConfigClicked;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/templateAreas.tsx" />
declare module "@scom/scom-designer/tools/templateAreas.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerTemplateAreasElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-template-areas']: DesignerTemplateAreasElement;
            }
        }
    }
    export default class DesignerTemplateAreas extends Module {
        private pnlGroup;
        private _data;
        private groupsMap;
        constructor(parent?: Container, options?: any);
        static create(options?: DesignerTemplateAreasElement, parent?: Container): Promise<DesignerTemplateAreas>;
        getData(): string[][];
        setData(value: string[][]): void;
        private onAddGroup;
        private onAddItem;
        private onDeleteGroup;
        private onDeleteItem;
        private renderGroups;
        private renderGroup;
        private renderItem;
        private onUpdate;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/group.tsx" />
declare module "@scom/scom-designer/tools/group.tsx" {
    import { Module, ControlElement, Container, IDataSchema, IUISchema } from '@ijstech/components';
    import { IMediaQuery, onUpdateCallback } from "@scom/scom-designer/interface.ts";
    type onChangedCallback = (data: any, mediaQuery?: any) => void;
    interface DesignerToolGroupElement extends ControlElement {
        title?: string;
        tooltip?: string;
        uiSchema?: IUISchema;
        dataSchema?: IDataSchema;
        props?: any;
        customControls?: any;
        onChanged?: onChangedCallback;
        onUpdate?: onUpdateCallback;
    }
    interface IDesignerGroup {
        title?: string;
        tooltip?: string;
        uiSchema?: IUISchema;
        dataSchema?: IDataSchema;
        props?: any;
        customControls?: any;
        default?: {
            [name: string]: any;
        };
        mediaQuery?: IMediaQuery;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-group']: DesignerToolGroupElement;
            }
        }
    }
    export default class DesignerToolGroup extends Module {
        private vStackContent;
        private designerHeader;
        private form;
        private _data;
        onChanged: onChangedCallback;
        onUpdate: onUpdateCallback;
        constructor(parent?: Container, options?: DesignerToolGroupElement);
        private get isChecked();
        private get customProps();
        private hasMediaQuery;
        private get currentData();
        setData(value: IDesignerGroup): void;
        private onCollapse;
        private renderUI;
        private onToggleMediaQuery;
        private onResetData;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/tools/data.tsx" />
declare module "@scom/scom-designer/tools/data.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    interface IDesignerData {
        title?: string;
        props?: any;
        dataSchema?: any;
    }
    type onChangedCallback = (data: any, mediaQuery?: any) => void;
    interface DesignerToolDataElement extends ControlElement {
        title?: string;
        props?: any;
        dataSchema?: any;
        onChanged?: onChangedCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-tool-data']: DesignerToolDataElement;
            }
        }
    }
    export default class DesignerToolData extends Module {
        private designerHeader;
        private btnSubmit;
        private codeEditor;
        private mdData;
        private _data;
        onChanged: onChangedCallback;
        get data(): any;
        get dataSchema(): any;
        get dataString(): string;
        setData(value: IDesignerData): void;
        private renderUI;
        private showDatModal;
        private closeDataModal;
        private handleSubmit;
        init(): void;
        render(): void;
    }
}
/// <amd-module name="@scom/scom-designer/tools/index.ts" />
declare module "@scom/scom-designer/tools/index.ts" {
    import DesignerToolStylesheet from "@scom/scom-designer/tools/stylesheet.tsx";
    import DesignerToolLayout, { DESIGNER_LAYOUT_PROPS } from "@scom/scom-designer/tools/layout.tsx";
    import DesignerToolBackground, { DESIGNER_BACKGROUND_PROPS } from "@scom/scom-designer/tools/background.tsx";
    import DesignerToolSize, { DESIGNER_SIZE_PROPS } from "@scom/scom-designer/tools/size.tsx";
    import DesignerToolMarginsAndPadding, { DESIGNER_SPACING_PROPS } from "@scom/scom-designer/tools/margins-padding.tsx";
    import DesignerToolPosition, { DESIGNER_POSITION_PROPS } from "@scom/scom-designer/tools/position.tsx";
    import DesignerToolBorders, { DESIGNER_BORDER_PROPS } from "@scom/scom-designer/tools/borders.tsx";
    import DesignerToolEffects, { DESIGNER_EFFECT_PROPS } from "@scom/scom-designer/tools/effects.tsx";
    import DesignerToolContent, { DESIGNER_CONTENT_PROPS } from "@scom/scom-designer/tools/content.tsx";
    import DesignerToolWidget from "@scom/scom-designer/tools/widgetSetting.tsx";
    import DesignerToolGroup from "@scom/scom-designer/tools/group.tsx";
    import DesignerToolHeader from "@scom/scom-designer/tools/header.tsx";
    import DesignerSelector from "@scom/scom-designer/tools/selector.tsx";
    import DesignerToolData from "@scom/scom-designer/tools/data.tsx";
    export * from "@scom/scom-designer/tools/index.css.ts";
    export { DesignerToolStylesheet, DesignerToolLayout, DesignerToolBackground, DesignerToolSize, DesignerToolMarginsAndPadding, DesignerToolPosition, DesignerToolBorders, DesignerToolEffects, DesignerToolHeader, DesignerSelector, DesignerToolContent, DesignerToolGroup, DesignerToolWidget, DesignerToolData, DESIGNER_BACKGROUND_PROPS, DESIGNER_BORDER_PROPS, DESIGNER_POSITION_PROPS, DESIGNER_SIZE_PROPS, DESIGNER_SPACING_PROPS, DESIGNER_LAYOUT_PROPS, DESIGNER_EFFECT_PROPS, DESIGNER_CONTENT_PROPS };
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
    import { onEventChangedCallback, onEventDblClickCallback } from "@scom/scom-designer/interface.ts";
    interface DesignerTriggerElement extends ControlElement {
        events?: {
            [name: string]: any;
        };
        props?: {
            [name: string]: any;
        };
        onChanged?: onEventChangedCallback;
        onEventDblClick?: onEventDblClickCallback;
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
        private gdEvents;
        private _events;
        private _props;
        onChanged: onEventChangedCallback;
        onEventDblClick: onEventDblClickCallback;
        constructor(parent?: Container, options?: DesignerTriggerElement);
        static create(options?: DesignerTriggerElement, parent?: Container): Promise<DesignerTrigger>;
        get events(): {
            [name: string]: any;
        };
        set events(value: {
            [name: string]: any;
        });
        get props(): {
            [name: string]: any;
        };
        set props(value: {
            [name: string]: any;
        });
        setData({ events, props }: {
            events: {
                [name: string]: any;
            };
            props?: {
                [name: string]: any;
            };
        }): void;
        private onCollapse;
        private renderUI;
        private onInputChanged;
        private onHandleDbClick;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/triggers/index.ts" />
declare module "@scom/scom-designer/triggers/index.ts" {
    import DesignerTrigger from "@scom/scom-designer/triggers/trigger.tsx";
    export { DesignerTrigger };
}
/// <amd-module name="@scom/scom-designer/setting-data/params.tsx" />
declare module "@scom/scom-designer/setting-data/params.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerDataParamsElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-data-params']: DesignerDataParamsElement;
            }
        }
    }
    export default class DesignerDataParams extends Module {
        private vStackContent;
        constructor(parent?: Container, options?: DesignerDataParamsElement);
        private onCollapse;
        private renderUI;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/setting-data/linking.tsx" />
declare module "@scom/scom-designer/setting-data/linking.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface DesignerDataLinkingElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['designer-data-linking']: DesignerDataLinkingElement;
            }
        }
    }
    export default class DesignerDataLinking extends Module {
        private vStackContent;
        constructor(parent?: Container, options?: DesignerDataLinkingElement);
        private onCollapse;
        private renderUI;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/setting-data/index.tsx" />
declare module "@scom/scom-designer/setting-data/index.tsx" {
    import DesignerDataParams from "@scom/scom-designer/setting-data/params.tsx";
    import DesignerDataLinking from "@scom/scom-designer/setting-data/linking.tsx";
    export { DesignerDataParams, DesignerDataLinking };
}
/// <amd-module name="@scom/scom-designer/components/properties.tsx" />
declare module "@scom/scom-designer/components/properties.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { IControl, onChangedCallback, onEventChangedCallback, onEventDblClickCallback } from "@scom/scom-designer/interface.ts";
    import "@scom/scom-designer/settings/index.ts";
    import "@scom/scom-designer/triggers/index.ts";
    import "@scom/scom-designer/setting-data/index.tsx";
    interface DesignerPropertiesElement extends ControlElement {
        component?: IControl;
        onChanged?: onChangedCallback;
        onEventChanged?: onEventChangedCallback;
        onEventDblClick?: onEventDblClickCallback;
        onBreakpointChanged?: (value: number) => void;
        onPreviewChanged?: onChangedCallback;
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
        private designerStylesheet;
        private designerLayout;
        private designerBackground;
        private designerSize;
        private designerSpacing;
        private designerPosition;
        private designerBorders;
        private designerEffects;
        private designerContent;
        private customGroup;
        private breakpointSelector;
        private previewSelector;
        private designerTrigger;
        private designerData;
        private inputId;
        private designerWidget;
        private mdActions;
        private propTabs;
        private _component;
        onChanged: onChangedCallback;
        onBreakpointChanged: (value: number) => void;
        onPreviewChanged: onChangedCallback;
        onEventChanged: onEventChangedCallback;
        onEventDblClick: onEventDblClickCallback;
        constructor(parent?: Container, options?: any);
        static create(options?: DesignerPropertiesElement, parent?: Container): Promise<DesignerProperties>;
        get component(): IControl;
        set component(value: IControl);
        private get designerProps();
        private get isCustomWidget();
        show(isPreview: boolean): void;
        clear(): void;
        private renderUI;
        private renderTrigger;
        private renderCustomGroup;
        private updateInfo;
        onUpdate(): void;
        private updateProps;
        private getDefaultValues;
        private onPropChanged;
        private onGroupChanged;
        private onUpdateUI;
        private onIDChanged;
        private onControlEventChanged;
        private onBreakpointClick;
        private onPreviewClick;
        private onShowConfig;
        closePreview(): void;
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
    import { Module, ControlElement, Container, Control } from '@ijstech/components';
    import { IComponentItem } from "@scom/scom-designer/interface.ts";
    type onSelectCallback = (target: Control, component: IComponentItem) => void;
    interface DesignerPickerComponentsElement extends ControlElement {
        name: string;
        tooltipText?: string;
        items: IComponentItem[];
        isShown?: boolean;
        onSelect?: onSelectCallback;
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
        onSelect: onSelectCallback;
        constructor(parent?: Container, options?: DesignerPickerComponentsElement);
        private renderUI;
        private onItemSelected;
        private onCollapse;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/components/params.tsx" />
declare module "@scom/scom-designer/components/params.tsx" {
    import { Container, ControlElement, Module } from "@ijstech/components";
    import { ABIField, ABIType } from "@scom/ton-core";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-designer--deployer-params']: DeployerParamsElement;
            }
        }
    }
    interface DeployerParamsElement extends ControlElement {
        fields?: ABIField[];
        name?: string;
        onGetType?: (type: string) => ABIField;
    }
    type onGetTypeCallback = (type: string) => ABIType;
    export default class DeployerParams extends Module {
        private formParams;
        private lblName;
        private _data;
        private _schema;
        onGetType?: onGetTypeCallback;
        get fields(): ABIField[];
        set fields(value: ABIField[]);
        get name(): string;
        set name(value: string);
        constructor(parent?: Container, options?: any);
        validate(): Promise<import("@ijstech/form/types/index.ts").ValidationResult>;
        getFormData(): Promise<any>;
        private renderForm;
        private renderSchema;
        private getType;
        init(): void;
        render(): void;
    }
}
/// <amd-module name="@scom/scom-designer/components/index.ts" />
declare module "@scom/scom-designer/components/index.ts" {
    import DesignerComponents from "@scom/scom-designer/components/components.tsx";
    import DesignerProperties from "@scom/scom-designer/components/properties.tsx";
    import DesignerScreens from "@scom/scom-designer/components/screens.tsx";
    import DesignerPickerBlocks from "@scom/scom-designer/components/pickerBlocks.tsx";
    import DesignerPickerComponents from "@scom/scom-designer/components/pickerComponents.tsx";
    import DeployerParams from "@scom/scom-designer/components/params.tsx";
    export { DesignerComponents, DesignerProperties, DesignerScreens, DesignerPickerBlocks, DesignerPickerComponents, DeployerParams };
}
/// <amd-module name="@scom/scom-designer/data.ts" />
declare module "@scom/scom-designer/data.ts" {
    import { IBlock, IComponentPicker, IScreen } from "@scom/scom-designer/interface.ts";
    export const recentComponents: IComponentPicker[];
    export const pickerComponents: IComponentPicker[];
    export const blockComponents: IBlock[];
    export const screen: IScreen;
}
/// <amd-module name="@scom/scom-designer/designer/index.css.ts" />
declare module "@scom/scom-designer/designer/index.css.ts" {
    export const hoverStyle: string;
    export const selectedStyle: string;
}
/// <amd-module name="@scom/scom-designer/designer/designer.tsx" />
declare module "@scom/scom-designer/designer/designer.tsx" {
    import { Container, ControlElement, Module } from '@ijstech/components';
    import { IComponent, IComponentPicker, IControl, IStudio, IBlock, ActionType } from "@scom/scom-designer/interface.ts";
    import { Parser } from "@ijstech/compiler";
    interface ScomDesignerFormElement extends ControlElement {
        onPreview?: () => Promise<{
            module: string;
            script: string;
        }>;
        onTogglePreview?: (value: boolean) => void;
        onClose?: () => void;
        onSelectControl?: () => void;
        onDesignerChange?: (target: ScomDesignerForm, event: Event) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-designer--form']: ScomDesignerFormElement;
            }
        }
    }
    export class ScomDesignerForm extends Module {
        private designerScreens;
        private designerComponents;
        private designerProperties;
        private pnlComponentPicker;
        private pnlBlockPicker;
        private wrapperComponentPicker;
        private wrapperTab;
        private inputSearch;
        private currentTab;
        private pnlFormDesigner;
        private pnlPreview;
        private ifrPreview;
        private mdPicker;
        private designerWrapper;
        private pnlScreens;
        private pnlLoading;
        private pnlLeftIcon;
        private pnlRightIcon;
        private btnClosePreview;
        private mdMobile;
        private pnlWrap;
        private pnlDesignHeader;
        private pnlProperties;
        private pnlAddToChat;
        private pathMapping;
        private mouseDown;
        private resizing;
        private resizerPos;
        private mouseDownPos;
        private recentComponents;
        private _rootComponent;
        private selectedComponent;
        private currentParent;
        private designPos;
        private libsMap;
        private _customElements;
        private isPreviewing;
        baseUrl: string;
        private _previewUrl;
        private _selectedType;
        private _isPreviewDefault;
        private isPreviewMode;
        private handleMouseMoveBound;
        private handleMouseUpBound;
        selectedControl: IControl;
        modified: boolean;
        studio: IStudio;
        onPreview?: () => Promise<{
            module: string;
            script: string;
        }>;
        onTogglePreview?: (value: boolean) => void;
        onClose?: () => void;
        onSelectControl?: () => void;
        onDesignerChange?: (target: ScomDesignerForm) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomDesignerFormElement, parent?: Container): Promise<ScomDesignerForm>;
        setData(): void;
        get selectedType(): ActionType;
        set selectedType(value: ActionType);
        get isPreviewDefault(): boolean;
        set isPreviewDefault(value: boolean);
        set previewUrl(url: string);
        get previewUrl(): string;
        get pickerComponentsFiltered(): IComponentPicker[];
        getSelectedPosition(): number;
        private getComponents;
        get pickerBlocksFiltered(): IBlock[];
        private get isCustomWidget();
        private get isPageWidget();
        private createControl;
        private revertImageUrl;
        private getOptions;
        private updateDesignProps;
        private removeEmptyValue;
        private formatDesignProp;
        get rootComponent(): Parser.IComponent;
        clear(): void;
        private onScreenChanged;
        private onScreenHistoryShown;
        private onTabChanged;
        private onFilterComponent;
        private onShowComponentPicker;
        private onSelectComponent;
        private onVisibleComponent;
        private onDeleteComponent;
        private onDuplicateComponent;
        private duplicateItem;
        private renderComponent;
        private renderControl;
        private updateRepeater;
        private isParentGroup;
        private bindControlEvents;
        private handleSelectControl;
        private showDesignProperties;
        private onCloseComponentPicker;
        private handleAddControl;
        private getDefaultProps;
        private updateStructure;
        private initComponentPicker;
        private onAddComponent;
        private onAddItem;
        private initBlockPicker;
        private onPropertiesChanged;
        private updateIconProp;
        private updateLinkProp;
        private updateImageProp;
        private onControlEventChanged;
        private onControlEventDblClick;
        renderUI(root: IComponent): Promise<void>;
        private onUpdateDesigner;
        private handleControlMouseMove;
        private updatePosition;
        private handleControlMouseDown;
        private handleControlMouseUp;
        private updateDesignPosition;
        private handlePreviewChanged;
        preview(): Promise<void>;
        design(): Promise<void>;
        private togglePanels;
        closePreview(): void;
        private handleBreakpoint;
        private onToggleClick;
        private toggleLeftRightPanel;
        private initEvents;
        private onToggleStructure;
        private handleClose;
        private onModalOpen;
        private onModalClose;
        private handleAddToChat;
        hideAddToChatWidget(): void;
        onHide(): void;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer/designer/template.ts" />
declare module "@scom/scom-designer/designer/template.ts" {
    export const template = "\nimport { Module, customModule, Styles } from '@ijstech/components';\nimport ScomPageBlock from '@scom/page-block';\nimport ScomPageText from '@scom/page-text';\nimport ScomPageTextList from '@scom/page-text-list';\nimport ScomPageForm from '@scom/page-form';\nimport ScomPageButton from '@scom/page-button';\nimport ScomPageBlog from '@scom/page-blog';\nimport ScomPageBlogList from '@scom/page-blog-list';\nimport ScomPageBreadcrumb from '@scom/page-breadcrumb';\nimport ScomImage from '@scom/scom-image';\nimport ScomImageGallery from '@scom/scom-image-gallery';\nimport ScomCarousel from '@scom/scom-carousel';\n\n@customModule\nexport default class Main extends Module {\n  init() {\n    super.init();\n  }\n\n  render() {\n    return <i-panel width={'100%'} minHeight={'100%'}>\n   </i-panel>\n  }\n}";
}
/// <amd-module name="@scom/scom-designer/designer/index.ts" />
declare module "@scom/scom-designer/designer/index.ts" {
    export * from "@scom/scom-designer/designer/utils.ts";
    export { ScomDesignerForm } from "@scom/scom-designer/designer/designer.tsx";
    export { template } from "@scom/scom-designer/designer/template.ts";
}
/// <amd-module name="@scom/scom-designer/interface.ts" />
declare module "@scom/scom-designer/interface.ts" {
    import { Parser } from "@ijstech/compiler";
    import { Control, IconName } from "@ijstech/components";
    import { ScomDesignerForm } from "@scom/scom-designer/designer/index.ts";
    import { ABIField } from "@scom/ton-core";
    export interface IStudio {
        addEventHandler(designer: ScomDesignerForm, eventName: string, funcName: string): void;
        locateMethod(designer: ScomDesignerForm, funcName: string): void;
        removeComponent(designer: ScomDesignerForm): void;
        renameComponent(designer: ScomDesignerForm, oldId: string, newId: string): boolean;
        renameEventHandler(designer: ScomDesignerForm, funcName: string, newFuncName: string): boolean;
        registerWidget(designer: ScomDesignerForm, name: string, type: string): void;
    }
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
    export interface IComponentItem extends Parser.IComponent {
        path: string;
        image?: string;
        icon?: IconName;
        category?: string;
        parent?: string;
        repeater?: string;
        isShown?: boolean;
        tag?: any;
        hasItems?: boolean;
    }
    export interface IComponent extends IComponentItem {
        items?: IComponent[];
    }
    export interface IBlock {
        id: string;
        path: string;
        caption: string;
        image: string;
    }
    export interface IControl extends IComponent {
        control: Control;
    }
    export type onChangedCallback = (prop: string, value: string | number | boolean | object, mediaQueryProp?: string) => void;
    export type onUpdateCallback = (isChecked: boolean, props: string[]) => void;
    export type onEventChangedCallback = (prop: string, newValue: string, oldValue: string) => void;
    export type onEventDblClickCallback = (funcName: string) => void;
    export interface IFileHandler {
        openFile(file: IIPFSData, parentCid: string, parent: Control, config: any): Promise<void>;
    }
    export interface IIPFSData {
        cid: string;
        name?: string;
        size?: number;
        type?: string | 'dir' | 'file';
        links?: IIPFSData[];
        path?: string;
        sort?: 'asc' | 'desc';
        root?: boolean;
    }
    export interface IMediaQuery {
        minWidth: string;
        maxWidth?: string;
        properties: any;
    }
    export interface IFileData {
        path: string;
        content: string;
    }
    export interface IDeployConfig {
        endpoint?: string;
        apiKey?: string;
        mnemonic?: string;
    }
    export interface ICustomField extends ABIField {
        value?: any;
    }
    export type ActionType = 'hover' | 'click';
}
/// <amd-module name="@scom/scom-designer/build/storage.ts" />
declare module "@scom/scom-designer/build/storage.ts" {
    import { Types } from '@ijstech/compiler';
    import { IFileData } from "@scom/scom-designer/interface.ts";
    export class Storage implements Types.IStorage {
        rootPath: string;
        private _data;
        copied: {
            [packName: string]: boolean;
        };
        set data(value: IFileData);
        get data(): IFileData;
        constructor(rootPath: string);
        cidToSri(value: string): Promise<string>;
        copyAssets(sourceDir: string, targetDir: string): Promise<void>;
        copyPackage(packName: string, targetDir: string, packages?: string[]): Promise<any>;
        getSCConfig(): Promise<any>;
        getPackage(packName: string): Promise<any>;
        getPackageConfig(): Promise<any>;
        getPackageTypes(packName: string): Promise<Types.IPackage>;
        getFiles(dir: string): Promise<{
            [filePath: string]: string;
        }>;
        hashContent(dir: string): Promise<string>;
        hashDir(dir: string): Promise<Types.ICidInfo>;
        isDirectory(dir: string): Promise<boolean>;
        isFile(filePath: string): Promise<boolean>;
        isFileExists(filePath: string): Promise<boolean>;
        readDir(dir: string): Promise<string[]>;
        readFile(fileName: string): Promise<string>;
        rename(oldPath: string, newPath: string): Promise<void>;
        writeFile(fileName: string, content: string): Promise<void>;
    }
}
/// <amd-module name="@scom/scom-designer/build/tonConnectorSender.ts" />
declare module "@scom/scom-designer/build/tonConnectorSender.ts" {
    import { Address, Sender, SenderArguments } from "@scom/ton-core";
    export class TonConnectSender implements Sender {
        provider: any;
        readonly address?: Address;
        constructor(provider: any);
        send(args: SenderArguments): Promise<void>;
    }
}
/// <amd-module name="@scom/scom-designer/build/index.ts" />
declare module "@scom/scom-designer/build/index.ts" {
    export { Storage } from "@scom/scom-designer/build/storage.ts";
    export { TonConnectSender } from "@scom/scom-designer/build/tonConnectorSender.ts";
}
/// <amd-module name="@scom/scom-designer/deployer.tsx" />
declare module "@scom/scom-designer/deployer.tsx" {
    import { Container, ControlElement, Module } from '@ijstech/components';
    import { IDeployConfig, IFileData } from "@scom/scom-designer/interface.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-designer--deployer']: DeployerElement;
            }
        }
    }
    interface DeployerElement extends ControlElement {
        path?: string;
        content?: string;
        config?: IDeployConfig;
    }
    export class ScomDesignerDeployer extends Module {
        private _data;
        private _config;
        private storage;
        private initFields;
        private builtResult;
        private contract;
        private pnlMessage;
        private btnDeploy;
        private pnlParams;
        private formParams;
        constructor(parent?: Container, options?: any);
        setConfig(value: IDeployConfig): void;
        setData(value: IFileData): Promise<void>;
        private renderMessage;
        private handleCompile;
        private initDeploy;
        private getImportFile;
        private checkWalletConnection;
        private build;
        private deploy;
        private callDeploy;
        private parseParams;
        private getType;
        private getFileNames;
        private handleDeploy;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-designer" />
declare module "@scom/scom-designer" {
    import { Container, Control, ControlElement, Module } from '@ijstech/components';
    import { ActionType, IDeployConfig, IFileData, IFileHandler, IIPFSData, IStudio } from "@scom/scom-designer/interface.ts";
    import { Types } from '@ijstech/compiler';
    import { ScomCodeEditor, Monaco } from '@scom/scom-code-editor';
    import { ScomDesignerForm } from "@scom/scom-designer/designer/index.ts";
    type onSaveCallback = (target: ScomCodeEditor, event: any) => void;
    type onChangeCallback = (target: ScomDesigner, event: Event) => void;
    type onImportCallback = (fileName: string, isPackage?: boolean) => Promise<{
        fileName: string;
        content: string;
    } | null>;
    type onClosePreviewCallback = () => void;
    type onRenderErrorCallback = (errors: Types.ICompilerError[]) => void;
    type onSelectedWidgetCallback = (path: string, md: string, { startLine, endLine }: {
        startLine: number | string;
        endLine: number | string;
    }, fromDesigner: boolean) => void;
    interface ScomDesignerElement extends ControlElement {
        url?: string;
        file?: {
            path: string;
            content: string;
        };
        baseUrl?: string;
        dataUrl?: string;
        deployConfig?: IDeployConfig;
        selectedType?: ActionType;
        isPreviewDefault?: boolean;
        onSave?: onSaveCallback;
        onChange?: onChangeCallback;
        onPreview?: () => Promise<{
            module: string;
            script: string;
        }>;
        onTogglePreview?: (value: boolean) => void;
        onImportFile?: onImportCallback;
        onClosePreview?: onClosePreviewCallback;
        onRenderError?: onRenderErrorCallback;
        onSelectedWidget?: onSelectedWidgetCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-designer']: ScomDesignerElement;
            }
        }
    }
    interface IDesigner {
        url?: string;
        file?: IFileData;
        baseUrl?: string;
        dataUrl?: string;
    }
    export class ScomDesigner extends Module implements IFileHandler, IStudio {
        private formDesigner;
        private codeEditor;
        private deployDeployer;
        private compiler;
        private pnlMain;
        private codeTab;
        private designTab;
        private deployTab;
        private pnlHeader;
        private _data;
        private _isPreviewDefault;
        private _selectedType;
        private updateDesigner;
        private _components;
        private _previewUrl;
        private imported;
        private activeTab;
        private mode;
        private _deployConfig;
        private tempTsxPath;
        private tempTsxContent;
        private isWidgetsLoaded;
        private _selectedWidget;
        private _positions;
        private _oldLines;
        private _chatWidget;
        private handleSelectionChangeBound;
        onSave: onSaveCallback;
        onChange?: onChangeCallback;
        onPreview?: () => Promise<{
            module: string;
            script: string;
        }>;
        onImportFile?: onImportCallback;
        onTogglePreview?: (value: boolean) => void;
        onClosePreview?: onClosePreviewCallback;
        onRenderError?: onRenderErrorCallback;
        onSelectedWidget?: onSelectedWidgetCallback;
        tag: any;
        set previewUrl(url: string);
        addEventHandler(designer: ScomDesignerForm, eventName: string, funcName: string): void;
        locateMethod(designer: ScomDesignerForm, funcName: string): void;
        removeComponent(designer: ScomDesignerForm): void;
        renameComponent(designer: ScomDesignerForm, oldId: string, newId: string): boolean;
        renameEventHandler(designer: ScomDesignerForm, funcName: string, newFuncName: string): boolean;
        registerWidget(designer: ScomDesignerForm, name: string, type: string): Promise<void>;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomDesignerElement, parent?: Container): Promise<ScomDesigner>;
        get url(): string;
        set url(value: string);
        get file(): IFileData;
        set file(value: IFileData);
        get fileName(): string;
        get value(): string;
        get previewedValue(): string;
        get previewedFileName(): string;
        get baseUrl(): string;
        set baseUrl(value: string);
        get dataUrl(): string;
        set dataUrl(value: string);
        get deployConfig(): IDeployConfig;
        set deployConfig(value: IDeployConfig);
        get selectedType(): ActionType;
        set selectedType(value: ActionType);
        get isPreviewDefault(): boolean;
        set isPreviewDefault(value: boolean);
        get isValid(): boolean;
        get isTsx(): boolean;
        get isWidgetMD(): boolean;
        private get isContract();
        private setData;
        private getData;
        setValue(value: IDesigner): Promise<void>;
        getErrors(): Monaco.editor.IMarker[];
        updateFileName(oldValue: string, newValue: string): void;
        dispose(): void;
        disposeEditor(): void;
        saveViewState(): any;
        restoreViewState(state: any): void;
        clearPositions(): void;
        private renderUI;
        private renderContent;
        private createCodeEditor;
        executeInsert(textBefore: string, textAfter: string): {
            startLine: number;
            endLine: number;
            value: string;
        };
        showDesigner(): Promise<void>;
        private createFormDesigner;
        private handleDesignerChange;
        private createDeployer;
        private handleTogglePanels;
        private loadContent;
        private loadPageWidgets;
        private resetTab;
        private updateButtons;
        private addLib;
        private importCallback;
        private handleTabChanged;
        private getUpdatedMd;
        private updateMd;
        private parseMd;
        private parseTsx;
        private updateRoot;
        private updatePath;
        private handleCodeEditorChange;
        private handleCodeEditorSave;
        private handleCodeEditorSelectionChange;
        private updateAddToChatWidget;
        private handleAddToChat;
        private hideAddToChatWidget;
        getImportFile(fileName?: string, isPackage?: boolean): Promise<{
            fileName: string;
            content: string;
        }>;
        private getFile;
        private handleDesignerPreview;
        private getPageWidgets;
        private updateDesignerCode;
        openFile(file: IIPFSData, parentCid: string, parent: Control, config: any): Promise<void>;
        clear(): void;
        init(): void;
        private updateTag;
        private setTag;
        private updateStyle;
        renderMode(mode: string): Promise<void>;
        private updateTheme;
        private getTag;
        getConfigurators(): ({
            name: string;
            target: string;
            getActions: () => any[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        } | {
            name: string;
            target: string;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
            getActions?: undefined;
        })[];
        private _getActions;
        private getWidgetSchemas;
        render(): any;
    }
}

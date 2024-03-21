var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
define("@scom/scom-designer/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.customTabStyled = exports.customIconTabActiveStyled = exports.customIconTabStyled = exports.labelActiveStyled = exports.customLabelTabStyled = exports.blockItemHoverStyled = exports.iconButtonStyled = exports.rowItemActiveStyled = exports.rowItemHoverStyled = exports.hoverFullOpacity = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    exports.hoverFullOpacity = components_1.Styles.style({
        $nest: {
            '&:hover': {
                opacity: '1 !important',
                $nest: {
                    'i-icon': {
                        opacity: '1 !important'
                    }
                }
            }
        }
    });
    exports.rowItemHoverStyled = components_1.Styles.style({
        $nest: {
            '&:hover': {
                background: Theme.action.hoverBackground,
            }
        }
    });
    exports.rowItemActiveStyled = components_1.Styles.style({
        background: Theme.colors.info.dark,
        opacity: 1,
        $nest: {
            '&:hover': {
                background: Theme.colors.info.dark,
                cursor: 'default',
                $nest: {
                    'i-label': {
                        opacity: 1
                    }
                }
            }
        }
    });
    exports.iconButtonStyled = components_1.Styles.style({
        fontSize: '0.75rem',
        justifyContent: 'start',
        padding: '4px 8px'
    });
    exports.blockItemHoverStyled = components_1.Styles.style({
        $nest: {
            '&:hover': {
                background: Theme.colors.info.dark
            }
        }
    });
    exports.customLabelTabStyled = components_1.Styles.style({
        fontSize: '0.75rem',
        cursor: 'pointer',
        paddingBlock: '4px',
        textAlign: 'center',
        opacity: 0.8,
        $nest: {
            '&:hover': {
                background: '#26324b',
                opacity: 1
            }
        }
    });
    exports.labelActiveStyled = components_1.Styles.style({
        background: Theme.action.selectedBackground,
        opacity: 1,
        cursor: 'default !important',
        $nest: {
            '&:hover': {
                background: Theme.action.selectedBackground
            }
        }
    });
    exports.customIconTabStyled = components_1.Styles.style({
        cursor: 'pointer',
        background: Theme.action.hoverBackground,
        opacity: 0.8,
        $nest: {
            '&:hover': {
                background: Theme.action.selectedBackground,
                opacity: 1
            }
        }
    });
    exports.customIconTabActiveStyled = components_1.Styles.style({
        background: Theme.colors.info.dark,
        $nest: {
            '&:hover': {
                background: Theme.colors.info.dark,
                cursor: 'default'
            }
        }
    });
    exports.customTabStyled = components_1.Styles.style({
        $nest: {
            '.tabs-nav': {
                width: '100%'
            },
            '.tabs-nav .tab-item': {
                width: '100%'
            },
            '.tabs-nav .tab-item > i-icon': {
                margin: 'auto'
            },
            '.tabs-nav-wrap i-tab': {
                background: Theme.background.main,
                width: '25%'
            },
            '.tabs-nav-wrap i-tab:not(.disabled).active': {
                background: '#26324b'
            },
            '.tabs-nav-wrap i-tab.disabled': {
                opacity: 0.5,
                cursor: 'not-allowed'
            },
            '.tabs-content': {
                maxHeight: 'calc(100% - 40px)',
                overflow: 'auto'
            },
        }
    });
});
define("@scom/scom-designer/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-designer/components/components.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/index.css.ts"], function (require, exports, components_2, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    let DesignerComponents = class DesignerComponents extends components_2.Module {
        get screen() {
            return this._screen;
        }
        set screen(value) {
            this._screen = value;
            this.renderUI();
        }
        renderUI() {
            if (!this.screen || !this.vStackComponents)
                return;
            this.vStackComponents.clearInnerHTML();
            this.vStackComponents.appendChild(this.$render("i-hstack", { gap: 4, verticalAlignment: "center", padding: { top: 4, bottom: 4 } },
                this.$render("i-icon", { name: "mobile-alt", width: 14, height: 14 }),
                this.$render("i-label", { caption: this.screen.name, font: { size: '0.75rem' } })));
            this.renderTreeItems(this.screen.elements, this.vStackComponents, 0);
            // this.vStackComponents.appendChild(
            //   <i-tree-view data={this.screen.elements} />
            // );
        }
        renderTreeItems(elements, parentElm, parentPl) {
            const vStack1 = new components_2.VStack(parentElm);
            for (const elm of elements) {
                const hStack = new components_2.HStack(vStack1, {
                    gap: 2,
                    width: '100%',
                    verticalAlignment: 'center',
                    padding: { left: parentPl + 2, right: 4, top: 6, bottom: 6 }
                });
                hStack.classList.add(index_css_1.rowItemHoverStyled, index_css_1.hoverFullOpacity);
                let icon;
                if (elm.children?.length) {
                    let isShown = true;
                    icon = new components_2.Icon(hStack, { name: 'caret-down', width: 12, height: 12, margin: { right: 2 }, cursor: 'pointer' });
                    icon.onClick = () => {
                        isShown = !isShown;
                        icon.name = isShown ? 'caret-down' : 'caret-right';
                        vStack2.visible = isShown;
                    };
                    const vStack2 = new components_2.VStack(vStack1);
                    this.renderTreeItems(elm.children, vStack2, parentPl + 12);
                }
                const image = new components_2.Image(hStack, { url: elm.image, width: 14, height: 14, display: 'flex' });
                const label = new components_2.Label(hStack, { caption: elm.caption, font: { size: '0.75rem' }, lineHeight: 1, opacity: 0.8 });
                const input = new components_2.Input(hStack, { value: elm.caption, visible: false, font: { size: '0.75rem' }, border: 'none' });
                const hStackActions = new components_2.HStack(hStack, {
                    gap: 8,
                    position: 'relative',
                    verticalAlignment: 'center',
                    opacity: 0.8,
                    margin: { left: 'auto' },
                    padding: { left: 4 }
                });
                const onShowActions = (target, event) => {
                    const { pageX, pageY, screenX } = event;
                    let x = pageX;
                    if (pageX + 112 >= screenX) {
                        x = screenX - 112;
                    }
                    this.onShowActions(pageY + 5, x);
                };
                hStackActions.appendChild(this.$render("i-icon", { name: "ellipsis-h", width: 14, height: 14, opacity: 0, cursor: "pointer", onClick: onShowActions }));
                hStackActions.appendChild(this.$render("i-icon", { name: "eye", width: 14, height: 14, opacity: 0, cursor: "pointer", onClick: (icon) => this.onHideComponent(icon) }));
                hStack.onClick = () => {
                    const currentElm = this.vStackComponents.querySelector(`.${index_css_1.rowItemActiveStyled}`);
                    if (currentElm)
                        currentElm.classList.remove(index_css_1.rowItemActiveStyled);
                    hStack.classList.add(index_css_1.rowItemActiveStyled);
                    // TODO - change prop UI
                };
                hStack.onDblClick = () => {
                    label.visible = image.visible = hStackActions.visible = false;
                    if (icon)
                        icon.visible = false;
                    input.visible = true;
                };
                input.onBlur = () => {
                    if (input.value) {
                        label.caption = input.value;
                        // TODO - update list
                    }
                    else {
                        input.value = label.caption;
                    }
                    label.visible = image.visible = hStackActions.visible = true;
                    image.display = 'flex';
                    if (icon)
                        icon.visible = true;
                    input.visible = false;
                };
            }
        }
        onHideComponent(icon) {
            icon.name = icon.name === 'eye' ? 'eye-slash' : 'eye';
            // TODO - update list
        }
        onShowActions(top, left) {
            const mdWrapper = this.mdActions.querySelector('.modal-wrapper');
            mdWrapper.style.top = `${top}px`;
            mdWrapper.style.left = `${left}px`;
            this.mdActions.visible = true;
        }
        async initModalActions() {
            this.mdActions = await components_2.Modal.create({
                visible: false,
                showBackdrop: false,
                minWidth: '11.25rem',
                height: 'auto',
                popupPlacement: 'bottomRight'
            });
            const itemActions = new components_2.VStack(undefined, { gap: 8, border: { radius: 8 } });
            itemActions.appendChild(this.$render("i-button", { background: { color: 'transparent' }, boxShadow: "none", icon: { name: 'save', width: 12, height: 12 }, caption: "Save Custom Block", class: index_css_1.iconButtonStyled }));
            itemActions.appendChild(this.$render("i-button", { background: { color: 'transparent' }, boxShadow: "none", icon: { name: 'copy', width: 12, height: 12 }, caption: "Duplicate", class: index_css_1.iconButtonStyled }));
            itemActions.appendChild(this.$render("i-button", { background: { color: 'transparent' }, boxShadow: "none", icon: { name: 'trash', width: 12, height: 12 }, caption: "Delete", class: index_css_1.iconButtonStyled }));
            this.mdActions.item = itemActions;
            document.body.appendChild(this.mdActions);
        }
        init() {
            super.init();
            this.initModalActions();
            this.screen = this.getAttribute('screen', true);
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", maxWidth: Theme.layout.container.maxWidth, margin: { left: "auto", right: "auto" }, position: "relative", background: { color: Theme.background.main } },
                this.$render("i-hstack", { gap: 8, verticalAlignment: "center", horizontalAlignment: "space-between", padding: { top: 4, bottom: 4, left: 8 }, background: { color: '#26324b' } },
                    this.$render("i-label", { caption: "Components", font: { bold: true, size: '0.75rem' } }),
                    this.$render("i-hstack", { verticalAlignment: "center", margin: { left: 'auto' } },
                        this.$render("i-icon", { name: "history", class: index_css_1.hoverFullOpacity, opacity: 0.8, cursor: "pointer", width: 28, height: 24, padding: { top: 4, bottom: 4, left: 6, right: 6 }, border: {
                                left: { style: 'solid', color: Theme.divider, width: 1 },
                                right: { style: 'solid', color: Theme.divider, width: 1 }
                            }, tooltip: {
                                content: 'View Deleted Components'
                            } }),
                        this.$render("i-icon", { name: "plus-circle", class: index_css_1.hoverFullOpacity, opacity: 0.8, cursor: "pointer", width: 28, height: 24, padding: { top: 4, bottom: 4, left: 6, right: 6 }, tooltip: {
                                content: 'Add Component'
                            }, onClick: () => this.onShowComponentPicker() }))),
                this.$render("i-vstack", { id: "vStackComponents", gap: 4, overflow: "auto", maxHeight: "calc(100% - 32px)" }),
                this.$render("i-alert", { id: "mdAlert" })));
        }
    };
    DesignerComponents = __decorate([
        (0, components_2.customElements)('designer-components')
    ], DesignerComponents);
    exports.default = DesignerComponents;
});
define("@scom/scom-designer/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_3.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fullPath
    };
});
define("@scom/scom-designer/tools/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buttonAutoStyled = exports.unitStyled = exports.customColorStyled = exports.bgInputTransparent = exports.textInputRight = exports.borderRadiusRight = exports.borderRadiusLeft = exports.customIconLayoutActiveStyled = exports.customIconLayoutStyled = exports.customIconBorderStyled = void 0;
    const Theme = components_4.Styles.Theme.ThemeVars;
    exports.customIconBorderStyled = components_4.Styles.style({
        cursor: 'pointer',
        background: Theme.action.hoverBackground,
        border: `1px solid ${Theme.divider}`,
        borderRadius: 4,
        padding: 6,
        opacity: 0.8,
        $nest: {
            '&:hover': {
                background: Theme.action.selectedBackground,
                opacity: 1
            }
        }
    });
    exports.customIconLayoutStyled = components_4.Styles.style({
        cursor: 'pointer',
        background: Theme.action.hoverBackground,
        opacity: 0.8,
        $nest: {
            '&:hover': {
                background: Theme.action.selectedBackground,
                opacity: 1
            }
        }
    });
    exports.customIconLayoutActiveStyled = components_4.Styles.style({
        cursor: 'default',
        background: Theme.action.selectedBackground
    });
    exports.borderRadiusLeft = components_4.Styles.style({
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
    });
    exports.borderRadiusRight = components_4.Styles.style({
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8
    });
    exports.textInputRight = components_4.Styles.style({
        $nest: {
            'input': {
                textAlign: 'right'
            }
        }
    });
    exports.bgInputTransparent = components_4.Styles.style({
        background: 'transparent',
        $nest: {
            'input': {
                background: 'transparent'
            }
        }
    });
    exports.customColorStyled = components_4.Styles.style({
        $nest: {
            '.input-span': {
                minWidth: 24,
                height: 24,
                borderRadius: 4
            }
        }
    });
    exports.unitStyled = components_4.Styles.style({
        $nest: {
            '&:hover': {
                background: Theme.action.hoverBackground
            }
        }
    });
    exports.buttonAutoStyled = components_4.Styles.style({
        width: 40,
        height: 28,
        opacity: 0.8,
        background: 'transparent',
        border: `1px solid ${Theme.action.selectedBackground}`
    });
});
define("@scom/scom-designer/tools/header.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let DesignerToolHeader = class DesignerToolHeader extends components_5.Module {
        constructor(parent, options) {
            super(parent, options);
            this.isShown = true;
        }
        renderUI() {
            this.lbName.caption = this.name;
            this.iconArrow.name = 'angle-down';
            this.iconTooltip.visible = !!this.tooltipText;
            this.iconTooltip.tooltip.content = this.tooltipText || '';
        }
        _onCollapse() {
            this.isShown = !this.isShown;
            this.iconArrow.name = this.isShown ? 'angle-down' : 'angle-right';
            this.onCollapse(this.isShown);
        }
        init() {
            super.init();
            this.name = this.getAttribute('name', true) || '';
            this.tooltipText = this.getAttribute('tooltipText', true);
            this.onCollapse = this.getAttribute('onCollapse', true);
            this.renderUI();
        }
        render() {
            return (this.$render("i-hstack", { gap: 8, verticalAlignment: "center", cursor: "pointer", padding: { left: 8, right: 8, bottom: 8, top: 8 }, background: { color: '#26324b' }, onClick: this._onCollapse },
                this.$render("i-icon", { id: "iconArrow", name: "angle-down", width: 14, height: 14 }),
                this.$render("i-label", { id: "lbName", font: { size: '0.75rem', bold: true } }),
                this.$render("i-icon", { id: "iconTooltip", name: "exclamation-circle", width: 14, height: 14, opacity: 0.8 })));
        }
    };
    DesignerToolHeader = __decorate([
        (0, components_5.customElements)('designer-tool-header')
    ], DesignerToolHeader);
    exports.default = DesignerToolHeader;
});
define("@scom/scom-designer/tools/stylesheet.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/tools/index.css.ts"], function (require, exports, components_6, index_css_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_6.Styles.Theme.ThemeVars;
    let DesignerToolStylesheet = class DesignerToolStylesheet extends components_6.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        onCollapse(isShown) {
            this.vStackContent.visible = isShown;
        }
        renderUI() {
        }
        init() {
            super.init();
            this.renderUI();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", margin: { left: "auto", right: "auto" }, position: "relative" },
                this.$render("designer-tool-header", { name: "Stylesheet", onCollapse: this.onCollapse }),
                this.$render("i-vstack", { id: "vStackContent", gap: 8, padding: { top: 16, bottom: 16, left: 12, right: 12 } },
                    this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                        this.$render("i-combo-box", { items: [
                                {
                                    value: 'My Style',
                                    label: 'My Style'
                                }
                            ], placeholder: "Select or Create New..." }),
                        this.$render("i-icon", { name: "pen", width: 24, height: 24, class: index_css_2.customIconBorderStyled }),
                        this.$render("i-icon", { name: "copy", width: 24, height: 24, class: index_css_2.customIconBorderStyled }),
                        this.$render("i-icon", { name: "arrow-up", width: 24, height: 24, class: index_css_2.customIconBorderStyled }),
                        this.$render("i-icon", { name: "arrow-left", width: 24, height: 24, class: index_css_2.customIconBorderStyled })),
                    this.$render("i-label", { caption: "Styles: 0 direct, 0 disabled, 4 inherited", font: { size: '0.675rem' }, opacity: 0.6 }))));
        }
    };
    DesignerToolStylesheet = __decorate([
        (0, components_6.customElements)('designer-tool-stylesheet')
    ], DesignerToolStylesheet);
    exports.default = DesignerToolStylesheet;
});
define("@scom/scom-designer/tools/layout.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/tools/index.css.ts", "@scom/scom-designer/assets.ts"], function (require, exports, components_7, index_css_3, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_7.Styles.Theme.ThemeVars;
    const alignProps = [
        {
            caption: 'Flex Start',
            value: 'flex-start',
            img: assets_1.default.fullPath('img/designer/layout/align-start.svg'),
            classes: index_css_3.borderRadiusLeft
        },
        {
            caption: 'Center',
            value: 'center',
            img: assets_1.default.fullPath('img/designer/layout/align-center.svg')
        },
        {
            caption: 'Flex End',
            value: 'flex-end',
            img: assets_1.default.fullPath('img/designer/layout/align-start.svg'),
            rotate: 180
        },
        {
            caption: 'Stretch',
            value: 'stretch',
            img: assets_1.default.fullPath('img/designer/layout/align-stretch.svg'),
            isActive: true
        },
        {
            caption: 'Baseline',
            value: 'baseline',
            img: assets_1.default.fullPath('img/designer/layout/align-base-line.svg'),
            classes: index_css_3.borderRadiusRight
        }
    ];
    const justifyProps = [
        {
            caption: 'Flex Start',
            value: 'flex-start',
            img: assets_1.default.fullPath('img/designer/layout/justify-start.svg'),
            isActive: true,
            classes: index_css_3.borderRadiusLeft
        },
        {
            caption: 'Center',
            value: 'center',
            img: assets_1.default.fullPath('img/designer/layout/justify-center.svg')
        },
        {
            caption: 'Flex End',
            value: 'flex-end',
            img: assets_1.default.fullPath('img/designer/layout/justify-start.svg'),
            rotate: 180
        },
        {
            caption: 'Space Between',
            value: 'space-between',
            img: assets_1.default.fullPath('img/designer/layout/justify-between.svg')
        },
        {
            caption: 'Space Around',
            value: 'space-around',
            img: assets_1.default.fullPath('img/designer/layout/justify-around.svg')
        },
        {
            caption: 'Space Evenly',
            placement: 'left',
            value: 'space-evenly',
            img: assets_1.default.fullPath('img/designer/layout/justify-evenly.svg'),
            classes: index_css_3.borderRadiusRight
        }
    ];
    const alignContentProps = [
        {
            caption: 'Flex Start',
            value: 'flex-start',
            img: assets_1.default.fullPath('img/designer/layout/align-start.svg'),
            isActive: true,
            classes: index_css_3.borderRadiusLeft
        },
        {
            caption: 'Center',
            value: 'center',
            img: assets_1.default.fullPath('img/designer/layout/align-center.svg')
        },
        {
            caption: 'Flex End',
            value: 'flex-end',
            img: assets_1.default.fullPath('img/designer/layout/align-start.svg'),
            rotate: 180
        },
        {
            caption: 'Space Between',
            value: 'space-between',
            img: assets_1.default.fullPath('img/designer/layout/justify-between.svg'),
            rotate: 90
        },
        {
            caption: 'Space Around',
            value: 'space-around',
            img: assets_1.default.fullPath('img/designer/layout/justify-around.svg'),
            rotate: 90
        },
        {
            caption: 'Stretch',
            value: 'stretch',
            img: assets_1.default.fullPath('img/designer/layout/align-stretch.svg'),
            classes: index_css_3.borderRadiusRight
        }
    ];
    let DesignerToolLayout = class DesignerToolLayout extends components_7.Module {
        constructor(parent, options) {
            super(parent, options);
            this.isBasicFlex = true;
        }
        onCollapse(isShown) {
            this.vStackContent.visible = isShown;
        }
        onFlexChanged() {
            this.isBasicFlex = !this.isBasicFlex;
            this.lbTypeFlex.caption = this.isBasicFlex ? 'Advanced' : 'Basic';
            this.inputBasicFlex.enabled = this.inputBasicFlex.visible = this.isBasicFlex;
            this.wrapperAdvancedFlex.visible = !this.isBasicFlex;
        }
        renderUI() {
        }
        init() {
            super.init();
            this.renderUI();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", margin: { left: "auto", right: "auto" }, position: "relative" },
                this.$render("designer-tool-header", { name: "Layout", tooltipText: "With Flexbox, you can specify the layout of an element and its children to provide a consistent layout on different screen sizes.", onCollapse: this.onCollapse }),
                this.$render("i-vstack", { id: "vStackContent", gap: 16, padding: { top: 16, bottom: 16, left: 12, right: 12 } },
                    this.$render("i-vstack", { gap: 8 },
                        this.$render("i-label", { caption: "FLEX ITEMS", font: { size: '0.875rem' }, letterSpacing: "0.2em", opacity: 0.8 }),
                        this.$render("i-vstack", { gap: 12 },
                            this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                                this.$render("i-label", { caption: "Direction", font: { size: '0.75rem' } }),
                                this.$render("i-hstack", { gap: 12, verticalAlignment: "center" },
                                    this.$render("i-hstack", { gap: 1, verticalAlignment: "center", class: `${index_css_3.borderRadiusLeft} ${index_css_3.borderRadiusRight}` },
                                        this.$render("i-panel", { display: "flex", tooltip: { content: 'Column' }, class: `${index_css_3.borderRadiusLeft} ${index_css_3.customIconLayoutStyled} ${index_css_3.customIconLayoutActiveStyled}`, padding: { top: 4, bottom: 4, left: 8, right: 8 } },
                                            this.$render("i-image", { display: "flex", url: assets_1.default.fullPath('img/designer/layout/column.svg'), width: 16, height: 16 })),
                                        this.$render("i-panel", { display: "flex", tooltip: { content: 'Row' }, class: `${index_css_3.borderRadiusRight} ${index_css_3.customIconLayoutStyled}`, padding: { top: 4, bottom: 4, left: 8, right: 8 } },
                                            this.$render("i-image", { display: "flex", url: assets_1.default.fullPath('img/designer/layout/column.svg'), width: 16, height: 16, rotate: 180 }))),
                                    this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                                        this.$render("i-switch", null),
                                        this.$render("i-label", { caption: "Reverse", font: { size: '0.875rem' } })))),
                            this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                                this.$render("i-label", { caption: "Align", font: { size: '0.75rem' } }),
                                this.$render("i-hstack", { gap: 1, verticalAlignment: "center", class: `${index_css_3.borderRadiusLeft} ${index_css_3.borderRadiusRight}` }, alignProps.map(v => this.$render("i-panel", { display: "flex", tooltip: { content: v.caption }, class: `${index_css_3.customIconLayoutStyled} ${v.classes || ''} ${v.isActive ? index_css_3.customIconLayoutActiveStyled : ''}`, padding: { top: 4, bottom: 4, left: 17, right: 17 } },
                                    this.$render("i-image", { display: "flex", url: v.img, width: 16, height: 16, rotate: v.rotate || 0 }))))),
                            this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                                this.$render("i-label", { caption: "Justify", font: { size: '0.75rem' } }),
                                this.$render("i-hstack", { gap: 1, verticalAlignment: "center", class: `${index_css_3.borderRadiusLeft} ${index_css_3.borderRadiusRight}` }, justifyProps.map(v => this.$render("i-panel", { display: "flex", tooltip: { content: v.caption, placement: v.placement }, class: `${index_css_3.customIconLayoutStyled} ${v.classes || ''} ${v.isActive ? index_css_3.customIconLayoutActiveStyled : ''}`, padding: { top: 4, bottom: 4, left: 12.75, right: 12.75 } },
                                    this.$render("i-image", { display: "flex", url: v.img, width: 16, height: 16, rotate: v.rotate || 0 }))))))),
                    this.$render("i-panel", { width: "100%", height: 1, background: { color: Theme.divider } }),
                    this.$render("i-vstack", { gap: 8 },
                        this.$render("i-label", { caption: "SELECTED ITEM", font: { size: '0.875rem' }, letterSpacing: "0.2em", opacity: 0.8 }),
                        this.$render("i-vstack", { gap: 12 },
                            this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                                this.$render("i-label", { caption: "Align", font: { size: '0.75rem' } }),
                                this.$render("i-hstack", { gap: 1, verticalAlignment: "center", class: `${index_css_3.borderRadiusLeft} ${index_css_3.borderRadiusRight}` },
                                    this.$render("i-panel", { display: "flex", tooltip: { content: 'Auto' }, class: `${index_css_3.customIconLayoutStyled} ${index_css_3.borderRadiusLeft} ${index_css_3.customIconLayoutActiveStyled}`, padding: { top: 4, bottom: 4, left: 12.75, right: 12.75 } },
                                        this.$render("i-icon", { display: "flex", name: 'times', width: 16, height: 16 })),
                                    alignProps.map((v, idx) => this.$render("i-panel", { display: "flex", tooltip: { content: v.caption }, class: `${index_css_3.customIconLayoutStyled} ${idx === alignProps.length - 1 ? v.classes : ''}`, padding: { top: 4, bottom: 4, left: 12.75, right: 12.75 } },
                                        this.$render("i-image", { display: "flex", url: v.img, width: 16, height: 16 }))))),
                            this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'] },
                                this.$render("i-vstack", { gap: 8 },
                                    this.$render("i-label", { caption: "Flex", font: { size: '0.75rem' }, lineHeight: "24px" }),
                                    this.$render("i-hstack", { gap: 2, width: "fit-content", verticalAlignment: "center", opacity: 0.7, cursor: "pointer", onClick: this.onFlexChanged },
                                        this.$render("i-label", { id: "lbTypeFlex", caption: "Advanced", font: { size: '0.825rem' } }),
                                        this.$render("i-icon", { name: "arrow-right", fill: "#fff", width: 12, height: 12 }))),
                                this.$render("i-vstack", null,
                                    this.$render("i-input", { id: "inputBasicFlex", inputType: "number", placeholder: "0", width: "100%", height: 24, border: {
                                            radius: 8,
                                            width: 0
                                        }, padding: { left: 4, right: 4 }, font: { size: '0.75rem' }, class: index_css_3.textInputRight }),
                                    this.$render("i-grid-layout", { id: "wrapperAdvancedFlex", visible: false, gap: { column: 4 }, templateColumns: ['1fr', '1fr', '1fr'], maxWidth: 254, verticalAlignment: "center" },
                                        this.$render("i-vstack", { gap: 8, horizontalAlignment: "center" },
                                            this.$render("i-input", { inputType: "number", placeholder: "auto", width: "100%", height: 24, border: {
                                                    radius: 8,
                                                    width: 0
                                                }, padding: { left: 4, right: 4 }, font: { size: '0.75rem' }, class: index_css_3.textInputRight }),
                                            this.$render("i-label", { caption: "Basis", font: { size: '0.75rem' }, opacity: 0.7 })),
                                        this.$render("i-vstack", { gap: 8, horizontalAlignment: "center" },
                                            this.$render("i-input", { inputType: "number", placeholder: "0", width: "100%", height: 24, border: {
                                                    radius: 8,
                                                    width: 0
                                                }, padding: { left: 4, right: 4 }, font: { size: '0.75rem' }, class: index_css_3.textInputRight }),
                                            this.$render("i-label", { caption: "Grow", font: { size: '0.75rem' }, opacity: 0.7 })),
                                        this.$render("i-vstack", { gap: 8, horizontalAlignment: "center" },
                                            this.$render("i-input", { inputType: "number", placeholder: "1", width: "100%", height: 24, border: {
                                                    radius: 8,
                                                    width: 0
                                                }, padding: { left: 4, right: 4 }, font: { size: '0.75rem' }, class: index_css_3.textInputRight }),
                                            this.$render("i-label", { caption: "Shrink", font: { size: '0.75rem' }, opacity: 0.7 }))))))),
                    this.$render("i-panel", { width: "100%", height: 1, background: { color: Theme.divider } }),
                    this.$render("i-vstack", { gap: 8 },
                        this.$render("i-label", { caption: "CONTENT", font: { size: '0.875rem' }, letterSpacing: "0.2em", opacity: 0.8 }),
                        this.$render("i-vstack", { gap: 12 },
                            this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                                this.$render("i-label", { caption: "Wrap", font: { size: '0.75rem' } }),
                                this.$render("i-grid-layout", { gap: { column: 1 }, templateColumns: ['1fr', '1fr', '1fr'], verticalAlignment: "center" },
                                    this.$render("i-label", { caption: "None", class: `text-center ${index_css_3.customIconLayoutStyled} ${index_css_3.borderRadiusLeft} ${index_css_3.customIconLayoutActiveStyled}`, padding: { top: 4, bottom: 4 } }),
                                    this.$render("i-label", { caption: "Wrap", class: `text-center ${index_css_3.customIconLayoutStyled}`, padding: { top: 4, bottom: 4 } }),
                                    this.$render("i-label", { caption: "Reverse", class: `text-center ${index_css_3.customIconLayoutStyled} ${index_css_3.borderRadiusRight}`, padding: { top: 4, bottom: 4 } }))),
                            this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                                this.$render("i-label", { caption: "Align", font: { size: '0.75rem' } }),
                                this.$render("i-hstack", { gap: 1, verticalAlignment: "center", class: `${index_css_3.borderRadiusLeft} ${index_css_3.borderRadiusRight}` }, alignContentProps.map(v => this.$render("i-panel", { display: "flex", tooltip: { content: v.caption }, class: `${index_css_3.customIconLayoutStyled} ${v.classes || ''} ${v.isActive ? index_css_3.customIconLayoutActiveStyled : ''}`, padding: { top: 4, bottom: 4, left: 12.75, right: 12.75 } },
                                    this.$render("i-image", { display: "flex", url: v.img, width: 16, height: 16, rotate: v.rotate || 0 }))))))))));
        }
    };
    DesignerToolLayout = __decorate([
        (0, components_7.customElements)('designer-tool-layout')
    ], DesignerToolLayout);
    exports.default = DesignerToolLayout;
});
define("@scom/scom-designer/tools/background.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/tools/index.css.ts"], function (require, exports, components_8, index_css_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_8.Styles.Theme.ThemeVars;
    let DesignerToolBackground = class DesignerToolBackground extends components_8.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        onCollapse(isShown) {
            this.vStackContent.visible = isShown;
        }
        renderUI() {
        }
        init() {
            super.init();
            this.renderUI();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", margin: { left: "auto", right: "auto" }, position: "relative" },
                this.$render("designer-tool-header", { name: "Background", tooltipText: "Set a background color or image for the element.", onCollapse: this.onCollapse }),
                this.$render("i-vstack", { id: "vStackContent", padding: { top: 16, bottom: 16, left: 12, right: 12 } },
                    this.$render("i-grid-layout", { width: "100%", templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                        this.$render("i-label", { caption: "Color", font: { size: '0.75rem' } }),
                        this.$render("i-hstack", { gap: 4, width: "100%", verticalAlignment: "center" },
                            this.$render("i-color", { class: index_css_4.customColorStyled }),
                            this.$render("i-combo-box", { width: "calc(100% - 28px)", items: [
                                    {
                                        value: 'primary',
                                        label: 'Primary'
                                    },
                                    {
                                        value: 'secondary',
                                        label: 'Secondary'
                                    },
                                    {
                                        value: 'background',
                                        label: 'Background'
                                    }
                                ], placeholder: "Type or select a color..." }))))));
        }
    };
    DesignerToolBackground = __decorate([
        (0, components_8.customElements)('designer-tool-background')
    ], DesignerToolBackground);
    exports.default = DesignerToolBackground;
});
define("@scom/scom-designer/tools/size.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/tools/index.css.ts"], function (require, exports, components_9, index_css_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_9.Styles.Theme.ThemeVars;
    const sizes = [
        [
            {
                id: 'inputWidth',
                caption: 'Width'
            },
            {
                id: 'inputHeight',
                caption: 'Height'
            }
        ],
        [
            {
                id: 'inputMinWidth',
                caption: 'Min W'
            },
            {
                id: 'inputMinHeight',
                caption: 'Min H'
            }
        ],
        [
            {
                id: 'inputMaxWidth',
                caption: 'Max W'
            },
            {
                id: 'inputMaxHeight',
                caption: 'Max H'
            }
        ]
    ];
    let DesignerToolSize = class DesignerToolSize extends components_9.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        onCollapse(isShown) {
            this.vStackContent.visible = isShown;
        }
        renderUI() {
        }
        onShowUnits(target, event) {
            this.currentLabel = target;
            const rect = target.getBoundingClientRect();
            const { x, y } = rect;
            const mdWrapper = this.mdUnits.querySelector('.modal-wrapper');
            mdWrapper.style.top = `${y + 24}px`;
            mdWrapper.style.left = `${x}px`;
            this.mdUnits.visible = true;
        }
        async initModalUnits() {
            this.mdUnits = await components_9.Modal.create({
                visible: false,
                showBackdrop: false,
                minWidth: '24px',
                height: 'auto',
                popupPlacement: 'bottom'
            });
            const mdWrapper = this.mdUnits.querySelector('.modal-wrapper');
            mdWrapper.style.width = '24px';
            mdWrapper.style.paddingInline = '0px';
            const onUnitChanged = (value) => {
                this.currentLabel.caption = value;
                this.mdUnits.visible = false;
            };
            const itemUnits = new components_9.VStack(undefined, { gap: 8, border: { radius: 8 } });
            itemUnits.appendChild(this.$render("i-button", { background: { color: 'transparent' }, boxShadow: "none", caption: "pt", font: { size: '0.625rem' }, onClick: () => onUnitChanged('pt') }));
            itemUnits.appendChild(this.$render("i-button", { background: { color: 'transparent' }, boxShadow: "none", caption: "%", font: { size: '0.625rem' }, onClick: () => onUnitChanged('%') }));
            this.mdUnits.item = itemUnits;
            document.body.appendChild(this.mdUnits);
        }
        init() {
            super.init();
            this.renderUI();
            this.initModalUnits();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", margin: { left: "auto", right: "auto" }, position: "relative" },
                this.$render("designer-tool-header", { name: "Size", tooltipText: "Specify minimum, maximum, or specifically set heights and widths for the element.", onCollapse: this.onCollapse }),
                this.$render("i-vstack", { id: "vStackContent", padding: { top: 16, bottom: 16, left: 12, right: 12 } },
                    this.$render("i-vstack", { gap: 8 }, sizes.map(size => this.$render("i-hstack", { gap: 16, verticalAlignment: "center" }, size.map(v => this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                        this.$render("i-label", { caption: v.caption, font: { size: '0.75rem' } }),
                        this.$render("i-hstack", { verticalAlignment: "center", width: 80, border: { radius: 8 }, background: { color: Theme.input.background }, overflow: "hidden" },
                            this.$render("i-input", { id: v.id, inputType: "number", placeholder: "auto", background: { color: 'transparent' }, width: "calc(100% - 24px)", height: 24, border: { width: 0 }, padding: { left: 4, right: 2 }, font: { size: '0.675rem' }, class: `${index_css_5.textInputRight} ${index_css_5.bgInputTransparent}` }),
                            this.$render("i-label", { caption: "pt", font: { size: '0.675rem' }, cursor: "pointer", width: 24, height: 24, lineHeight: "24px", opacity: 1, border: {
                                    left: {
                                        width: 1,
                                        style: 'solid',
                                        color: Theme.action.focus
                                    }
                                }, class: `text-center ${index_css_5.unitStyled}`, onClick: (target, event) => this.onShowUnits(target, event) }))))))))));
        }
    };
    DesignerToolSize = __decorate([
        (0, components_9.customElements)('designer-tool-size')
    ], DesignerToolSize);
    exports.default = DesignerToolSize;
});
define("@scom/scom-designer/tools/modal-spacing.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/tools/index.css.ts"], function (require, exports, components_10, index_css_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_10.Styles.Theme.ThemeVars;
    let DesignerToolModalSpacing = class DesignerToolModalSpacing extends components_10.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        async initModal() {
            this.modal = await components_10.Modal.create({
                visible: false,
                showBackdrop: false,
                minWidth: '256px',
                height: 'auto',
                popupPlacement: 'bottom'
            });
            const onShowUnits = () => {
                this.vStackIndUnits.visible = true;
            };
            const onUnitChanged = (value) => {
                this.lbIndUnit.caption = value;
                this.vStackIndUnits.visible = false;
            };
            const onValueChanged = () => {
            };
            const item = new components_10.VStack(undefined, { gap: 8, border: { radius: 8 } });
            item.appendChild(this.$render("i-vstack", { gap: 12 },
                this.$render("i-hstack", { gap: 8, verticalAlignment: "center" },
                    this.$render("i-icon", { id: "iconTitle", name: this.iconName, width: 12, height: 12 }),
                    this.$render("i-label", { id: "lbTitle", caption: this.title, font: { size: '0.875rem', bold: true } })),
                this.$render("i-label", { id: "lbBreakpoint", caption: this.breakpointText, font: { size: '0.75rem' }, opacity: 0.8 }),
                this.$render("i-panel", { width: "100%", height: 1, background: { color: Theme.divider } }),
                this.$render("i-grid-layout", { position: "relative", templateColumns: ['100px', 'auto'], verticalAlignment: "center" },
                    this.$render("i-label", { caption: "Static Value:", font: { size: '0.75rem' } }),
                    this.$render("i-hstack", { verticalAlignment: "center", width: 80, border: { radius: 8 }, background: { color: Theme.input.background }, overflow: "hidden" },
                        this.$render("i-input", { inputType: "number", placeholder: "auto", background: { color: 'transparent' }, width: "calc(100% - 24px)", height: 24, border: { width: 0 }, padding: { left: 4, right: 2 }, font: { size: '0.675rem' }, class: `${index_css_6.textInputRight} ${index_css_6.bgInputTransparent}`, onChanged: onValueChanged, onClick: () => { this.vStackIndUnits.visible = false; } }),
                        this.$render("i-label", { id: "lbIndUnit", caption: "pt", font: { size: '0.675rem' }, cursor: "pointer", width: 24, height: 24, lineHeight: "24px", opacity: 1, border: {
                                left: {
                                    width: 1,
                                    style: 'solid',
                                    color: Theme.action.focus
                                }
                            }, class: `text-center ${index_css_6.unitStyled}`, onClick: () => onShowUnits() })),
                    this.$render("i-vstack", { id: "vStackIndUnits", gap: 8, position: "absolute", width: 24, top: 24, left: 156, background: { color: Theme.background.modal } },
                        this.$render("i-button", { background: { color: 'transparent' }, boxShadow: "none", caption: "pt", font: { size: '0.625rem' }, padding: { top: 4, bottom: 4 }, onClick: () => onUnitChanged('pt') }),
                        this.$render("i-button", { background: { color: 'transparent' }, boxShadow: "none", caption: "%", font: { size: '0.625rem' }, padding: { top: 4, bottom: 4 }, onClick: () => onUnitChanged('%') }))),
                this.$render("i-panel", { width: "100%", height: 1, background: { color: Theme.divider } }),
                this.$render("i-grid-layout", { templateColumns: ['100px', 'auto'], verticalAlignment: "center" },
                    this.$render("i-label", { caption: "Dynamic Value", font: { size: '0.75rem' } }),
                    this.$render("i-combo-box", { items: [], placeholder: "Select...", onClick: () => { this.vStackIndUnits.visible = false; } })),
                this.$render("i-label", { id: "lbNote", caption: "If configured, will be applied to Mobile or larger breakpoints. If you configure a static style value, it will be used as a fallback if the data evaluates to undefined.", font: { size: '0.675rem' }, opacity: 0.8 })));
            this.modal.item = item;
            document.body.appendChild(this.modal);
        }
        updateHeader() {
            this.lbTitle.caption = this.titleSpacing;
            this.lbBreakpoint.caption = this.breakpointText;
            this.iconTitle.name = this.iconName;
        }
        onShowModal(target, title, iconName, breakpointText) {
            this.vStackIndUnits.visible = false;
            this.titleSpacing = title;
            this.iconName = iconName;
            this.breakpointText = breakpointText;
            this.updateHeader();
            const rect = target.getBoundingClientRect();
            const { x, y } = rect;
            let pageX = x;
            let pageY = y;
            if (x + 321 >= innerWidth) {
                pageX = innerWidth - 321;
            }
            if (y + 240 >= innerHeight) {
                pageY = innerHeight - 240;
            }
            const mdWrapper = this.modal.querySelector('.modal-wrapper');
            mdWrapper.style.top = `${pageY + 24}px`;
            mdWrapper.style.left = `${pageX}px`;
            this.modal.visible = true;
        }
        init() {
            super.init();
            this.titleSpacing = this.getAttribute('titleSpacing', true, '');
            this.iconName = this.getAttribute('iconName', true, '');
            this.breakpointText = this.getAttribute('breakpointText', true, '');
            this.initModal();
        }
        render() {
            return (this.$render("i-panel", null));
        }
    };
    DesignerToolModalSpacing = __decorate([
        (0, components_10.customElements)('designer-tool-modal-spacing')
    ], DesignerToolModalSpacing);
    exports.default = DesignerToolModalSpacing;
});
define("@scom/scom-designer/tools/margins-padding.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/tools/index.css.ts"], function (require, exports, components_11, index_css_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_11.Styles.Theme.ThemeVars;
    let DesignerToolMarginsAndPadding = class DesignerToolMarginsAndPadding extends components_11.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        onCollapse(isShown) {
            this.vStackContent.visible = isShown;
        }
        renderUI() {
        }
        onShowUnitsModal(target) {
            this.currentLabel = target;
            const rect = target.getBoundingClientRect();
            const { x, y } = rect;
            const mdWrapper = this.mdUnits.querySelector('.modal-wrapper');
            mdWrapper.style.top = `${y + 24}px`;
            mdWrapper.style.left = `${x}px`;
            this.mdUnits.visible = true;
        }
        async initModalUnits() {
            this.mdUnits = await components_11.Modal.create({
                visible: false,
                showBackdrop: false,
                minWidth: '24px',
                height: 'auto',
                popupPlacement: 'bottom'
            });
            const mdWrapper = this.mdUnits.querySelector('.modal-wrapper');
            mdWrapper.style.width = '24px';
            mdWrapper.style.paddingInline = '0px';
            const onUnitChanged = (value) => {
                this.currentLabel.caption = value;
                this.mdUnits.visible = false;
            };
            const itemUnits = new components_11.VStack(undefined, { gap: 8, border: { radius: 8 } });
            itemUnits.appendChild(this.$render("i-button", { background: { color: 'transparent' }, boxShadow: "none", caption: "pt", font: { size: '0.625rem' }, onClick: () => onUnitChanged('pt') }));
            itemUnits.appendChild(this.$render("i-button", { background: { color: 'transparent' }, boxShadow: "none", caption: "%", font: { size: '0.625rem' }, onClick: () => onUnitChanged('%') }));
            this.mdUnits.item = itemUnits;
            document.body.appendChild(this.mdUnits);
        }
        onShowSpacingModal(target, title) {
            this.currentButton = target;
            this.mdSpacing.onShowModal(target, title, 'mobile-alt', 'Configure a value for Mobile screen sizes or larger');
        }
        init() {
            super.init();
            this.renderUI();
            this.initModalUnits();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", margin: { left: "auto", right: "auto" }, position: "relative" },
                this.$render("designer-tool-header", { name: "Margins And Padding", tooltipText: "Margins create extra space around an element, while padding creates extra space within an element.", onCollapse: this.onCollapse }),
                this.$render("i-vstack", { id: "vStackContent", gap: 16, padding: { top: 16, bottom: 16, left: 12, right: 12 } },
                    this.$render("i-vstack", { gap: 8 },
                        this.$render("i-label", { caption: "OVERALL", font: { size: '0.875rem' }, letterSpacing: "0.2em", opacity: 0.8 }),
                        this.$render("i-hstack", { gap: 16, verticalAlignment: "center" },
                            this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                                this.$render("i-label", { caption: "Margin", font: { size: '0.75rem' } }),
                                this.$render("i-hstack", { verticalAlignment: "center", width: 80, border: { radius: 8 }, background: { color: Theme.input.background }, overflow: "hidden" },
                                    this.$render("i-input", { inputType: "number", placeholder: "auto", background: { color: 'transparent' }, width: "calc(100% - 24px)", height: 24, border: { width: 0 }, padding: { left: 4, right: 2 }, font: { size: '0.675rem' }, class: `${index_css_7.textInputRight} ${index_css_7.bgInputTransparent}` }),
                                    this.$render("i-label", { caption: "pt", font: { size: '0.675rem' }, cursor: "pointer", width: 24, height: 24, lineHeight: "24px", opacity: 1, border: {
                                            left: {
                                                width: 1,
                                                style: 'solid',
                                                color: Theme.action.focus
                                            }
                                        }, class: `text-center ${index_css_7.unitStyled}`, onClick: (target) => this.onShowUnitsModal(target) }))),
                            this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                                this.$render("i-label", { caption: "Padding", font: { size: '0.75rem' } }),
                                this.$render("i-hstack", { verticalAlignment: "center", width: 80, border: { radius: 8 }, background: { color: Theme.input.background }, overflow: "hidden" },
                                    this.$render("i-input", { inputType: "number", placeholder: "auto", background: { color: 'transparent' }, width: "calc(100% - 24px)", height: 24, border: { width: 0 }, padding: { left: 4, right: 2 }, font: { size: '0.675rem' }, class: `${index_css_7.textInputRight} ${index_css_7.bgInputTransparent}` }),
                                    this.$render("i-label", { caption: "pt", font: { size: '0.675rem' }, cursor: "pointer", width: 24, height: 24, lineHeight: "24px", opacity: 1, border: {
                                            left: {
                                                width: 1,
                                                style: 'solid',
                                                color: Theme.action.focus
                                            }
                                        }, class: `text-center ${index_css_7.unitStyled}`, onClick: (target) => this.onShowUnitsModal(target) }))))),
                    this.$render("i-panel", { width: "100%", height: 1, background: { color: Theme.divider } }),
                    this.$render("i-vstack", { gap: 8 },
                        this.$render("i-label", { caption: "INDIVIDUAL", font: { size: '0.875rem' }, letterSpacing: "0.2em", opacity: 0.8 }),
                        this.$render("i-vstack", { gap: 8, width: "100%", horizontalAlignment: "center" },
                            this.$render("i-hstack", { position: "relative", width: "100%", horizontalAlignment: "center" },
                                this.$render("i-label", { caption: "Margin", font: { size: '0.75rem' }, position: "absolute", top: 0, left: 0 }),
                                this.$render("i-button", { caption: "auto", class: index_css_7.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Margin Top') })),
                            this.$render("i-hstack", { width: "100%", verticalAlignment: "center", horizontalAlignment: "space-between" },
                                this.$render("i-button", { caption: "auto", class: index_css_7.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Margin Left') }),
                                this.$render("i-panel", { position: "relative", width: 200, padding: { top: 10, bottom: 10, left: 10, right: 10 }, border: { width: 4, style: 'solid', color: Theme.action.selectedBackground } },
                                    this.$render("i-label", { caption: "Padding", font: { size: '0.75rem' }, position: "absolute", top: 10, left: 10 }),
                                    this.$render("i-vstack", { horizontalAlignment: "center" },
                                        this.$render("i-button", { caption: "auto", class: index_css_7.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Padding Top') }),
                                        this.$render("i-hstack", { width: "100%", horizontalAlignment: "space-between" },
                                            this.$render("i-button", { caption: "auto", class: index_css_7.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Padding Left') }),
                                            this.$render("i-button", { caption: "auto", class: index_css_7.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Padding Right') })),
                                        this.$render("i-button", { caption: "auto", class: index_css_7.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Padding Bottom') }))),
                                this.$render("i-button", { caption: "auto", class: index_css_7.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Margin Right') })),
                            this.$render("i-button", { caption: "auto", class: index_css_7.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Margin Bottom') })))),
                this.$render("designer-tool-modal-spacing", { id: "mdSpacing" })));
        }
    };
    DesignerToolMarginsAndPadding = __decorate([
        (0, components_11.customElements)('designer-tool-margins-padding')
    ], DesignerToolMarginsAndPadding);
    exports.default = DesignerToolMarginsAndPadding;
});
define("@scom/scom-designer/tools/position.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/tools/index.css.ts"], function (require, exports, components_12, index_css_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_12.Styles.Theme.ThemeVars;
    let DesignerToolPosition = class DesignerToolPosition extends components_12.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        onCollapse(isShown) {
            this.vStackContent.visible = isShown;
        }
        renderUI() {
        }
        onShowModal(target, title) {
            this.mdSpacing.onShowModal(target, title, 'mobile-alt', 'Configure a value for Mobile screen sizes or larger');
        }
        init() {
            super.init();
            this.renderUI();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", margin: { left: "auto", right: "auto" }, position: "relative" },
                this.$render("designer-tool-header", { name: "Position", tooltipText: "Define a relative or absolute position from the parent element.", onCollapse: this.onCollapse }),
                this.$render("i-vstack", { id: "vStackContent", padding: { top: 16, bottom: 16, left: 12, right: 12 } },
                    this.$render("i-vstack", { gap: 8 },
                        this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                            this.$render("i-label", { caption: "Position", font: { size: '0.75rem' } }),
                            this.$render("i-grid-layout", { gap: { column: 1 }, templateColumns: ['1fr', '1fr'], verticalAlignment: "center" },
                                this.$render("i-label", { caption: "Relative", class: `text-center ${index_css_8.customIconLayoutStyled} ${index_css_8.borderRadiusLeft} ${index_css_8.customIconLayoutActiveStyled}`, padding: { top: 4, bottom: 4 } }),
                                this.$render("i-label", { caption: "Absolute", class: `text-center ${index_css_8.customIconLayoutStyled} ${index_css_8.borderRadiusRight}`, padding: { top: 4, bottom: 4 } }))),
                        this.$render("i-panel", { width: 320, padding: { top: 10, bottom: 10, left: 20, right: 20 }, border: { radius: 8, width: 1, style: 'solid', color: Theme.action.selectedBackground } },
                            this.$render("i-vstack", { gap: 4, horizontalAlignment: "center" },
                                this.$render("i-button", { caption: "auto", class: index_css_8.buttonAutoStyled, onClick: (target) => this.onShowModal(target, 'Top') }),
                                this.$render("i-hstack", { width: "100%", horizontalAlignment: "space-between" },
                                    this.$render("i-button", { caption: "auto", class: index_css_8.buttonAutoStyled, onClick: (target) => this.onShowModal(target, 'Left') }),
                                    this.$render("i-button", { caption: "auto", class: index_css_8.buttonAutoStyled, onClick: (target) => this.onShowModal(target, 'Right') })),
                                this.$render("i-button", { caption: "auto", class: index_css_8.buttonAutoStyled, onClick: (target) => this.onShowModal(target, 'Bottom') }))),
                        this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                            this.$render("i-label", { caption: "Z-Index", font: { size: '0.75rem' } }),
                            this.$render("i-input", { id: "inputZIndex", inputType: "number", placeholder: "auto", width: "100%", height: 24, border: {
                                    radius: 8,
                                    width: 0
                                }, padding: { left: 4, right: 4 }, font: { size: '0.75rem' }, class: index_css_8.textInputRight })),
                        this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                            this.$render("i-label", { caption: "Overflow", font: { size: '0.75rem' } }),
                            this.$render("i-grid-layout", { gap: { column: 1 }, templateColumns: ['1fr', '1fr'], verticalAlignment: "center" },
                                this.$render("i-label", { caption: "Visible", class: `text-center ${index_css_8.customIconLayoutStyled} ${index_css_8.borderRadiusLeft} ${index_css_8.customIconLayoutActiveStyled}`, padding: { top: 4, bottom: 4 } }),
                                this.$render("i-label", { caption: "Hidden", class: `text-center ${index_css_8.customIconLayoutStyled} ${index_css_8.borderRadiusRight}`, padding: { top: 4, bottom: 4 } }))))),
                this.$render("designer-tool-modal-spacing", { id: "mdSpacing" })));
        }
    };
    DesignerToolPosition = __decorate([
        (0, components_12.customElements)('designer-tool-position')
    ], DesignerToolPosition);
    exports.default = DesignerToolPosition;
});
define("@scom/scom-designer/tools/borders.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/tools/index.css.ts", "@scom/scom-designer/assets.ts"], function (require, exports, components_13, index_css_9, assets_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_13.Styles.Theme.ThemeVars;
    const borderStyles = [
        {
            caption: 'Solid',
            value: 'solid',
            img: assets_2.default.fullPath('img/designer/border/solid.svg'),
            isActive: true,
            classes: index_css_9.borderRadiusLeft
        },
        {
            caption: 'Dotted',
            value: 'dotted',
            img: assets_2.default.fullPath('img/designer/border/dotted.svg')
        },
        {
            caption: 'Dashed',
            value: 'dashed',
            img: assets_2.default.fullPath('img/designer/border/dashed.svg'),
            classes: index_css_9.borderRadiusRight
        },
    ];
    let DesignerToolBorders = class DesignerToolBorders extends components_13.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        onCollapse(isShown) {
            this.vStackContent.visible = isShown;
        }
        renderUI() {
        }
        onShowSpacingModal(target, title) {
            this.currentButton = target;
            this.mdSpacing.onShowModal(target, title, 'mobile-alt', 'Configure a value for Mobile screen sizes or larger');
        }
        init() {
            super.init();
            this.renderUI();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", margin: { left: "auto", right: "auto" }, position: "relative" },
                this.$render("designer-tool-header", { name: "Borders", tooltipText: "Define the border size and styles.", onCollapse: this.onCollapse }),
                this.$render("i-vstack", { id: "vStackContent", gap: 16, padding: { top: 16, bottom: 16, left: 12, right: 12 } },
                    this.$render("i-vstack", { gap: 8 },
                        this.$render("i-label", { caption: "OVERALL", font: { size: '0.875rem' }, letterSpacing: "0.2em", opacity: 0.8 }),
                        this.$render("i-hstack", { gap: 16, verticalAlignment: "center" },
                            this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                                this.$render("i-label", { caption: "Width", font: { size: '0.75rem' } }),
                                this.$render("i-hstack", { verticalAlignment: "center", width: 80, border: { radius: 8 }, background: { color: Theme.input.background }, overflow: "hidden" },
                                    this.$render("i-input", { inputType: "number", placeholder: "auto", background: { color: 'transparent' }, width: "100%", height: 24, border: { width: 0 }, padding: { left: 4, right: 4 }, font: { size: '0.675rem' }, class: `${index_css_9.textInputRight} ${index_css_9.bgInputTransparent}` }))),
                            this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                                this.$render("i-label", { caption: "Radius", font: { size: '0.75rem' } }),
                                this.$render("i-hstack", { verticalAlignment: "center", width: 80, border: { radius: 8 }, background: { color: Theme.input.background }, overflow: "hidden" },
                                    this.$render("i-input", { inputType: "number", placeholder: "auto", background: { color: 'transparent' }, width: "100%", height: 24, border: { width: 0 }, padding: { left: 4, right: 4 }, font: { size: '0.675rem' }, class: `${index_css_9.textInputRight} ${index_css_9.bgInputTransparent}` }))))),
                    this.$render("i-panel", { width: "100%", height: 1, background: { color: Theme.divider } }),
                    this.$render("i-vstack", { gap: 8 },
                        this.$render("i-label", { caption: "INDIVIDUAL EDGES", font: { size: '0.875rem' }, letterSpacing: "0.2em", opacity: 0.8 }),
                        this.$render("i-vstack", { gap: 8, width: "100%", horizontalAlignment: "center" },
                            this.$render("i-hstack", { position: "relative", width: "100%", horizontalAlignment: "center" },
                                this.$render("i-label", { caption: "Width", font: { size: '0.75rem' }, position: "absolute", top: 0, left: 0 }),
                                this.$render("i-button", { caption: "auto", class: index_css_9.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Border Top Width') })),
                            this.$render("i-hstack", { width: "100%", verticalAlignment: "center", horizontalAlignment: "space-between" },
                                this.$render("i-button", { caption: "auto", class: index_css_9.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Border Left Width') }),
                                this.$render("i-vstack", { verticalAlignment: "space-between", width: 200, height: 100, padding: { top: 4, bottom: 4, left: 4, right: 4 }, border: { width: 4, style: 'solid', color: Theme.action.selectedBackground } },
                                    this.$render("i-hstack", { width: "100%", verticalAlignment: "center", horizontalAlignment: "space-between" },
                                        this.$render("i-button", { caption: "0", class: index_css_9.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Border Top Left Radius') }),
                                        this.$render("i-label", { caption: "Radius", font: { size: '0.75rem' } }),
                                        this.$render("i-button", { caption: "0", class: index_css_9.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Border Top Right Radius') })),
                                    this.$render("i-hstack", { width: "100%", horizontalAlignment: "space-between" },
                                        this.$render("i-button", { caption: "0", class: index_css_9.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Border Bottom Left Radius') }),
                                        this.$render("i-button", { caption: "0", class: index_css_9.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Border Bottom Left Radius') }))),
                                this.$render("i-button", { caption: "auto", class: index_css_9.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Border Right Width') })),
                            this.$render("i-button", { caption: "auto", class: index_css_9.buttonAutoStyled, onClick: (target) => this.onShowSpacingModal(target, 'Border Bottom Width') }))),
                    this.$render("i-panel", { width: "100%", height: 1, background: { color: Theme.divider } }),
                    this.$render("i-vstack", { gap: 8 },
                        this.$render("i-label", { caption: "DECORATION", font: { size: '0.875rem' }, letterSpacing: "0.2em", opacity: 0.8 }),
                        this.$render("i-grid-layout", { width: "100%", templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                            this.$render("i-label", { caption: "Color", font: { size: '0.75rem' } }),
                            this.$render("i-hstack", { gap: 4, width: "100%", verticalAlignment: "center" },
                                this.$render("i-color", { class: index_css_9.customColorStyled }),
                                this.$render("i-combo-box", { width: "calc(100% - 28px)", items: [
                                        {
                                            value: 'primary',
                                            label: 'Primary'
                                        },
                                        {
                                            value: 'secondary',
                                            label: 'Secondary'
                                        },
                                        {
                                            value: 'background',
                                            label: 'Background'
                                        }
                                    ], placeholder: "Type or select a color..." }))),
                        this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                            this.$render("i-label", { caption: "Style", font: { size: '0.75rem' } }),
                            this.$render("i-hstack", { gap: 1, verticalAlignment: "center", class: `${index_css_9.borderRadiusLeft} ${index_css_9.borderRadiusRight}` }, borderStyles.map(v => this.$render("i-panel", { display: "flex", tooltip: { content: v.caption }, class: `${index_css_9.customIconLayoutStyled} ${v.classes || ''} ${v.isActive ? index_css_9.customIconLayoutActiveStyled : ''}`, padding: { top: 4, bottom: 4, left: 34, right: 34 } },
                                this.$render("i-image", { display: "flex", url: v.img, width: 16, height: 16 }))))))),
                this.$render("designer-tool-modal-spacing", { id: "mdSpacing" })));
        }
    };
    DesignerToolBorders = __decorate([
        (0, components_13.customElements)('designer-tool-borders')
    ], DesignerToolBorders);
    exports.default = DesignerToolBorders;
});
define("@scom/scom-designer/tools/effects.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/tools/index.css.ts"], function (require, exports, components_14, index_css_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_14.Styles.Theme.ThemeVars;
    let DesignerToolEffects = class DesignerToolEffects extends components_14.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        onCollapse(isShown) {
            this.vStackContent.visible = isShown;
        }
        renderUI() {
            this.inputEffect.value = this.rangeEffect.value = 100;
        }
        onInputEffectChanged() {
            this.rangeEffect.value = this.inputEffect.value;
        }
        onRangeChanged() {
            this.inputEffect.value = this.rangeEffect.value;
        }
        init() {
            super.init();
            this.renderUI();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", margin: { left: "auto", right: "auto" }, position: "relative" },
                this.$render("designer-tool-header", { name: "Effects", tooltipText: "Set elevation and opacity for the element.", onCollapse: this.onCollapse }),
                this.$render("i-vstack", { id: "vStackContent", gap: 8, padding: { top: 16, bottom: 16, left: 12, right: 12 } },
                    this.$render("i-grid-layout", { templateColumns: ['70px', 'auto'], verticalAlignment: "center" },
                        this.$render("i-label", { caption: "Opacity", font: { size: '0.75rem' } }),
                        this.$render("i-hstack", { gap: 16, verticalAlignment: "center" },
                            this.$render("i-hstack", { verticalAlignment: "center", width: 80, border: { radius: 8 }, background: { color: Theme.input.background }, overflow: "hidden" },
                                this.$render("i-input", { id: "inputEffect", inputType: "number", placeholder: "auto", background: { color: 'transparent' }, width: "calc(100% - 24px)", height: 24, border: { width: 0 }, padding: { left: 4, right: 2 }, font: { size: '0.725rem' }, class: `${index_css_10.textInputRight} ${index_css_10.bgInputTransparent}`, onChanged: this.onInputEffectChanged }),
                                this.$render("i-label", { caption: "%", font: { size: '0.725rem' }, width: 24, height: 24, lineHeight: "24px", border: {
                                        left: {
                                            width: 1,
                                            style: 'solid',
                                            color: Theme.action.focus
                                        }
                                    }, class: "text-center" })),
                            this.$render("i-hstack", { width: "calc(100% - 96px)", verticalAlignment: "center" },
                                this.$render("i-range", { id: "rangeEffect", width: "100%", height: 16, min: 0, max: 100, onChanged: this.onRangeChanged })))))));
        }
    };
    DesignerToolEffects = __decorate([
        (0, components_14.customElements)('designer-tool-effects')
    ], DesignerToolEffects);
    exports.default = DesignerToolEffects;
});
define("@scom/scom-designer/tools/index.ts", ["require", "exports", "@scom/scom-designer/tools/stylesheet.tsx", "@scom/scom-designer/tools/layout.tsx", "@scom/scom-designer/tools/background.tsx", "@scom/scom-designer/tools/size.tsx", "@scom/scom-designer/tools/margins-padding.tsx", "@scom/scom-designer/tools/position.tsx", "@scom/scom-designer/tools/borders.tsx", "@scom/scom-designer/tools/effects.tsx", "@scom/scom-designer/tools/header.tsx", "@scom/scom-designer/tools/index.css.ts"], function (require, exports, stylesheet_1, layout_1, background_1, size_1, margins_padding_1, position_1, borders_1, effects_1, header_1, index_css_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DesignerToolHeader = exports.DesignerToolEffects = exports.DesignerToolBorders = exports.DesignerToolPosition = exports.DesignerToolMarginsAndPadding = exports.DesignerToolSize = exports.DesignerToolBackground = exports.DesignerToolLayout = exports.DesignerToolStylesheet = void 0;
    exports.DesignerToolStylesheet = stylesheet_1.default;
    exports.DesignerToolLayout = layout_1.default;
    exports.DesignerToolBackground = background_1.default;
    exports.DesignerToolSize = size_1.default;
    exports.DesignerToolMarginsAndPadding = margins_padding_1.default;
    exports.DesignerToolPosition = position_1.default;
    exports.DesignerToolBorders = borders_1.default;
    exports.DesignerToolEffects = effects_1.default;
    exports.DesignerToolHeader = header_1.default;
    __exportStar(index_css_11, exports);
});
define("@scom/scom-designer/settings/basic.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/tools/index.ts"], function (require, exports, components_15, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_15.Styles.Theme.ThemeVars;
    let DesignerSettingsBasic = class DesignerSettingsBasic extends components_15.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        onCollapse(isShown) {
            this.vStackContent.visible = isShown;
        }
        renderUI() {
            this.inputName.value = 'First Screen';
        }
        init() {
            super.init();
            this.renderUI();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", margin: { left: "auto", right: "auto" }, position: "relative" },
                this.$render("designer-tool-header", { name: "Basic", onCollapse: this.onCollapse }),
                this.$render("i-vstack", { id: "vStackContent", gap: 16, padding: { top: 16, bottom: 16, left: 12, right: 12 } },
                    this.$render("i-grid-layout", { templateColumns: ['128px', 'auto'], verticalAlignment: "center" },
                        this.$render("i-label", { caption: "Name", font: { size: '0.75rem' } }),
                        this.$render("i-input", { id: "inputName", width: "100%", height: 24, border: { radius: 8, width: 0 }, padding: { left: 4, right: 4 }, font: { size: '0.75rem' }, class: index_1.textInputRight })),
                    this.$render("i-grid-layout", { templateColumns: ['128px', 'auto'], verticalAlignment: "center" },
                        this.$render("i-label", { caption: "Description", font: { size: '0.75rem' } }),
                        this.$render("i-input", { width: "100%", height: 24, border: { radius: 8, width: 0 }, padding: { left: 4, right: 4 }, font: { size: '0.75rem' }, class: index_1.textInputRight })),
                    this.$render("i-grid-layout", { templateColumns: ['128px', 'auto'], verticalAlignment: "center" },
                        this.$render("i-label", { caption: "Status Bar Color", font: { size: '0.75rem' } }),
                        this.$render("i-grid-layout", { gap: { column: 1 }, templateColumns: ['1fr', '1fr', '1fr'], verticalAlignment: "center" },
                            this.$render("i-label", { caption: "Default", class: `text-center ${index_1.customIconLayoutStyled} ${index_1.borderRadiusLeft} ${index_1.customIconLayoutActiveStyled}`, padding: { top: 4, bottom: 4 } }),
                            this.$render("i-label", { caption: "Dark", class: `text-center ${index_1.customIconLayoutStyled}`, padding: { top: 4, bottom: 4 } }),
                            this.$render("i-label", { caption: "Light", class: `text-center ${index_1.customIconLayoutStyled} ${index_1.borderRadiusRight}`, padding: { top: 4, bottom: 4 } }))),
                    this.$render("i-grid-layout", { templateColumns: ['128px', 'auto'], verticalAlignment: "center" },
                        this.$render("i-label", { caption: "Scrollable?", font: { size: '0.75rem' } }),
                        this.$render("i-switch", { margin: { left: 'auto' } })))));
        }
    };
    DesignerSettingsBasic = __decorate([
        (0, components_15.customElements)('designer-settings-basic')
    ], DesignerSettingsBasic);
    exports.default = DesignerSettingsBasic;
});
define("@scom/scom-designer/settings/advanced.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_16.Styles.Theme.ThemeVars;
    let DesignerSettingsAdvanced = class DesignerSettingsAdvanced extends components_16.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        onCollapse(isShown) {
            this.vStackContent.visible = isShown;
        }
        renderUI() {
        }
        init() {
            super.init();
            this.renderUI();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", margin: { left: "auto", right: "auto" }, position: "relative" },
                this.$render("designer-tool-header", { name: "Advanced", onCollapse: this.onCollapse }),
                this.$render("i-vstack", { id: "vStackContent", gap: 16, padding: { top: 16, bottom: 16, left: 12, right: 12 } },
                    this.$render("i-label", { caption: "Safe Area View should only be enabled if you've explicitly removed or hidden the header from Stack Navigator within the Navigation config", font: { size: '0.75rem' }, opacity: 0.8 }),
                    this.$render("i-grid-layout", { templateColumns: ['130px', 'auto'], verticalAlignment: "center" },
                        this.$render("i-label", { caption: "Safe Area View?", font: { size: '0.75rem' } }),
                        this.$render("i-switch", { margin: { left: 'auto' } })),
                    this.$render("i-grid-layout", { templateColumns: ['130px', 'auto'], verticalAlignment: "center" },
                        this.$render("i-label", { caption: "Top Safe Area View?", font: { size: '0.75rem' } }),
                        this.$render("i-switch", { margin: { left: 'auto' } })),
                    this.$render("i-grid-layout", { templateColumns: ['130px', 'auto'], verticalAlignment: "center" },
                        this.$render("i-label", { caption: "Bottom Safe Area View?", font: { size: '0.75rem' } }),
                        this.$render("i-switch", { margin: { left: 'auto' } })))));
        }
    };
    DesignerSettingsAdvanced = __decorate([
        (0, components_16.customElements)('designer-settings-advanced')
    ], DesignerSettingsAdvanced);
    exports.default = DesignerSettingsAdvanced;
});
define("@scom/scom-designer/settings/index.ts", ["require", "exports", "@scom/scom-designer/settings/basic.tsx", "@scom/scom-designer/settings/advanced.tsx"], function (require, exports, basic_1, advanced_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DesignerSettingsAdvanced = exports.DesignerSettingsBasic = void 0;
    exports.DesignerSettingsBasic = basic_1.default;
    exports.DesignerSettingsAdvanced = advanced_1.default;
});
define("@scom/scom-designer/triggers/trigger.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_17.Styles.Theme.ThemeVars;
    let DesignerTrigger = class DesignerTrigger extends components_17.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        onCollapse(isShown) {
            this.vStackContent.visible = isShown;
        }
        renderUI() {
        }
        init() {
            super.init();
            this.renderUI();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", margin: { left: "auto", right: "auto" }, position: "relative" },
                this.$render("designer-tool-header", { name: "Trigger", tooltipText: "Add a trigger for an action.", onCollapse: this.onCollapse }),
                this.$render("i-vstack", { id: "vStackContent", gap: 16, padding: { top: 16, bottom: 16, left: 12, right: 12 } },
                    this.$render("i-grid-layout", { templateColumns: ['auto', '60px'], verticalAlignment: "center", padding: { top: 8, bottom: 8, left: 8, right: 8 }, border: { radius: 4 }, background: { color: '#26324b' }, cursor: "pointer" },
                        this.$render("i-vstack", { gap: 4 },
                            this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                                this.$render("i-icon", { name: "hand-point-up", width: 14, height: 14 }),
                                this.$render("i-label", { caption: "On Screen Focus", font: { size: '0.725rem', bold: true } })),
                            this.$render("i-label", { caption: "Runs when the screen comes into focus", font: { size: '0.725rem' }, opacity: 0.8 })),
                        this.$render("i-label", { caption: "0", font: { size: '0.625rem' }, padding: { top: 2, bottom: 2, left: 4, right: 4 }, border: { radius: 4, width: 1, style: 'solid', color: Theme.divider } })))));
        }
    };
    DesignerTrigger = __decorate([
        (0, components_17.customElements)('designer-trigger')
    ], DesignerTrigger);
    exports.default = DesignerTrigger;
});
define("@scom/scom-designer/triggers/index.ts", ["require", "exports", "@scom/scom-designer/triggers/trigger.tsx"], function (require, exports, trigger_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DesignerTrigger = void 0;
    exports.DesignerTrigger = trigger_1.default;
});
define("@scom/scom-designer/components/properties.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/assets.ts", "@scom/scom-designer/index.css.ts", "@scom/scom-designer/tools/index.ts", "@scom/scom-designer/settings/index.ts", "@scom/scom-designer/triggers/index.ts"], function (require, exports, components_18, assets_3, index_css_12, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_18.Styles.Theme.ThemeVars;
    const previews = [
        {
            caption: 'Draft View',
            icon: 'edit',
            value: 0 /* PREVIEWS.DRAFT */,
            classes: index_2.borderRadiusLeft,
            isActive: true
        },
        {
            caption: 'Web Preview',
            icon: 'globe',
            value: 1 /* PREVIEWS.WEB */
        },
        {
            caption: 'iOS Preview',
            url: assets_3.default.fullPath('img/designer/iOS.svg'),
            value: 2 /* PREVIEWS.IOS */
        },
        {
            caption: 'Android Preview',
            url: assets_3.default.fullPath('img/designer/Android.svg'),
            value: 3 /* PREVIEWS.ANDROID */,
            classes: index_2.borderRadiusRight
        }
    ];
    const breakpoints = [
        {
            caption: 'Mobile',
            icon: 'mobile-alt',
            value: 0 /* BREAKPOINTS.MOBILE */,
            classes: index_2.borderRadiusLeft,
            isActive: true
        },
        {
            caption: 'Tablet',
            icon: 'tablet-alt',
            value: 1 /* BREAKPOINTS.TABLET */
        },
        {
            caption: 'Laptop',
            icon: 'laptop',
            value: 2 /* BREAKPOINTS.LAPTOP */
        },
        {
            caption: 'Desktop',
            icon: 'desktop',
            value: 3 /* BREAKPOINTS.DESKTOP */
        },
        {
            caption: 'Big Screen',
            icon: 'tv',
            value: 4 /* BREAKPOINTS.BIG_SCREEN */,
            classes: index_2.borderRadiusRight
        }
    ];
    let DesignerProperties = class DesignerProperties extends components_18.Module {
        get component() {
            return this._component;
        }
        set component(value) {
            this._component = value;
            this.updateInfo();
        }
        updateInfo() {
            if (!this.component || !this.hStackInfo)
                return;
            const { caption, image, iconName, category } = this.component;
            this.hStackInfo.clearInnerHTML();
            this.hStackInfo.appendChild(this.$render("i-hstack", { gap: 8, verticalAlignment: "center", width: "100%" },
                iconName ? this.$render("i-icon", { name: iconName, width: 24, height: 24 }) : this.$render("i-image", { url: image, width: 24, height: 24 }),
                this.$render("i-label", { caption: caption, font: { size: '1rem', bold: true } }),
                this.$render("i-label", { caption: category || '', opacity: 0.6, font: { size: '0.625rem' }, margin: { left: 'auto' }, display: "flex" })));
        }
        init() {
            super.init();
        }
        render() {
            return (this.$render("i-vstack", { width: 360, height: "100%", minWidth: 350, maxWidth: "100%", margin: { left: "auto", right: "auto" }, position: "relative", background: { color: Theme.background.main }, border: { top: { width: 1, style: 'solid', color: Theme.divider } }, gap: 1 },
                this.$render("i-hstack", { gap: 4, width: "100%", verticalAlignment: "center", horizontalAlignment: "space-between", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, background: { color: '#26324b' }, stack: { shrink: '0' } },
                    this.$render("i-vstack", { gap: '0.5rem' },
                        this.$render("i-label", { caption: "BREAKPOINT", letterSpacing: "0.1rem", font: { size: '0.675rem' } }),
                        this.$render("i-hstack", { gap: 1, verticalAlignment: "center", class: `${index_2.borderRadiusLeft} ${index_2.borderRadiusRight}` }, breakpoints.map(v => this.$render("i-icon", { name: v.icon, width: '1.5rem', height: '1.5rem', tooltip: { content: v.caption }, class: `${index_css_12.customIconTabStyled} ${v.classes || ''} ${v.isActive ? index_css_12.customIconTabActiveStyled : ''}`, padding: { top: 6, bottom: 6, left: 6, right: 6 } })))),
                    this.$render("i-vstack", { gap: '0.5rem' },
                        this.$render("i-label", { caption: "PREVIEW", letterSpacing: "0.1rem", font: { size: '0.675rem' } }),
                        this.$render("i-hstack", { gap: 1, verticalAlignment: "center", background: { color: Theme.action.hoverBackground }, class: `${index_2.borderRadiusLeft} ${index_2.borderRadiusRight}` }, previews.map(v => v.icon ? this.$render("i-icon", { name: v.icon, width: '1.5rem', height: '1.5rem', tooltip: { content: v.caption }, class: `${index_css_12.customIconTabStyled} ${v.classes || ''} ${v.isActive ? index_css_12.customIconTabActiveStyled : ''}`, padding: { top: 6, bottom: 6, left: 6, right: 6 } }) : this.$render("i-image", { url: v.url, width: '1.5rem', height: '1.5rem', display: "flex", tooltip: { content: v.caption }, class: `${index_css_12.customIconTabStyled} ${v.classes || ''} ${v.isActive ? index_css_12.customIconTabActiveStyled : ''}`, padding: { top: 6, bottom: 6, left: 6, right: 6 } })))),
                    this.$render("i-vstack", { gap: '0.5rem' },
                        this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                            this.$render("i-label", { caption: "ENV", letterSpacing: "0.1rem", font: { size: '0.675rem' } }),
                            this.$render("i-icon", { name: "exclamation-circle", width: 12, height: 12, tooltip: { content: 'You can configure some values in your app to change based on which environment the app is running in. If unspecified, Development (Dev) values will be used.' } })),
                        this.$render("i-label", { caption: "Dev", font: { size: '0.675rem' }, width: "5rem", background: { color: Theme.action.hoverBackground }, class: `${index_2.borderRadiusLeft} ${index_2.borderRadiusRight}`, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' } }))),
                this.$render("i-hstack", { id: "hStackInfo", width: "100%", verticalAlignment: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, background: { color: '#26324b' }, stack: { shrink: '0' } }),
                this.$render("i-tabs", { mode: "horizontal", activeTabIndex: 0, class: index_css_12.customTabStyled, stack: { grow: '1' }, overflow: 'hidden' },
                    this.$render("i-tab", { icon: { name: 'paint-brush', width: '1.5rem', height: '1.5rem' } },
                        this.$render("i-vstack", { gap: 1, width: "100%" },
                            this.$render("designer-tool-stylesheet", { display: "block" }),
                            this.$render("designer-tool-layout", { display: "block" }),
                            this.$render("designer-tool-background", { display: "block" }),
                            this.$render("designer-tool-size", { display: "block" }),
                            this.$render("designer-tool-margins-padding", { display: "block" }),
                            this.$render("designer-tool-position", { display: "block" }),
                            this.$render("designer-tool-borders", { display: "block" }),
                            this.$render("designer-tool-effects", { display: "block" }))),
                    this.$render("i-tab", { icon: { name: 'sliders-h', width: '1.5rem', height: '1.5rem' } },
                        this.$render("i-vstack", { gap: 1, width: "100%" },
                            this.$render("designer-settings-basic", { display: "block" }),
                            this.$render("designer-settings-advanced", { display: "block" }))),
                    this.$render("i-tab", { icon: { name: 'database', width: '1.5rem', height: '1.5rem' } },
                        this.$render("i-label", { caption: "Database" })),
                    this.$render("i-tab", { icon: { name: 'magic', width: '1.5rem', height: '1.5rem' } },
                        this.$render("i-vstack", { gap: 1, width: "100%" },
                            this.$render("designer-trigger", { display: "block" }))))));
        }
    };
    DesignerProperties = __decorate([
        (0, components_18.customElements)('designer-properties')
    ], DesignerProperties);
    exports.default = DesignerProperties;
});
define("@scom/scom-designer/components/screens.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/index.css.ts"], function (require, exports, components_19, index_css_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_19.Styles.Theme.ThemeVars;
    let DesignerScreens = class DesignerScreens extends components_19.Module {
        constructor() {
            super(...arguments);
            this.listScreen = [];
            this.selectedId = '';
        }
        onShow(options) {
        }
        get screens() {
            return this.listScreen;
        }
        onHideScreen(icon, id) {
            const idx = this.listScreen.findIndex(screen => screen.id === id);
            this.listScreen[idx].isHidden = !this.listScreen[idx].isHidden;
            if (this.listScreen[idx].isHidden) {
                icon.name = 'eye-slash';
            }
            else {
                icon.name = 'eye';
            }
        }
        onShowModalDelete(id) {
            this.mdAlert.title = 'Delete Screen';
            this.mdAlert.status = 'confirm';
            this.mdAlert.content = 'Are you sure you want to delete this Screen?';
            this.mdAlert.onConfirm = () => this.onDeleteScreen(id);
            this.mdAlert.showModal();
        }
        onDeleteScreen(id) {
            const idx = this.listScreen.findIndex(screen => screen.id === id);
            const deletedScreen = this.listScreen[idx];
            this.listScreen[idx].isDeleted = true;
            const screenElm = this.vStackScreens.querySelector(`#screen-${id}`);
            this.vStackScreens.removeChild(screenElm);
            this.mdActions.visible = false;
            this.lbScreens.caption = `Screens (${this.listScreen.filter(v => !v.isDeleted).length})`;
            this.lbDeletedScreens.caption = `Deleted Screens (${this.listScreen.filter(v => v.isDeleted).length})`;
            const onRestore = () => {
                this.listScreen[idx].isDeleted = false;
                this.onAddScreen(deletedScreen.name, deletedScreen.elements, deletedScreen.id);
                this.vStackDeletedScreens.removeChild(pnl);
                this.lbDeletedScreens.caption = `Deleted Screens (${this.listScreen.filter(v => v.isDeleted).length})`;
            };
            const pnl = new components_19.Panel();
            pnl.appendChild(this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", padding: { top: 4, bottom: 4, left: 8, right: 8 }, class: `${index_css_13.hoverFullOpacity} ${index_css_13.rowItemHoverStyled}` },
                this.$render("i-label", { caption: `${deletedScreen.name} (Deleted)`, font: { size: '0.75rem' } }),
                this.$render("i-icon", { name: "trash-restore", width: 14, height: 14, opacity: 0, cursor: "pointer", tooltip: { content: 'Restore Deleted Screen' }, onClick: onRestore })));
            this.vStackDeletedScreens.appendChild(pnl);
        }
        onDuplicateScreen(id) {
            const screen = this.listScreen.find(screen => screen.id === id);
            this.onAddScreen(screen.name, screen.elements);
            this.mdActions.visible = false;
        }
        getNewName(name) {
            let newName = name;
            while (this.listScreen.some(screen => screen.name === newName && !screen.isDeleted)) {
                const regex = /(\d+)$/;
                const matches = newName.match(regex);
                if (matches) {
                    const lastNumber = parseInt(matches[1]);
                    const updatedString = newName.replace(/\s\d+$/, '');
                    newName = `${updatedString} ${lastNumber + 1}`;
                }
                else {
                    newName = `${newName} 1`;
                }
            }
            return newName;
        }
        onUpdateName(id, name) {
            const idx = this.listScreen.findIndex(screen => screen.id === id);
            this.listScreen[idx].name = name;
        }
        onAddScreen(name, elements, _id) {
            const _name = this.getNewName(name);
            const id = _id || components_19.IdUtils.generateUUID();
            if (!_id) {
                const obj = {
                    id,
                    name: _name,
                    elements: elements || []
                };
                this.listScreen.push(obj);
            }
            else {
                const index = this.listScreen.findIndex(v => v.id === _id);
                this.listScreen[index].name = _name;
            }
            const lb = new components_19.Label(undefined, { caption: _name, font: { size: '0.75rem' } });
            const input = new components_19.Input(undefined, { width: '100%', value: _name, visible: false, font: { size: '0.75rem' }, border: 'none' });
            input.onBlur = () => {
                if (input.value) {
                    lb.caption = this.getNewName(input.value);
                    this.onUpdateName(id, lb.caption);
                }
                else {
                    input.value = lb.caption;
                }
                lb.visible = true;
                hStackActions.visible = true;
                input.visible = false;
            };
            const onEditName = () => {
                lb.visible = false;
                hStackActions.visible = false;
                input.visible = true;
            };
            const onShowActions = (target, event) => {
                this.selectedId = id;
                onScreenChanged();
                const { pageX, pageY, screenX } = event;
                let x = pageX;
                if (pageX + 112 >= screenX) {
                    x = screenX - 112;
                }
                this.onShowActions(pageY + 5, x);
            };
            const onScreenChanged = () => {
                for (const elm of this.vStackScreens.children) {
                    elm.classList.remove(index_css_13.rowItemActiveStyled);
                }
                pnl.classList.add(index_css_13.rowItemActiveStyled);
                this.onScreenChanged(this.listScreen.find(screen => screen.id === id));
            };
            const hStackActions = new components_19.HStack(undefined, {
                gap: 8,
                position: 'relative',
                verticalAlignment: 'center',
                opacity: 0.8,
                margin: { left: 4 }
            });
            hStackActions.appendChild(this.$render("i-icon", { name: "ellipsis-h", width: 14, height: 14, opacity: 0, cursor: "pointer", onClick: onShowActions }));
            hStackActions.appendChild(this.$render("i-icon", { name: "eye", width: 14, height: 14, opacity: 0, cursor: "pointer", onClick: (icon) => this.onHideScreen(icon, id) }));
            const pnl = new components_19.Panel();
            pnl.id = `screen-${id}`;
            pnl.onClick = () => onScreenChanged();
            pnl.appendChild(this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", padding: { top: 4, bottom: 4, left: 8, right: 8 }, class: `${index_css_13.hoverFullOpacity} ${index_css_13.rowItemHoverStyled}`, onDblClick: onEditName },
                lb,
                input,
                hStackActions));
            this.vStackScreens.appendChild(pnl);
            this.lbScreens.caption = `Screens (${this.listScreen.filter(v => !v.isDeleted).length})`;
        }
        onShowActions(top, left) {
            const mdWrapper = this.mdActions.querySelector('.modal-wrapper');
            mdWrapper.style.top = `${top}px`;
            mdWrapper.style.left = `${left}px`;
            this.mdActions.visible = true;
        }
        async initModalActions() {
            this.mdActions = await components_19.Modal.create({
                visible: false,
                showBackdrop: false,
                minWidth: '7rem',
                height: 'auto',
                popupPlacement: 'bottomRight'
            });
            const itemActions = new components_19.VStack(undefined, { gap: 8, border: { radius: 8 } });
            itemActions.appendChild(this.$render("i-button", { background: { color: 'transparent' }, boxShadow: "none", icon: { name: 'copy', width: 12, height: 12 }, caption: "Duplicate", class: index_css_13.iconButtonStyled, onClick: () => this.onDuplicateScreen(this.selectedId) }));
            itemActions.appendChild(this.$render("i-button", { background: { color: 'transparent' }, boxShadow: "none", icon: { name: 'trash', width: 12, height: 12 }, caption: "Delete", class: index_css_13.iconButtonStyled, onClick: () => this.onShowModalDelete(this.selectedId) }));
            this.mdActions.item = itemActions;
            document.body.appendChild(this.mdActions);
        }
        onShowDeletedScreens(value) {
            this.wrapperScreens.visible = !value;
            this.wrapperDeletedScreens.visible = value;
            this.onScreenHistoryShown(value);
        }
        init() {
            super.init();
            this.initModalActions();
            this.onScreenChanged = this.getAttribute('onScreenChanged', true) || this.onScreenChanged;
            this.onScreenHistoryShown = this.getAttribute('onScreenHistoryShown', true) || this.onScreenHistoryShown;
            this.onAddScreen('Blank');
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", maxWidth: Theme.layout.container.maxWidth, margin: { left: "auto", right: "auto" }, position: "relative", background: { color: Theme.background.main } },
                this.$render("i-vstack", { id: "wrapperScreens", height: "100%" },
                    this.$render("i-hstack", { gap: 8, verticalAlignment: "center", horizontalAlignment: "space-between", padding: { top: 4, bottom: 4, left: 8 }, background: { color: '#26324b' } },
                        this.$render("i-hstack", { gap: 8, verticalAlignment: "center", wrap: "wrap" },
                            this.$render("i-label", { id: "lbScreens", caption: "Screens (1)", font: { bold: true, size: '0.75rem' } }),
                            this.$render("i-label", { caption: "Last Updated", font: { bold: true, size: '0.75rem' }, opacity: 0.8 })),
                        this.$render("i-hstack", { verticalAlignment: "center", margin: { left: 'auto' } },
                            this.$render("i-icon", { name: "history", class: index_css_13.hoverFullOpacity, opacity: 0.8, cursor: "pointer", width: 28, height: 24, padding: { top: 4, bottom: 4, left: 6, right: 6 }, border: {
                                    left: { style: 'solid', color: Theme.divider, width: 1 },
                                    right: { style: 'solid', color: Theme.divider, width: 1 }
                                }, tooltip: {
                                    content: 'View Deleted Screens'
                                }, onClick: () => this.onShowDeletedScreens(true) }),
                            this.$render("i-icon", { name: "plus-circle", class: index_css_13.hoverFullOpacity, opacity: 0.8, cursor: "pointer", width: 28, height: 24, padding: { top: 4, bottom: 4, left: 6, right: 6 }, tooltip: {
                                    content: 'Add Screen'
                                }, onClick: () => this.onAddScreen('Blank') }))),
                    this.$render("i-vstack", { id: "vStackScreens", gap: 2, overflow: "auto", maxHeight: "calc(100% - 32px)" })),
                this.$render("i-vstack", { id: "wrapperDeletedScreens", visible: false },
                    this.$render("i-hstack", { gap: 8, verticalAlignment: "center", horizontalAlignment: "space-between", padding: { top: 4, bottom: 4, left: 8 }, background: { color: '#26324b' } },
                        this.$render("i-label", { id: "lbDeletedScreens", caption: "Deleted Screens (0)", font: { bold: true, size: '0.75rem' } }),
                        this.$render("i-icon", { name: "history", margin: { left: 'auto' }, class: index_css_13.hoverFullOpacity, opacity: 0.8, cursor: "pointer", width: 28, height: 24, padding: { top: 4, bottom: 4, left: 6, right: 6 }, border: {
                                left: { style: 'solid', color: Theme.divider, width: 1 },
                            }, tooltip: {
                                content: 'View Live Screens'
                            }, onClick: () => this.onShowDeletedScreens(false) })),
                    this.$render("i-vstack", { id: "vStackDeletedScreens", gap: 2, overflow: "auto" })),
                this.$render("i-alert", { id: "mdAlert" })));
        }
    };
    DesignerScreens = __decorate([
        (0, components_19.customElements)('designer-screens')
    ], DesignerScreens);
    exports.default = DesignerScreens;
});
define("@scom/scom-designer/components/pickerBlocks.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/index.css.ts"], function (require, exports, components_20, index_css_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_20.Styles.Theme.ThemeVars;
    let DesignerPickerBlocks = class DesignerPickerBlocks extends components_20.Module {
        constructor(parent, options) {
            super(parent, options);
            this.isShown = true;
        }
        onDeleteCustomBlock(id) {
            // TODO
        }
        renderUI() {
            this.iconArrow.name = 'angle-down';
            const nodeItems = [];
            for (const item of this.items) {
                const { id, caption, image, path } = item;
                const block = new components_20.Panel(undefined, { width: '100%', height: 'auto', background: { color: Theme.background.main }, padding: { top: 6, bottom: 6, left: 8, right: 8 } });
                block.appendChild(this.$render("i-hstack", { gap: 8, width: "100%", height: "100%", verticalAlignment: "center", horizontalAlignment: "space-between" },
                    this.$render("i-hstack", { gap: 8, verticalAlignment: "center", wrap: "wrap" },
                        this.$render("i-image", { url: image, width: 24, height: 24 }),
                        this.$render("i-label", { caption: caption, font: { size: '0.75rem' } })),
                    this.$render("i-icon", { name: "trash", width: 16, height: 16, cursor: "pointer", tooltip: { content: 'Delete Custom Block' }, onClick: () => this.onDeleteCustomBlock(id) })));
                block.classList.add(index_css_14.blockItemHoverStyled);
                nodeItems.push(block);
            }
            this.vStackItems.clearInnerHTML();
            this.vStackItems.append(...nodeItems);
        }
        onCollapse() {
            this.isShown = !this.isShown;
            this.vStackItems.visible = this.isShown;
            this.iconArrow.name = this.isShown ? 'angle-down' : 'angle-right';
        }
        init() {
            super.init();
            this.items = this.getAttribute('items', true) || [];
            this.renderUI();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", margin: { left: "auto", right: "auto" }, position: "relative", background: { color: '#26324b' } },
                this.$render("i-hstack", { gap: 8, verticalAlignment: "center", cursor: "pointer", padding: { left: 8, right: 8, bottom: 8, top: 8 }, onClick: this.onCollapse },
                    this.$render("i-icon", { id: "iconArrow", name: "angle-down", width: 14, height: 14 }),
                    this.$render("i-label", { caption: "Your Blocks", font: { size: '0.75rem', bold: true } }),
                    this.$render("i-icon", { name: "question-circle", width: 14, height: 14, opacity: 0.8, tooltip: { content: 'Your own custom components' } })),
                this.$render("i-vstack", { id: "vStackItems", gap: 4, width: "100%" })));
        }
    };
    DesignerPickerBlocks = __decorate([
        (0, components_20.customElements)('designer-picker-blocks')
    ], DesignerPickerBlocks);
    exports.default = DesignerPickerBlocks;
});
define("@scom/scom-designer/components/pickerComponents.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-designer/index.css.ts"], function (require, exports, components_21, index_css_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_21.Styles.Theme.ThemeVars;
    let DesignerPickerComponents = class DesignerPickerComponents extends components_21.Module {
        constructor(parent, options) {
            super(parent, options);
            this.isShown = true;
        }
        renderUI() {
            this.lbName.caption = this.name;
            this.iconArrow.name = 'angle-down';
            this.iconTooltip.visible = !!this.tooltipText;
            this.iconTooltip.tooltip.content = this.tooltipText || '';
            const nodeItems = [];
            for (const item of this.items) {
                const { caption, path, image, category } = item;
                const block = new components_21.Panel(undefined, { width: 'calc(50% - 0.5px)', height: 80, background: { color: Theme.background.main } });
                block.appendChild(this.$render("i-vstack", { gap: 8, width: "100%", height: "100%", verticalAlignment: "center", horizontalAlignment: "center" },
                    this.$render("i-image", { url: image, width: 32, height: 32 }),
                    this.$render("i-label", { caption: caption, font: { size: '0.75rem' } })));
                block.classList.add(index_css_15.blockItemHoverStyled);
                nodeItems.push(block);
            }
            if (this.items.length % 2 === 1) {
                nodeItems.push(this.$render("i-panel", { width: "calc(50% - 0.5px)", height: 80, background: { color: Theme.background.main } }));
            }
            this.hStackItems.clearInnerHTML();
            this.hStackItems.append(...nodeItems);
        }
        onCollapse() {
            this.isShown = !this.isShown;
            this.hStackItems.visible = this.isShown;
            this.iconArrow.name = this.isShown ? 'angle-down' : 'angle-right';
        }
        init() {
            super.init();
            this.name = this.getAttribute('name', true) || '';
            this.tooltipText = this.getAttribute('tooltipText', true);
            this.items = this.getAttribute('items', true) || [];
            this.renderUI();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", margin: { left: "auto", right: "auto" }, position: "relative", background: { color: '#26324b' } },
                this.$render("i-hstack", { gap: 8, verticalAlignment: "center", cursor: "pointer", padding: { left: 8, right: 8, bottom: 8, top: 8 }, onClick: this.onCollapse },
                    this.$render("i-icon", { id: "iconArrow", name: "angle-down", width: 14, height: 14 }),
                    this.$render("i-label", { id: "lbName", font: { size: '0.75rem', bold: true } }),
                    this.$render("i-icon", { id: "iconTooltip", name: "question-circle", width: 14, height: 14, opacity: 0.8 })),
                this.$render("i-hstack", { id: "hStackItems", gap: 1, width: "100%", verticalAlignment: "center", wrap: "wrap" })));
        }
    };
    DesignerPickerComponents = __decorate([
        (0, components_21.customElements)('designer-picker-components')
    ], DesignerPickerComponents);
    exports.default = DesignerPickerComponents;
});
define("@scom/scom-designer/components/index.ts", ["require", "exports", "@scom/scom-designer/components/components.tsx", "@scom/scom-designer/components/properties.tsx", "@scom/scom-designer/components/screens.tsx", "@scom/scom-designer/components/pickerBlocks.tsx", "@scom/scom-designer/components/pickerComponents.tsx"], function (require, exports, components_22, properties_1, screens_1, pickerBlocks_1, pickerComponents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DesignerPickerComponents = exports.DesignerPickerBlocks = exports.DesignerScreens = exports.DesignerProperties = exports.DesignerComponents = void 0;
    exports.DesignerComponents = components_22.default;
    exports.DesignerProperties = properties_1.default;
    exports.DesignerScreens = screens_1.default;
    exports.DesignerPickerBlocks = pickerBlocks_1.default;
    exports.DesignerPickerComponents = pickerComponents_1.default;
});
define("@scom/scom-designer/data.ts", ["require", "exports", "@scom/scom-designer/assets.ts"], function (require, exports, assets_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.screen = exports.blockComponents = exports.pickerComponents = exports.recentComponents = void 0;
    // TODO - This array should be dynamic data
    exports.recentComponents = [
        {
            name: 'Frequently Used',
            tooltipText: 'Components that you use most frequently',
            items: [
                {
                    path: '',
                    caption: 'Text',
                    image: assets_4.default.fullPath('img/designer/Text.svg')
                },
                {
                    path: '',
                    caption: 'View',
                    image: assets_4.default.fullPath('img/designer/View.svg')
                }
            ]
        },
        {
            name: 'Recently Used',
            tooltipText: 'Components that you used recently',
            items: [
                {
                    path: '',
                    caption: 'Button',
                    image: assets_4.default.fullPath('img/designer/Button.svg')
                }
            ]
        }
    ];
    exports.pickerComponents = [
        {
            name: 'Basic',
            tooltipText: 'The most simple & essential components to build a screen',
            items: [
                {
                    path: '',
                    caption: 'Icon',
                    image: assets_4.default.fullPath('img/designer/Icon.svg')
                },
                {
                    path: '',
                    caption: 'Text',
                    image: assets_4.default.fullPath('img/designer/Text.svg')
                },
                {
                    path: '',
                    caption: 'View',
                    image: assets_4.default.fullPath('img/designer/View.svg')
                }
            ]
        },
        {
            name: 'Buttons',
            tooltipText: 'Components that allow users to complete actions on click',
            items: [
                {
                    path: '',
                    caption: 'Button',
                    image: assets_4.default.fullPath('img/designer/Button.svg')
                },
                {
                    path: '',
                    caption: 'Link',
                    image: assets_4.default.fullPath('img/designer/Link.svg')
                }
            ]
        }
    ];
    // TODO - This array should be dynamic data
    exports.blockComponents = [
        {
            id: '1',
            path: '',
            caption: 'My Block 1',
            image: assets_4.default.fullPath('img/designer/Block.svg')
        },
        {
            id: '2',
            path: '',
            caption: 'My Block 2',
            image: assets_4.default.fullPath('img/designer/Block.svg')
        }
    ];
    exports.screen = {
        id: '1',
        name: 'First Screen',
        elements: [
            {
                path: '',
                caption: 'View',
                image: assets_4.default.fullPath('img/designer/View.svg'),
                children: [
                    {
                        path: '',
                        caption: 'Text',
                        image: assets_4.default.fullPath('img/designer/Text.svg')
                    },
                    {
                        path: '',
                        caption: 'Button',
                        image: assets_4.default.fullPath('img/designer/Button.svg')
                    },
                    {
                        path: '',
                        caption: 'View',
                        image: assets_4.default.fullPath('img/designer/View.svg'),
                        children: [
                            {
                                path: '',
                                caption: 'Text',
                                image: assets_4.default.fullPath('img/designer/Text.svg')
                            },
                            {
                                path: '',
                                caption: 'Text 2',
                                image: assets_4.default.fullPath('img/designer/Text.svg')
                            }
                        ]
                    }
                ]
            }
        ]
    };
});
define("@scom/scom-designer", ["require", "exports", "@ijstech/components", "@scom/scom-designer/components/index.ts", "@scom/scom-designer/index.css.ts", "@scom/scom-designer/data.ts", "@scom/scom-designer/tools/index.ts"], function (require, exports, components_23, index_3, index_css_16, data_1, index_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomDesigner = void 0;
    const Theme = components_23.Styles.Theme.ThemeVars;
    var TABS;
    (function (TABS) {
        TABS[TABS["RECENT"] = 0] = "RECENT";
        TABS[TABS["BITS"] = 1] = "BITS";
        TABS[TABS["BLOCKS"] = 2] = "BLOCKS";
    })(TABS || (TABS = {}));
    let ScomDesigner = class ScomDesigner extends components_23.Module {
        constructor(parent, options) {
            super(parent, options);
            this.currentTab = TABS.BITS;
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get pickerComponentsFiltered() {
            let components;
            if (this.currentTab === TABS.RECENT) {
                components = data_1.recentComponents;
            }
            else {
                components = data_1.pickerComponents;
            }
            if (this.inputSearch.value) {
                const val = this.inputSearch.value.toLowerCase();
                components = components
                    .map((component) => {
                    const filteredItems = component.items.filter((item) => item.caption.toLowerCase().includes(val));
                    return {
                        ...component,
                        items: filteredItems,
                    };
                })
                    .filter((component) => component.items.length > 0);
            }
            return components;
        }
        get pickerBlocksFiltered() {
            if (this.inputSearch.value) {
                return data_1.blockComponents.filter((v) => v.caption.toLowerCase().includes(this.inputSearch.value.toLowerCase()));
            }
            return data_1.blockComponents;
        }
        onScreenChanged(screen) { }
        onScreenHistoryShown(shown) {
            this.designerComponents.visible = !shown;
            this.designerScreens.height = shown ? '100%' : '40%';
        }
        onTabChanged(value) {
            if (this.currentTab === value)
                return;
            for (let i = 0; i < this.wrapperTab.children.length; i++) {
                if (value === i) {
                    this.wrapperTab.children[i].classList.add(index_css_16.labelActiveStyled);
                }
                else {
                    this.wrapperTab.children[i].classList.remove(index_css_16.labelActiveStyled);
                }
            }
            this.currentTab = value;
            const isBlock = value === TABS.BLOCKS;
            if (isBlock) {
                this.initBlockPicker();
            }
            else {
                this.initComponentPicker();
            }
            this.pnlComponentPicker.visible = !isBlock;
            this.pnlBlockPicker.visible = isBlock;
        }
        onFilterComponent() {
            if (this.currentTab === TABS.BLOCKS) {
                this.initBlockPicker();
            }
            else {
                this.initComponentPicker();
            }
        }
        onShowComponentPicker() {
            this.wrapperComponentPicker.visible = true;
        }
        onCloseComponentPicker() {
            this.wrapperComponentPicker.visible = false;
        }
        initComponentPicker() {
            const nodeItems = [];
            for (const picker of this.pickerComponentsFiltered) {
                const pickerElm = new index_3.DesignerPickerComponents(undefined, {
                    ...picker,
                    display: 'block',
                    margin: { bottom: 1 },
                });
                nodeItems.push(pickerElm);
            }
            this.pnlComponentPicker.clearInnerHTML();
            this.pnlComponentPicker.append(...nodeItems);
        }
        initBlockPicker() {
            const pickerElm = new index_3.DesignerPickerBlocks(undefined, {
                items: this.pickerBlocksFiltered,
            });
            this.pnlBlockPicker.clearInnerHTML();
            this.pnlBlockPicker.append(pickerElm);
        }
        initComponentScreen() {
            this.designerComponents.screen = data_1.screen;
        }
        initDesignerProperties() {
            this.designerProperties.component = {
                path: '',
                caption: 'First Screen',
                iconName: 'mobile-alt',
                category: 'Screen',
            };
        }
        renderUI() {
            this.initComponentPicker();
            this.initBlockPicker();
            this.initComponentScreen();
            this.initDesignerProperties();
        }
        init() {
            super.init();
            this.wrapperComponentPicker.style.borderBottom = 'none';
            this.renderUI();
        }
        async openFile(file, endpoint, parentCid, parent) {
            parent.append(this);
            const path = file.path.startsWith('/') ? file.path.slice(1) : file.path;
            const mediaUrl = `${endpoint}/ipfs/${parentCid}/${path}`;
            console.log('Open: ', mediaUrl);
            // TODO: fetch data
        }
        render() {
            return (this.$render("i-vstack", { width: '100%', height: '100%', maxWidth: Theme.layout.container.maxWidth, margin: { left: 'auto', right: 'auto' }, position: 'relative' },
                this.$render("i-hstack", { width: '100%', height: '100%' },
                    this.$render("i-vstack", { width: '100%', height: '100%', border: {
                            top: { width: 1, style: 'solid', color: Theme.divider },
                        }, maxWidth: 300 },
                        this.$render("designer-screens", { id: 'designerScreens', height: '40%', minHeight: 160, onScreenChanged: this.onScreenChanged, onScreenHistoryShown: this.onScreenHistoryShown }),
                        this.$render("designer-components", { id: 'designerComponents', height: '60%', minHeight: 200, onShowComponentPicker: this.onShowComponentPicker })),
                    this.$render("i-vstack", { id: 'wrapperComponentPicker', visible: false, width: 250, height: '100%', border: {
                            width: 1,
                            style: 'solid',
                            color: Theme.divider,
                            bottom: { width: 0 },
                        }, background: { color: Theme.background.main }, overflow: 'auto' },
                        this.$render("i-vstack", { gap: 12, padding: { top: 12, bottom: 12, left: 8, right: 8 }, border: {
                                bottom: { width: 1, style: 'solid', color: Theme.divider },
                            } },
                            this.$render("i-hstack", { gap: 8, verticalAlignment: 'center', horizontalAlignment: 'space-between' },
                                this.$render("i-label", { caption: 'Add Components', font: { size: '0.75rem', bold: true } }),
                                this.$render("i-icon", { name: 'times', width: 14, height: 14, cursor: 'pointer', onClick: this.onCloseComponentPicker })),
                            this.$render("i-grid-layout", { id: 'wrapperTab', width: '100%', background: { color: Theme.action.hoverBackground }, templateColumns: ['1fr', '1fr', '1fr'], class: `${index_4.borderRadiusLeft} ${index_4.borderRadiusRight}` },
                                this.$render("i-label", { caption: 'Recent', class: `${index_css_16.customLabelTabStyled} ${index_4.borderRadiusLeft}`, onClick: () => this.onTabChanged(TABS.RECENT) }),
                                this.$render("i-label", { caption: 'Bits', class: `${index_css_16.customLabelTabStyled} ${index_css_16.labelActiveStyled}`, border: {
                                        radius: 0,
                                        left: { width: 1, style: 'solid', color: Theme.divider },
                                        right: { width: 1, style: 'solid', color: Theme.divider },
                                    }, onClick: () => this.onTabChanged(TABS.BITS) }),
                                this.$render("i-label", { caption: 'Blocks', class: `${index_css_16.customLabelTabStyled} ${index_4.borderRadiusRight}`, onClick: () => this.onTabChanged(TABS.BLOCKS) })),
                            this.$render("i-input", { id: 'inputSearch', placeholder: 'Search', width: '100%', height: 24, border: {
                                    radius: 8,
                                    width: 0,
                                }, padding: { left: 4, right: 4 }, font: { size: '0.75rem' }, onChanged: this.onFilterComponent })),
                        this.$render("i-panel", { id: 'pnlComponentPicker', width: '100%' }),
                        this.$render("i-panel", { id: 'pnlBlockPicker', width: '100%', visible: false })),
                    this.$render("designer-properties", { id: 'designerProperties', margin: { left: 'auto' }, display: 'flex' }))));
        }
    };
    ScomDesigner = __decorate([
        (0, components_23.customElements)('i-scom-designer')
    ], ScomDesigner);
    exports.ScomDesigner = ScomDesigner;
});

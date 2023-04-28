import { ItemType, JsonValue, ResponsiveMode, Side, SizeUnitEnum } from '../utils/types';
import { ResolvedComponentItemConfig, ResolvedHeaderedItemConfig, ResolvedItemConfig, ResolvedLayoutConfig, ResolvedPopoutLayoutConfig, ResolvedRootItemConfig, ResolvedRowOrColumnItemConfig, ResolvedStackItemConfig } from "./resolved-config";
/** @public */
export interface ItemConfig {
    /**
     * The type of the item. Possible values are 'row', 'column', 'stack', 'component'.
     */
    type: ItemType;
    /**
     * An array of configurations for items that will be created as children of this item.
     */
    content?: ItemConfig[];
    /**
     * The width of this item, relative to the other children of its parent in percent
     * @deprecated use {@link (ItemConfig:interface).size} instead
     */
    width?: number;
    /**
     * The minimum width of this item in pixels
     * CAUTION - Not tested - do not use
     * @deprecated use {@link (ItemConfig:interface).minSize} instead
     */
    minWidth?: number;
    /**
     * The height of this item, relative to the other children of its parent in percent
     * @deprecated use {@link (ItemConfig:interface).size} instead
     */
    height?: number;
    /**
     * The minimum height of this item in pixels
     * CAUTION - Not tested - do not use
     * @deprecated use {@link (ItemConfig:interface).minSize} instead
     */
    minHeight?: number;
    /**
     * The size of this item.
     * For rows, it specifies height. For columns, it specifies width.
     * Has format \<number\>\<{@link SizeUnit}\>. Currently only supports units `fr` and `%`.
     *
     * Space is first proportionally allocated to items with sizeUnit `%`.
     * If there is any space left over (less than 100% allocated), then the
     * remainder is allocated to the items with unit `fr` according to the fractional size.
     * If more than 100% is allocated, then an extra 50% is allocated to items with unit `fr` and
     * is allocated to each item according to its fractional size. All item sizes are then adjusted
     * to bring the total back to 100%
     */
    size?: string;
    /**
     * The size of this item.
     * For rows, it specifies height. For columns, it specifies width.
     * Has format <number><sizeUnit>. Currently only supports units `px`
     */
    minSize?: string;
    /**
     * A string that can be used to identify a ContentItem.
     * Do NOT assign an array.  This only exists for legacy purposes.  If an array is assigned, the first element
     * will become the id.
     */
    id?: string;
    /**
     * Determines if the item is closable. If false, the x on the items tab will be hidden and container.close()
     * will return false
     * Default: true
     */
    isClosable?: boolean;
    /**
     * The title of the item as displayed on its tab and on popout windows
     * Default: componentType.toString() or ''
     * @deprecated only Component has a title
     */
    title?: string;
}
/** @public */
export declare namespace ItemConfig {
    /** @internal */
    const enum SizeWidthHeightSpecificationType {
        None = 0,
        Size = 1,
        WidthOrHeight = 2
    }
    /** @internal */
    function resolve(itemConfig: ItemConfig, rowAndColumnChildLegacySizeDefault: boolean): ResolvedItemConfig;
    /** @internal */
    function resolveContent(content: ItemConfig[] | undefined): ResolvedItemConfig[];
    /** @internal */
    function resolveId(id: string | string[] | undefined): string;
    /** @internal */
    function resolveSize(size: string | undefined, width: number | undefined, height: number | undefined, rowAndColumnChildLegacySizeDefault: boolean): SizeWithUnit;
    /** @internal */
    function resolveMinSize(minSize: string | undefined, minWidth: number | undefined, minHeight: number | undefined): UndefinableSizeWithUnit;
    /** @internal */
    function calculateSizeWidthHeightSpecificationType(config: ItemConfig): SizeWidthHeightSpecificationType;
    function isGround(config: ItemConfig): config is ItemConfig;
    function isRow(config: ItemConfig): config is ItemConfig;
    function isColumn(config: ItemConfig): config is ItemConfig;
    function isStack(config: ItemConfig): config is ItemConfig;
    function isComponent(config: ItemConfig): config is ComponentItemConfig;
}
/** @public */
export interface HeaderedItemConfig extends ItemConfig {
    /** @deprecated use {@link (HeaderedItemConfig:namespace).(Header:interface).show} instead */
    hasHeaders?: boolean;
    header?: HeaderedItemConfig.Header;
    maximised?: boolean;
}
/** @public */
export declare namespace HeaderedItemConfig {
    interface Header {
        show?: false | Side;
        popout?: false | string;
        dock?: false | string;
        maximise?: false | string;
        close?: string;
        minimise?: string;
        tabDropdown?: false | string;
    }
    namespace Header {
        function resolve(header: Header | undefined, hasHeaders: boolean | undefined): ResolvedHeaderedItemConfig.Header | undefined;
    }
    /** @internal */
    function resolveIdAndMaximised(config: HeaderedItemConfig): {
        id: string;
        maximised: boolean;
    };
}
/** @public */
export interface StackItemConfig extends HeaderedItemConfig {
    type: 'stack';
    content: ComponentItemConfig[];
    /** The index of the item in content which is to be active*/
    activeItemIndex?: number;
}
/** @public */
export declare namespace StackItemConfig {
    /** @internal */
    function resolve(itemConfig: StackItemConfig, rowAndColumnChildLegacySizeDefault: boolean): ResolvedStackItemConfig;
    /** @internal */
    function fromResolved(resolvedConfig: ResolvedStackItemConfig): StackItemConfig;
}
/** @public */
export interface ComponentItemConfig extends HeaderedItemConfig {
    type: 'component';
    readonly content?: [];
    /**
     * The title of the item as displayed on its tab and on popout windows
     * Default: componentType.toString() or ''
     */
    title?: string;
    /**
     * The type of the component.
     * @deprecated use {@link (ComponentItemConfig:interface).componentType} instead
     */
    componentName?: string;
    /**
     * The type of the component.
     * `componentType` must be of type `string` if it is registered with any of the following functions:
     * * {@link (GoldenLayout:class).registerComponent}
     */
    componentType: JsonValue;
    /**
     * The state information with which a component will be initialised with.
     * Will be passed to the component constructor function and will be the value returned by
     * container.initialState.
     */
    componentState?: JsonValue;
    /**
     * Default: true
     */
    reorderEnabled?: boolean;
}
/** @public */
export declare namespace ComponentItemConfig {
    /** @internal */
    function resolve(itemConfig: ComponentItemConfig, rowAndColumnChildLegacySizeDefault: boolean): ResolvedComponentItemConfig;
    /** @internal */
    function fromResolved(resolvedConfig: ResolvedComponentItemConfig): ComponentItemConfig;
    function componentTypeToTitle(componentType: JsonValue): string;
}
/** @public */
export interface RowOrColumnItemConfig extends ItemConfig {
    type: 'row' | 'column';
    content: (RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig)[];
}
/** @public */
export declare namespace RowOrColumnItemConfig {
    type ChildItemConfig = RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig;
    function isChildItemConfig(itemConfig: ItemConfig): itemConfig is ChildItemConfig;
    /** @internal */
    function resolve(itemConfig: RowOrColumnItemConfig, rowAndColumnChildLegacySizeDefault: boolean): ResolvedRowOrColumnItemConfig;
    /** @internal */
    function fromResolved(resolvedConfig: ResolvedRowOrColumnItemConfig): RowOrColumnItemConfig;
    /** @internal */
    function resolveContent(content: ChildItemConfig[] | undefined): ResolvedRowOrColumnItemConfig.ChildItemConfig[];
}
/** @public */
export type RootItemConfig = RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig;
/** @public */
export declare namespace RootItemConfig {
    function isRootItemConfig(itemConfig: ItemConfig): itemConfig is RootItemConfig;
    /** @internal */
    function resolve(itemConfig: RootItemConfig | undefined): ResolvedRootItemConfig | undefined;
    /** @internal */
    function fromResolvedOrUndefined(resolvedItemConfig: ResolvedRootItemConfig | undefined): RootItemConfig | undefined;
}
/** @public */
export interface LayoutConfig {
    root: RootItemConfig | undefined;
    /** @deprecated Use {@link (LayoutConfig:interface).root} */
    content?: (RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig)[];
    openPopouts?: PopoutLayoutConfig[];
    dimensions?: LayoutConfig.Dimensions;
    settings?: LayoutConfig.Settings;
    /** @deprecated use {@link (LayoutConfig:interface).header} instead */
    labels?: LayoutConfig.Labels;
    header?: LayoutConfig.Header;
}
/** Use to specify LayoutConfig with defaults or deserialise a LayoutConfig.
 * Deserialisation will handle backwards compatibility.
 * Note that LayoutConfig should be used for serialisation (not LayoutConfig)
 * @public
 */
export declare namespace LayoutConfig {
    interface Settings {
        /**
         * @deprecated use ${@link (LayoutConfig:namespace).(Header:interface).show} instead
         */
        hasHeaders?: boolean;
        /**
         * Constrains the area in which items can be dragged to the layout's container. Will be set to false
         * automatically when layout.createDragSource() is called.
         * Default: true
         */
        constrainDragToContainer?: boolean;
        /**
         * If true, the user can re-arrange the layout by dragging items by their tabs to the desired location.
         * Can be overridden by ItemConfig.reorderEnabled for specific ItemConfigs
         * Default: true
         */
        reorderEnabled?: boolean;
        /**
         * Decides what will be opened in a new window if the user clicks the popout icon. If true the entire stack will
         * be transferred to the new window, if false only the active component will be opened.
         * Default: false
         */
        popoutWholeStack?: boolean;
        /**
         * Specifies if an error is thrown when a popout is blocked by the browser (e.g. by opening it programmatically).
         * If false, the popout call will fail silently.
         * Default: true
         */
        blockedPopoutsThrowError?: boolean;
        /**
         * Specifies if all popouts should be closed when the page that created them is closed. Popouts don't have a
         * strong dependency on their parent and can exist on their own, but can be quite annoying to close by hand. In
         * addition, any changes made to popouts won't be stored after the parent is closed.
         * Default: true
         * @deprecated Will be removed in version 3.
         */
        closePopoutsOnUnload?: boolean;
        /**
         * Specifies if the popout icon should be displayed in the header-bar.
         * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).popout} instead
         */
        showPopoutIcon?: boolean;
        /**
         * Specifies if the maximise icon should be displayed in the header-bar.
         * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).maximise} instead
         */
        showMaximiseIcon?: boolean;
        /**
         * Specifies if the close icon should be displayed in the header-bar.
         * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).close} instead
         */
        showCloseIcon?: boolean;
        /**
         * Specifies Responsive Mode (more info needed).
         * Default: none
         */
        responsiveMode?: ResponsiveMode;
        /**
         * Specifies Maximum pixel overlap per tab.
         * Default: 0
         */
        tabOverlapAllowance?: number;
        /**
         *
         * Default: true
         */
        reorderOnTabMenuClick?: boolean;
        /**
         * Default: 10
         */
        tabControlOffset?: number;
        /**
         * Specifies whether to pop in elements when closing a popout window.
         * Default: false
         */
        popInOnClose?: boolean;
        useDragAndDrop?: boolean;
        /**
         * Use component's element for setDragImage, if possible.
         * Has side-effect of nesting content element inside a component.
         * Ignored unless useDragAndDrop.
         */
        copyForDragImage?: boolean;
        /**
         * When dragging an item, indicate the original position.
         * The default style uses a dashed light-brown outline.
         * Default: true
         */
        showOldPositionWhenDragging?: boolean;
        dragDataMimetype?: string;
        /**
         * Check whether location.search contains a gl-window parameter.
         * This is used to handle window popin in simple cases.
         * Default: true
         */
        checkGlWindowKey?: boolean;
    }
    namespace Settings {
        function resolve(settings: Settings | undefined): ResolvedLayoutConfig.Settings;
    }
    interface Dimensions {
        /**
         * The width of the borders between the layout items in pixel. Please note: The actual draggable area is wider
         * than the visible one, making it safe to set this to small values without affecting usability.
         * Default: 5
         */
        borderWidth?: number;
        /**
         * Default: 5
         */
        borderGrabWidth?: number;
        /**
         * Space to allocate between component wrapper and content element.
         * This can be used for an 'outline'.
         * This may affect drag from other window over iframe which may
         * not trigger depending on the CSS pointer-events setting.
         * (Uncertain: needs testing/experimentation.)
         * Default: 0
         */
        contentInset?: number;
        /**
         * The minimum height an item can be resized to (in pixel).
         * @deprecated use {@link (LayoutConfig:namespace).(Dimensions:interface).defaultMinItemHeight} instead
         */
        minItemHeight?: number;
        /**
         * The minimum height an item can be resized to.
         * Default: 0
         */
        defaultMinItemHeight?: string;
        /**
         * The minimum width an item can be resized to (in pixel).
         * @deprecated use {@link (LayoutConfig:namespace).(Dimensions:interface).defaultMinItemWidth} instead
         */
        minItemWidth?: number;
        /**
         * The minimum width an item can be resized to.
         * Default: 10px
         */
        defaultMinItemWidth?: string;
        /**
         * The height of the header elements in pixel. This can be changed, but your theme's header css needs to be
         * adjusted accordingly.
         * Default: 20
         */
        headerHeight?: number;
        /**
         * The width of the element that appears when an item is dragged (in pixel).
         * Default: 300
         */
        dragProxyWidth?: number;
        /**
         * The height of the element that appears when an item is dragged (in pixel).
         * Default: 200
         */
        dragProxyHeight?: number;
    }
    namespace Dimensions {
        /** @internal */
        function resolve(dimensions: Dimensions | undefined): ResolvedLayoutConfig.Dimensions;
        /** @internal */
        function fromResolved(resolvedDimensions: ResolvedLayoutConfig.Dimensions): Dimensions;
        /** @internal */
        function resolveDefaultMinItemHeight(dimensions: Dimensions | undefined): SizeWithUnit;
        /** @internal */
        function resolveDefaultMinItemWidth(dimensions: Dimensions | undefined): SizeWithUnit;
    }
    interface Labels {
        /**
         * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).close} instead
         */
        close?: string;
        /**
         * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).maximise} instead
         */
        maximise?: string;
        /**
         * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).minimise} instead
         */
        minimise?: string;
        /**
         * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).popin} instead
         */
        popin?: string;
        /**
         * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).popout} instead
         */
        popout?: string;
        /**
         * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).tabDropdown} instead
         */
        tabDropdown?: string;
    }
    interface Header {
        /**
         * Specifies whether header should be displayed, and if so, on which side.
         * If false, the layout will be displayed with splitters only.
         * Default: 'top'
         */
        show?: false | Side;
        /**
         * The tooltip text that appears when hovering over the popout icon or false if popout button not displayed.
         * Default: 'open in new window'
         */
        popout?: false | string;
        /**
         * The tooltip text that appears when hovering over the popin icon.
         * Default: 'pop in'
         */
        popin?: string;
        /**
         * The tooltip text that appears when hovering over the maximise icon or false if maximised button not displayed.
         * Default: 'maximise'
         */
        maximise?: false | string;
        /**
         * The tooltip text that appears when hovering over the close icon.
         * Default: 'close'
         */
        close?: false | string;
        /**
         * The tooltip text that appears when hovering over the minimise icon.
         * Default: 'minimise'
         */
        minimise?: string;
        /**
         *
         * Default: 'additional tabs'
         */
        tabDropdown?: false | string;
    }
    namespace Header {
        /** @internal */
        function resolve(header: Header | undefined, settings: LayoutConfig.Settings | undefined, labels: LayoutConfig.Labels | undefined): ResolvedLayoutConfig.Header;
    }
    function isPopout(config: LayoutConfig): config is PopoutLayoutConfig;
    /** @internal */
    function resolve(layoutConfig: LayoutConfig): ResolvedLayoutConfig;
    function fromResolved(config: ResolvedLayoutConfig): LayoutConfig;
    function isResolved(configOrResolvedConfig: ResolvedLayoutConfig | LayoutConfig): configOrResolvedConfig is ResolvedLayoutConfig;
    /** @internal */
    function resolveOpenPopouts(popoutConfigs: PopoutLayoutConfig[] | undefined): ResolvedPopoutLayoutConfig[];
}
/** @public */
export interface PopoutLayoutConfig extends LayoutConfig {
    /** The id of the element the item will be appended to on popIn
    * If null, append to topmost layout element
    */
    parentId: string | null | undefined;
    /** The position of this element within its parent
    * If null, position is last
    */
    indexInParent: number | null | undefined;
    /** @deprecated use {@link (PopoutLayoutConfig:interface).window} */
    dimensions: PopoutLayoutConfig.Dimensions | undefined;
    window: PopoutLayoutConfig.Window | undefined;
}
/** @public */
export declare namespace PopoutLayoutConfig {
    /** @deprecated use {@link (PopoutLayoutConfig:namespace).(Window:interface)} */
    interface Dimensions extends LayoutConfig.Dimensions {
        /** @deprecated use {@link (PopoutLayoutConfig:namespace).(Window:interface).width} */
        width?: number | null;
        /** @deprecated use {@link (PopoutLayoutConfig:namespace).(Window:interface).height} */
        height?: number | null;
        /** @deprecated use {@link (PopoutLayoutConfig:namespace).(Window:interface).left} */
        left?: number | null;
        /** @deprecated use {@link (PopoutLayoutConfig:namespace).(Window:interface).top} */
        top?: number | null;
    }
    interface Window {
        width?: number;
        height?: number;
        left?: number;
        top?: number;
    }
    namespace Window {
        /** @internal */
        function resolve(window: Window | undefined, dimensions: Dimensions | undefined): ResolvedPopoutLayoutConfig.Window;
        /** @internal */
        function fromResolved(resolvedWindow: ResolvedPopoutLayoutConfig.Window): Window;
    }
    /** @internal */
    function resolve(popoutConfig: PopoutLayoutConfig): ResolvedPopoutLayoutConfig;
    /** @internal */
    function fromResolved(resolvedConfig: ResolvedPopoutLayoutConfig): PopoutLayoutConfig;
    /** @internal */
    function fromResolvedArray(resolvedArray: ResolvedPopoutLayoutConfig[]): PopoutLayoutConfig[];
}
/** @internal */
export interface SizeWithUnit {
    size: number;
    sizeUnit: SizeUnitEnum;
}
/** @internal */
export interface UndefinableSizeWithUnit {
    size: number | undefined;
    sizeUnit: SizeUnitEnum;
}
/** @internal */
export declare function parseSize(sizeString: string, allowableSizeUnits: readonly SizeUnitEnum[]): SizeWithUnit;
/** @internal */
export declare function formatSize(size: number, sizeUnit: SizeUnitEnum): string;
/** @internal */
export declare function formatUndefinableSize(size: number | undefined, sizeUnit: SizeUnitEnum): string | undefined;
/** @public @deprecated - use {@link (LayoutConfig:interface)} */
export type Config = LayoutConfig;
//# sourceMappingURL=config.d.ts.map
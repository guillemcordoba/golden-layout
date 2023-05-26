import { ComponentItemConfig, LayoutConfig, RowOrColumnItemConfig, StackItemConfig } from "./config/config";
import { ResolvedComponentItemConfig, ResolvedItemConfig, ResolvedLayoutConfig, ResolvedPopoutLayoutConfig, ResolvedRootItemConfig } from "./config/resolved-config";
import { ComponentContainer } from "./container/component-container";
import { BrowserPopout } from "./controls/browser-popout";
import { DragSource } from "./controls/drag-source";
import { DropTargetIndicator } from "./controls/drop-target-indicator";
import { ComponentItem } from "./items/component-item";
import { ContentItem } from "./items/content-item";
import { GroundItem } from "./items/ground-item";
import { Stack } from "./items/stack";
import { DragListener } from "./utils/drag-listener";
import { EventEmitter } from "./utils/event-emitter";
import { EventHub } from "./utils/event-hub";
import { JsonValue, WidthAndHeight } from "./utils/types";
/** @internal */
declare global {
    interface Window {
        __glInstance: LayoutManager;
    }
}
/**
 * The main class that will be exposed as GoldenLayout.
 */
/** @public */
export declare abstract class LayoutManager extends EventEmitter {
    /** Whether the layout will be automatically be resized to container whenever the container's size is changed
     * Default is true if <body> is the container otherwise false
     * Default will be changed to true for any container in the future
     */
    resizeWithContainerAutomatically: boolean;
    /** The debounce interval (in milliseconds) used whenever a layout is automatically resized.  0 means next tick */
    resizeDebounceInterval: number;
    /** Extend the current debounce delay time period if it is triggered during the delay.
     * If this is true, the layout will only resize when its container has stopped being resized.
     * If it is false, the layout will resize at intervals while its container is being resized.
     */
    resizeDebounceExtendedWhenPossible: boolean;
    /** @internal */
    private _containerElement;
    /** @internal */
    private _containerPosition;
    /** @internal */
    private _isInitialised;
    /** @internal */
    private _groundItem;
    /** @internal */
    private _openPopouts;
    /** @internal */
    private _dropTargetIndicator;
    /** @internal */
    private _resizeTimeoutId;
    /** @internal */
    private _itemAreas;
    private _dragState;
    private _lastDragLeaveTime;
    private _draggedComponentItem;
    /** @internal */
    private _dragEnterCount;
    /** @internal */
    private _maximisedStack;
    /** @internal */
    private _maximisePlaceholder;
    /** @internal */
    private _tabDropPlaceholder;
    /** @internal */
    private _dragSources;
    /** @internal */
    private _updatingColumnsResponsive;
    /** @internal */
    private _firstLoad;
    /** @internal */
    private _eventHub;
    /** @internal */
    private _width;
    /** @internal */
    private _height;
    /** @internal */
    private _focusedComponentItem;
    /** @internal */
    private _virtualSizedContainers;
    /** @internal */
    private _virtualSizedContainerAddingBeginCount;
    /** @internal */
    protected _constructorOrSubWindowLayoutConfig: LayoutConfig | undefined;
    /** @internal */
    private _resizeObserver;
    /** @internal @deprecated to be removed in version 3 */
    private _windowBeforeUnloadListener;
    /** @internal @deprecated to be removed in version 3 */
    private _windowBeforeUnloadListening;
    /** @internal */
    private _maximisedStackBeforeDestroyedListener;
    private _area;
    private _lastValidArea;
    private _actionsOnDragEnd;
    popoutClickHandler: (item: Stack, ev: Event) => boolean;
    private _removeItem;
    inSomeWindow: boolean;
    private delayedDragEndTimer;
    private delayedDragEndFunction;
    createDragProxy: ((item: ComponentItem, x: number, y: number) => void) | undefined;
    readonly isSubWindow: boolean;
    layoutConfig: ResolvedLayoutConfig;
    /** Return width and height available for root element.
     * By default size of containerElement - which is usually document.root.
     * Should be overridden if not 100% of containerElement. */
    containerWidthAndHeight: () => WidthAndHeight;
    beforeVirtualRectingEvent: LayoutManager.BeforeVirtualRectingEvent | undefined;
    afterVirtualRectingEvent: LayoutManager.AfterVirtualRectingEvent | undefined;
    createComponentElement: (config: ResolvedComponentItemConfig, component: ComponentContainer) => HTMLElement | undefined;
    enterOrLeaveSomeWindow(entering: boolean): void;
    get container(): HTMLElement;
    get isInitialised(): boolean;
    /** @internal */
    get groundItem(): GroundItem | undefined;
    /** @internal @deprecated use {@link (LayoutManager:class).groundItem} instead */
    get root(): GroundItem | undefined;
    get openPopouts(): BrowserPopout[];
    /** @internal */
    get dropTargetIndicator(): DropTargetIndicator | null;
    get width(): number | null;
    get height(): number | null;
    /**
     * Retrieves the {@link (EventHub:class)} instance associated with this layout manager.
     * This can be used to propagate events between the windows
     * @public
     */
    get eventHub(): EventHub;
    get rootItem(): ContentItem | undefined;
    get focusedComponentItem(): ComponentItem | undefined;
    /** @internal */
    get tabDropPlaceholder(): HTMLElement;
    get maximisedStack(): Stack | undefined;
    /** @deprecated indicates deprecated constructor use */
    get deprecatedConstructor(): boolean;
    /**
     * @param container - A Dom HTML element. Defaults to body
     * @internal
     */
    constructor(parameters: LayoutManager.ConstructorParameters);
    /**
     * Destroys the LayoutManager instance itself as well as every ContentItem
     * within it. After this is called nothing should be left of the LayoutManager.
     *
     * This function only needs to be called if an application wishes to destroy the Golden Layout object while
     * a page remains loaded. When a page is unloaded, all resources claimed by Golden Layout will automatically
     * be released.
     */
    destroy(): void;
    /**
     * Takes a GoldenLayout configuration object and
     * replaces its keys and values recursively with
     * one letter codes
     * @deprecated use {@link (ResolvedLayoutConfig:namespace).minifyConfig} instead
     */
    minifyConfig(config: ResolvedLayoutConfig): ResolvedLayoutConfig;
    useNativeDragAndDrop(): boolean;
    currentlyDragging(): boolean;
    dragDataMimetype(): string;
    validDragEvent(e: DragEvent): boolean;
    /**
     * Takes a configuration Object that was previously minified
     * using minifyConfig and returns its original version
     * @deprecated use {@link (ResolvedLayoutConfig:namespace).unminifyConfig} instead
     */
    unminifyConfig(config: ResolvedLayoutConfig): ResolvedLayoutConfig;
    /** @internal */
    abstract bindComponent(container: ComponentContainer, itemConfig: ResolvedComponentItemConfig): ComponentContainer.Handle;
    /** @internal */
    abstract unbindComponent(container: ComponentContainer, handle: ComponentContainer.Handle): void;
    _hideTargetIndicator(): void;
    /**
     * Called from GoldenLayout class. Finishes of init
     * @internal
     */
    init(): void;
    /**
     * Sets the target position, highlighting the appropriate area
     *
     * @param x - The x position in px
     * @param y - The y position in px
     *
     * @internal
     */
    private setDropPosition;
    private onDrag;
    /**
     * Loads a new layout
     * @param layoutConfig - New layout to be loaded
     */
    loadLayout(layoutConfig: LayoutConfig): void;
    /**
     * Creates a layout configuration object based on the the current state
     *
     * @public
     * @returns GoldenLayout configuration
     */
    saveLayout(): ResolvedLayoutConfig;
    /**
     * Removes any existing layout. Effectively, an empty layout will be loaded.
     */
    clear(): void;
    /**
     * @deprecated Use {@link (LayoutManager:class).saveLayout}
     */
    toConfig(): ResolvedLayoutConfig;
    /**
     * Adds a new ComponentItem.  Will use default location selectors to ensure a location is found and
     * component is successfully added
     * @param componentTypeName - Name of component type to be created.
     * @param state - Optional initial state to be assigned to component
     * @returns New ComponentItem created.
     */
    newComponent(componentType: JsonValue, componentState?: JsonValue, title?: string): ComponentItem;
    /**
     * Adds a ComponentItem at the first valid selector location.
     * @param componentTypeName - Name of component type to be created.
     * @param state - Optional initial state to be assigned to component
     * @param locationSelectors - Array of location selectors used to find location in layout where component
     * will be added. First location in array which is valid will be used. If locationSelectors is undefined,
     * {@link (LayoutManager:namespace).defaultLocationSelectors} will be used
     * @returns New ComponentItem created or undefined if no valid location selector was in array.
     */
    newComponentAtLocation(componentType: JsonValue, componentState?: JsonValue, title?: string, locationSelectors?: LayoutManager.LocationSelector[]): ComponentItem | undefined;
    /**
     * Adds a new ComponentItem.  Will use default location selectors to ensure a location is found and
     * component is successfully added
     * @param componentType - Type of component to be created.
     * @param state - Optional initial state to be assigned to component
     * @returns Location of new ComponentItem created.
     */
    addComponent(componentType: JsonValue, componentState?: JsonValue, title?: string): LayoutManager.Location;
    /**
     * Adds a ComponentItem at the first valid selector location.
     * @param componentType - Type of component to be created.
     * @param state - Optional initial state to be assigned to component
     * @param locationSelectors - Array of location selectors used to find determine location in layout where component
     * will be added. First location in array which is valid will be used. If undefined,
     * {@link (LayoutManager:namespace).defaultLocationSelectors} will be used.
     * @returns Location of new ComponentItem created or undefined if no valid location selector was in array.
     */
    addComponentAtLocation(componentType: JsonValue, componentState?: JsonValue, title?: string, locationSelectors?: readonly LayoutManager.LocationSelector[]): LayoutManager.Location | undefined;
    /**
     * Adds a new ContentItem.  Will use default location selectors to ensure a location is found and
     * component is successfully added
     * @param itemConfig - ResolvedItemConfig of child to be added.
     * @returns New ContentItem created.
     */
    newItem(itemConfig: RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig): ContentItem;
    /**
     * Adds a new child ContentItem under the root ContentItem.  If a root does not exist, then create root ContentItem instead
     * @param itemConfig - ResolvedItemConfig of child to be added.
     * @param locationSelectors - Array of location selectors used to find determine location in layout where ContentItem
     * will be added. First location in array which is valid will be used. If undefined,
     * {@link (LayoutManager:namespace).defaultLocationSelectors} will be used.
     * @returns New ContentItem created or undefined if no valid location selector was in array. */
    newItemAtLocation(itemConfig: RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig, locationSelectors?: readonly LayoutManager.LocationSelector[]): ContentItem | undefined;
    /**
     * Adds a new ContentItem.  Will use default location selectors to ensure a location is found and
     * component is successfully added.
     * @param itemConfig - ResolvedItemConfig of child to be added.
     * @returns Location of new ContentItem created. */
    addItem(itemConfig: RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig): LayoutManager.Location;
    /**
     * Adds a ContentItem at the first valid selector location.
     * @param itemConfig - ResolvedItemConfig of child to be added.
     * @param locationSelectors - Array of location selectors used to find determine location in layout where ContentItem
     * will be added. First location in array which is valid will be used. If undefined,
     * {@link (LayoutManager:namespace).defaultLocationSelectors} will be used.
     * @returns Location of new ContentItem created or undefined if no valid location selector was in array. */
    addItemAtLocation(itemConfig: RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig, locationSelectors?: readonly LayoutManager.LocationSelector[]): LayoutManager.Location | undefined;
    /** Loads the specified component ResolvedItemConfig as root.
     * This can be used to display a Component all by itself.  The layout cannot be changed other than having another new layout loaded.
     * Note that, if this layout is saved and reloaded, it will reload with the Component as a child of a Stack.
     */
    loadComponentAsRoot(itemConfig: ComponentItemConfig): void;
    /** @deprecated Use {@link (LayoutManager:class).setSize} */
    updateSize(width: number, height: number): void;
    /**
     * Updates the layout managers size
     *
     * @param width - Width in pixels
     * @param height - Height in pixels
     */
    setSize(width: number, height: number): void;
    /** @internal */
    updateSizeFromContainer(): void;
    /**
     * Update the size of the root ContentItem.  This will update the size of all contentItems in the tree
     */
    updateRootSize(): void;
    /** @public */
    createAndInitContentItem(config: ResolvedItemConfig, parent: ContentItem): ContentItem;
    /**
     * Recursively creates new item tree structures based on a provided
     * ItemConfiguration object
     *
     * @param config - ResolvedItemConfig
     * @param parent - The item the newly created item should be a child of
     * @internal
     */
    createContentItem(config: ResolvedItemConfig, parent: ContentItem): ContentItem;
    findFirstComponentItemById(id: string): ComponentItem | undefined;
    /**
     * Creates a popout window with the specified content at the specified position
     *
     * @param itemConfigOrContentItem - The content of the popout window's layout manager derived from either
     * a {@link (ContentItem:class)} or {@link (ItemConfig:interface)} or ResolvedItemConfig content (array of {@link (ItemConfig:interface)})
     * @param positionAndSize - The width, height, left and top of Popout window
     * @param parentId -The id of the element this item will be appended to when popIn is called
     * @param indexInParent - The position of this item within its parent element
     */
    createPopout(itemConfigOrContentItem: ContentItem | ResolvedRootItemConfig, positionAndSize: ResolvedPopoutLayoutConfig.Window, parentId: string | null, indexInParent: number | null): BrowserPopout;
    /** @internal */
    createPopoutFromContentItem(item: ContentItem, window: ResolvedPopoutLayoutConfig.Window | undefined, parentId: string | null, indexInParent: number | null | undefined): BrowserPopout;
    /** @internal */
    beginVirtualSizedContainerAdding(): void;
    /** @internal */
    addVirtualSizedContainer(container: ComponentContainer): void;
    /** @internal */
    endVirtualSizedContainerAdding(): void;
    /** @internal */
    private createPopoutFromItemConfig;
    /** @internal */
    createPopoutFromPopoutLayoutConfig(config: ResolvedPopoutLayoutConfig): BrowserPopout;
    /**
     * Closes all Open Popouts
     * Applications can call this method when a page is unloaded to remove its open popouts
     */
    closeAllOpenPopouts(): void;
    /**
     * Attaches DragListener to any given DOM element
     * and turns it into a way of creating new ComponentItems
     * by 'dragging' the DOM element into the layout
     *
     * @param element - The HTML element which will be listened to for commencement of drag.
     * @param componentTypeOrItemConfigCallback - Type of component to be created, or a callback which will provide the ItemConfig
     * to be used to create the component.
     * @param componentState - Optional initial state of component.  This will be ignored if componentTypeOrFtn is a function.
     *
     * @returns an opaque object that identifies the DOM element
     *          and the attached itemConfig. This can be used in
     *          removeDragSource() later to get rid of the drag listeners.
     */
    newDragSource(element: HTMLElement, itemConfigCallback: () => DragSource.ComponentItemConfig | ComponentItemConfig): DragSource;
    /** @deprecated will be replaced in version 3 with newDragSource(element: HTMLElement, itemConfig: ComponentItemConfig) */
    newDragSource(element: HTMLElement, componentType: JsonValue, componentState?: JsonValue, title?: JsonValue, id?: string): DragSource;
    /**
     * Removes a DragListener added by createDragSource() so the corresponding
     * DOM element is not a drag source any more.
     */
    removeDragSource(dragSource: DragSource): void;
    removeElementEventually(element: HTMLElement): void;
    deferIfDragging(action: (cancel: boolean) => void): void;
    doDeferredActions(cancel: boolean): void;
    /** @internal */
    startComponentDragOld(x: number, y: number, dragListener: DragListener, componentItem: ComponentItem, stack: Stack): void;
    /** @internal */
    startComponentDrag(ev: DragEvent, componentItem: ComponentItem): void;
    /**
     * Programmatically focuses an item. This focuses the specified component item
     * and the item emits a focus event
     *
     * @param item - The component item to be focused
     * @param suppressEvent - Whether to emit focus event
     */
    focusComponent(item: ComponentItem, suppressEvent?: boolean): void;
    /**
     * Programmatically blurs (defocuses) the currently focused component.
     * If a component item is focused, then it is blurred and and the item emits a blur event
     *
     * @param item - The component item to be blurred
     * @param suppressEvent - Whether to emit blur event
     */
    clearComponentFocus(suppressEvent?: boolean): void;
    /**
     * Programmatically focuses a component item or removes focus (blurs) from an existing focused component item.
     *
     * @param item - If defined, specifies the component item to be given focus.  If undefined, clear component focus.
     * @param suppressEvents - Whether to emit focus and blur events
     * @internal
     */
    setFocusedComponentItem(item: ComponentItem | undefined, suppressEvents?: boolean): void;
    /** @internal */
    private createContentItemFromConfig;
    /**
     * This should only be called from stack component.
     * Stack will look after docking processing associated with maximise/minimise
     * @internal
     **/
    setMaximisedStack(stack: Stack | undefined): void;
    checkMinimiseMaximisedStack(): void;
    /** @internal */
    private cleanupBeforeMaximisedStackDestroyed;
    /**
     * This method is used to get around sandboxed iframe restrictions.
     * If 'allow-top-navigation' is not specified in the iframe's 'sandbox' attribute
     * (as is the case with codepens) the parent window is forbidden from calling certain
     * methods on the child, such as window.close() or setting document.location.href.
     *
     * This prevented GoldenLayout popouts from popping in in codepens. The fix is to call
     * _$closeWindow on the child window's gl instance which (after a timeout to disconnect
     * the invoking method from the close call) closes itself.
     *
     * @internal
     */
    closeWindow(): void;
    /** @internal */
    getArea(x: number, y: number): ContentItem.Area | null;
    /** @internal */
    calculateItemAreas(): void;
    /**
     * Called as part of loading a new layout (including initial init()).
     * Checks to see layout has a maximised item. If so, it maximises that item.
     * @internal
     */
    private checkLoadedLayoutMaximiseItem;
    /** @internal */
    private processMaximiseStack;
    /** @internal */
    private processMinimiseMaximisedStack;
    /**
     * Iterates through the array of open popout windows and removes the ones
     * that are effectively closed. This is necessary due to the lack of reliably
     * listening for window.close / unload events in a cross browser compatible fashion.
     * @internal
     */
    private reconcilePopoutWindows;
    /**
     * Returns a flattened array of all content items,
     * regardles of level or type
     * @internal
     */
    private getAllContentItems;
    /**
     * Creates Subwindows (if there are any). Throws an error
     * if popouts are blocked.
     * @internal
     */
    private createSubWindows;
    /**
     * Debounces resize events
     * @internal
     */
    private handleContainerResize;
    /**
     * Debounces resize events
     * @internal
     */
    private processResizeWithDebounce;
    private checkClearResizeTimeout;
    /**
     * Determines what element the layout will be created in
     * @internal
     */
    private setContainer;
    /**
     * Called when the window is closed or the user navigates away
     * from the page
     * @internal
     * @deprecated to be removed in version 3
     */
    private onBeforeUnload;
    /**
     * Adjusts the number of columns to be lower to fit the screen and still maintain minItemWidth.
     * @internal
     */
    private adjustColumnsResponsive;
    /**
     * Determines if responsive layout should be used.
     *
     * @returns True if responsive layout should be used; otherwise false.
     * @internal
     */
    private useResponsiveLayout;
    /**
     * Adds all children of a node to another container recursively.
     * @param container - Container to add child content items to.
     * @param node - Node to search for content items.
     * @internal
     */
    private addChildContentItemsToContainer;
    private onDragEnter;
    private onDragLeave;
    private onDragOver;
    private onDragEnd;
    private exitDrag;
    draggingInOtherWindow(ending: boolean): void;
    droppedInOtherWindow(): void;
    private onDrop;
    /**
     * Finds all the stacks.
     * @returns The found stack containers.
     * @internal
     */
    private getAllStacks;
    /** @internal */
    private findFirstContentItemType;
    /** @internal */
    private findFirstContentItemTypeRecursive;
    /** @internal */
    private findFirstContentItemTypeByIdRecursive;
    /**
     * Finds all the stack containers.
     *
     * @param stacks - Set of containers to populate.
     * @param node - Current node to process.
     * @internal
     */
    private findAllStacksRecursive;
    /** @internal */
    private findFirstLocation;
    /** @internal */
    private findLocation;
    /** @internal */
    private tryCreateLocationFromParentItem;
}
/** @public */
export declare namespace LayoutManager {
    type BeforeVirtualRectingEvent = (this: void, count: number) => void;
    type AfterVirtualRectingEvent = (this: void) => void;
    /** @internal */
    interface ConstructorParameters {
        constructorOrSubWindowLayoutConfig: LayoutConfig | undefined;
        isSubWindow: boolean;
        containerElement: HTMLElement | undefined;
        containerPosition: Node | null;
    }
    /** @internal */
    function createMaximisePlaceElement(document: Document): HTMLElement;
    /** @internal */
    function createTabDropPlaceholderElement(document: Document): HTMLElement;
    /**
     * Specifies a location of a ContentItem without referencing the content item.
     * Used to specify where a new item is to be added
     * @public
     */
    interface Location {
        parentItem: ContentItem;
        index: number;
    }
    /**
     * A selector used to specify a unique location in the layout
     * @public
     */
    interface LocationSelector {
        /** Specifies selector algorithm */
        typeId: LocationSelector.TypeId;
        /** Used by algorithm to determine index in found ContentItem */
        index?: number;
    }
    /** @public */
    namespace LocationSelector {
        const enum TypeId {
            /** Stack with focused Item. Index specifies offset from index of focused item (eg 1 is the position after focused item) */
            FocusedItem = 0,
            /** Stack with focused Item. Index specfies ContentItems index */
            FocusedStack = 1,
            /** First stack found in layout */
            FirstStack = 2,
            /** First Row or Column found in layout (rows are searched first) */
            FirstRowOrColumn = 3,
            /** First Row in layout */
            FirstRow = 4,
            /** First Column in layout */
            FirstColumn = 5,
            /** Finds a location if layout is empty. The found location will be the root ContentItem. */
            Empty = 6,
            /** Finds root if layout is empty, otherwise a child under root */
            Root = 7
        }
    }
    /**
     * Default LocationSelectors array used if none is specified.  Will always find a location.
     * @public
     */
    const defaultLocationSelectors: readonly LocationSelector[];
    /**
     * LocationSelectors to try to get location next to existing focused item
     * @public
     */
    const afterFocusedItemIfPossibleLocationSelectors: readonly LocationSelector[];
}
//# sourceMappingURL=layout-manager.d.ts.map
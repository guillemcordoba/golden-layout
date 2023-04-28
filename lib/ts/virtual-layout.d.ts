import { LayoutConfig } from './config/config';
import { ResolvedComponentItemConfig } from './config/resolved-config';
import { ComponentContainer } from './container/component-container';
import { LayoutManager } from './layout-manager';
/** @public */
export declare abstract class VirtualLayout extends LayoutManager {
    bindComponentEvent: VirtualLayout.BindComponentEventHandler | undefined;
    unbindComponentEvent: VirtualLayout.UnbindComponentEventHandler | undefined;
    /** @internal @deprecated use while constructor is not determinate */
    private _bindComponentEventHanlderPassedInConstructor;
    /** @internal  @deprecated use while constructor is not determinate */
    private _creationTimeoutPassed;
    /**
     * @param container - A Dom HTML element. Defaults to body
     * @param bindComponentEventHandler - Event handler to bind components
     * @param bindComponentEventHandler - Event handler to unbind components
     * If bindComponentEventHandler is defined, then constructor will be determinate. It will always call the init()
     * function and the init() function will always complete. This means that the bindComponentEventHandler will be called
     * if constructor is for a popout window. Make sure bindComponentEventHandler is ready for events.
     */
    constructor(container?: HTMLElement, bindComponentEventHandler?: VirtualLayout.BindComponentEventHandler, unbindComponentEventHandler?: VirtualLayout.UnbindComponentEventHandler);
    /** @deprecated specify layoutConfig in {@link (LayoutManager:class).loadLayout} */
    constructor(config: LayoutConfig, container?: HTMLElement);
    /** @internal */
    constructor(configOrOptionalContainer: LayoutConfig | HTMLElement | undefined, containerOrBindComponentEventHandler: HTMLElement | VirtualLayout.BindComponentEventHandler | undefined, unbindComponentEventHandler: VirtualLayout.UnbindComponentEventHandler | undefined | Node | null, skipInit: true);
    destroy(): void;
    /**
     * Creates the actual layout. Must be called after all initial components
     * are registered. Recurses through the configuration and sets up
     * the item tree.
     *
     * If called before the document is ready it adds itself as a listener
     * to the document.ready event
     * @deprecated LayoutConfig should not be loaded in {@link (LayoutManager:class)} constructor, but rather in a
     * {@link (LayoutManager:class).loadLayout} call.  If LayoutConfig is not specified in {@link (LayoutManager:class)} constructor,
     * then init() will be automatically called internally and should not be called externally.
     */
    init(): void;
    /**
     * Clears existing HTML and adjusts style to make window suitable to be a popout sub window
     * Curently is automatically called when window is a subWindow and bindComponentEvent is not passed in the constructor
     * If bindComponentEvent is not passed in the constructor, the application must either call this function explicitly or
     * (preferably) make the window suitable as a subwindow.
     * In the future, it is planned that this function is NOT automatically called in any circumstances.  Applications will
     * need to determine whether a window is a Golden Layout popout window and either call this function explicitly or
     * hide HTML not relevant to the popout.
     * See apitest for an example of how HTML is hidden when popout windows are displayed
     */
    clearHtmlAndAdjustStylesForSubWindow(): void;
    /**
     * Will add button if not popinOnClose specified in settings
     * @returns true if added otherwise false
     */
    checkAddDefaultPopinButton(): boolean;
    /** @internal */
    unbindComponent(container: ComponentContainer, handle: ComponentContainer.Handle): void;
}
/** @public */
export declare namespace VirtualLayout {
    type BindComponentEventHandler = (this: void, container: ComponentContainer, itemConfig: ResolvedComponentItemConfig) => ComponentContainer.Handle;
    type UnbindComponentEventHandler = (this: void, container: ComponentContainer) => void;
    type BeforeVirtualRectingEvent = (this: void) => void;
    /** @internal */
    function createLayoutManagerConstructorParameters(configOrOptionalContainer: LayoutConfig | HTMLElement | undefined, containerOrBindComponentEventHandler?: HTMLElement | Node | null | VirtualLayout.BindComponentEventHandler, unbindComponentEventHandler?: VirtualLayout.UnbindComponentEventHandler | Node | null): LayoutManager.ConstructorParameters;
}
//# sourceMappingURL=virtual-layout.d.ts.map
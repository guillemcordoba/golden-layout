import { LayoutConfig } from './config/config';
import { ResolvedComponentItemConfig } from './config/resolved-config';
import { ComponentContainer } from './container/component-container';
import { JsonValue } from './utils/types';
import { VirtualLayout } from './virtual-layout';
/** @public */
export declare class GoldenLayout extends VirtualLayout {
    /** @internal */
    private _componentTypesMap;
    /** @internal */
    private _componentTypesDefault;
    /** @internal */
    private _registeredComponentMap;
    /** @internal */
    private _virtuableComponentMap;
    /** @internal */
    private _containerVirtualVisibilityChangeRequiredEventListener;
    /** @internal */
    private _containerVirtualZIndexChangeRequiredEventListener;
    /**
     * @param container - A Dom HTML element. Defaults to body
     * @param bindComponentEventHandler - Event handler to bind components
     * @param bindComponentEventHandler - Event handler to unbind components
     * If bindComponentEventHandler is defined, then constructor will be determinate. It will always call the init()
     * function and the init() function will always complete. This means that the bindComponentEventHandler will be called
     * if constructor is for a popout window. Make sure bindComponentEventHandler is ready for events.
     */
    constructor(container?: HTMLElement, bindComponentEventHandler?: VirtualLayout.BindComponentEventHandler, unbindComponentEventHandler?: VirtualLayout.UnbindComponentEventHandler);
    constructor(config: LayoutConfig, container?: HTMLElement, position?: Node | null);
    /** @deprecated specify layoutConfig in {@link (LayoutManager:class).loadLayout} */
    constructor(config: LayoutConfig, container?: HTMLElement);
    /**
     * Register a new component with the layout manager.
     */
    registerComponent(typeName: string, componentFactoryFunction: GoldenLayout.ComponentFactoryFunction): void;
    registerComponentDefault(componentFactoryFunction: GoldenLayout.ComponentFactoryFunction): void;
    getRegisteredComponentTypeNames(): string[];
    /**
     * Returns a previously registered component instantiator.  Attempts to utilize registered
     * component type by first, then falls back to the component constructor callback function (if registered).
     * If neither gets an instantiator, then returns `undefined`.
     * Note that `undefined` will return if config.componentType is not a string
     *
     * @param config - The item config
     * @public
     */
    getComponentInstantiator(config: ResolvedComponentItemConfig): GoldenLayout.ComponentFactoryFunction | undefined;
    /** @internal */
    bindComponent(container: ComponentContainer, itemConfig: ResolvedComponentItemConfig): ComponentContainer.Handle;
    /** @internal */
    unbindComponent(container: ComponentContainer, handle: ComponentContainer.Handle): void;
    /** @internal */
    private handleContainerVirtualVisibilityChangeRequiredEvent;
    /** @internal */
    private handleContainerVirtualZIndexChangeRequiredEvent;
}
/** @public */
export declare namespace GoldenLayout {
    interface VirtuableComponent {
        rootHtmlElement: HTMLElement;
    }
    type ComponentFactoryFunction = (container: ComponentContainer, state: JsonValue | undefined) => ComponentContainer.Handle;
}
//# sourceMappingURL=golden-layout.d.ts.map
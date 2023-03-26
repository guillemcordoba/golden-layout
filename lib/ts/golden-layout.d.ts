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
    private _getComponentConstructorFtn;
    /** @internal */
    private _registeredComponentMap;
    /** @internal */
    private _virtuableComponentMap;
    /** @internal */
    private _goldenLayoutBoundingClientRect;
    /** @internal */
    private _containerVirtualRectingRequiredEventListener;
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
    /** @deprecated specify layoutConfig in {@link (LayoutManager:class).loadLayout} */
    constructor(config: LayoutConfig, container?: HTMLElement);
    /**
     * Register a new component type with the layout manager.
     *
     * @deprecated See {@link https://stackoverflow.com/questions/40922531/how-to-check-if-a-javascript-function-is-a-constructor}
     * instead use {@link (GoldenLayout:class).registerComponentConstructor}
     * or {@link (GoldenLayout:class).registerComponentFactoryFunction}
     */
    registerComponent(name: string, componentConstructorOrFactoryFtn: GoldenLayout.ComponentConstructor | GoldenLayout.ComponentFactoryFunction, virtual?: boolean): void;
    /**
     * Register a new component type with the layout manager.
     */
    registerComponentConstructor(typeName: string, componentConstructor: GoldenLayout.ComponentConstructor, virtual?: boolean): void;
    /**
     * Register a new component with the layout manager.
     */
    registerComponentFactoryFunction(typeName: string, componentFactoryFunction: GoldenLayout.ComponentFactoryFunction, virtual?: boolean): void;
    /**
     * Register a component function with the layout manager. This function should
     * return a constructor for a component based on a config.
     * This function will be called if a component type with the required name is not already registered.
     * It is recommended that applications use the {@link (VirtualLayout:class).getComponentEvent} and
     * {@link (VirtualLayout:class).releaseComponentEvent} instead of registering a constructor callback
     * @deprecated use {@link (GoldenLayout:class).registerGetComponentConstructorCallback}
     */
    registerComponentFunction(callback: GoldenLayout.GetComponentConstructorCallback): void;
    /**
     * Register a callback closure with the layout manager which supplies a Component Constructor.
     * This callback should return a constructor for a component based on a config.
     * This function will be called if a component type with the required name is not already registered.
     * It is recommended that applications use the {@link (VirtualLayout:class).getComponentEvent} and
     * {@link (VirtualLayout:class).releaseComponentEvent} instead of registering a constructor callback
     */
    registerGetComponentConstructorCallback(callback: GoldenLayout.GetComponentConstructorCallback): void;
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
    getComponentInstantiator(config: ResolvedComponentItemConfig): GoldenLayout.ComponentInstantiator | undefined;
    /** @internal */
    bindComponent(container: ComponentContainer, itemConfig: ResolvedComponentItemConfig): ComponentContainer.BindableComponent;
    /** @internal */
    unbindComponent(container: ComponentContainer, virtual: boolean, component: ComponentContainer.Component | undefined): void;
    fireBeforeVirtualRectingEvent(count: number): void;
    /** @internal */
    private handleContainerVirtualRectingRequiredEvent;
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
    type ComponentConstructor = new (container: ComponentContainer, state: JsonValue | undefined, virtual: boolean) => ComponentContainer.Component;
    type ComponentFactoryFunction = (container: ComponentContainer, state: JsonValue | undefined, virtual: boolean) => ComponentContainer.Component | undefined;
    type GetComponentConstructorCallback = (this: void, config: ResolvedComponentItemConfig) => ComponentConstructor;
    interface ComponentInstantiator {
        constructor: ComponentConstructor | undefined;
        factoryFunction: ComponentFactoryFunction | undefined;
        virtual: boolean;
    }
}
//# sourceMappingURL=golden-layout.d.ts.map
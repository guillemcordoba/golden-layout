"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoldenLayout = void 0;
const resolved_config_1 = require("./config/resolved-config");
const external_error_1 = require("./errors/external-error");
const internal_error_1 = require("./errors/internal-error");
const i18n_strings_1 = require("./utils/i18n-strings");
const utils_1 = require("./utils/utils");
const virtual_layout_1 = require("./virtual-layout");
/** @public */
class GoldenLayout extends virtual_layout_1.VirtualLayout {
    /** @internal */
    constructor(configOrOptionalContainer, containerOrBindComponentEventHandler, unbindComponentEventHandler) {
        super(configOrOptionalContainer, containerOrBindComponentEventHandler, unbindComponentEventHandler, true);
        /** @internal */
        this._componentTypesMap = new Map();
        /** @internal */
        this._registeredComponentMap = new Map();
        /** @internal */
        this._virtuableComponentMap = new Map(); // FIXME remove
        /** @internal */
        this._containerVirtualVisibilityChangeRequiredEventListener = (container, visible) => this.handleContainerVirtualVisibilityChangeRequiredEvent(container, visible);
        /** @internal */
        this._containerVirtualZIndexChangeRequiredEventListener = (container, logicalZIndex, defaultZIndex) => this.handleContainerVirtualZIndexChangeRequiredEvent(container, logicalZIndex, defaultZIndex);
        // we told VirtualLayout to not call init() (skipInit set to true) so that Golden Layout can initialise its properties before init is called
        if (!this.deprecatedConstructor) {
            this.init();
        }
    }
    //  REMOVE   registerComponentFactoryFunction(typeName: string, componentFactoryFunction: GoldenLayout.ComponentFactoryFunction, virtual = false): void {
    /**
     * Register a new component with the layout manager.
     */
    registerComponent(typeName, componentFactoryFunction) {
        if (typeof componentFactoryFunction !== 'function') {
            throw new external_error_1.BindError('Please register a constructor function');
        }
        const existingComponentType = this._componentTypesMap.get(typeName);
        if (existingComponentType !== undefined) {
            throw new external_error_1.BindError(`${i18n_strings_1.i18nStrings[3 /* I18nStringId.ComponentIsAlreadyRegistered */]}: ${typeName}`);
        }
        this._componentTypesMap.set(typeName, componentFactoryFunction);
    }
    registerComponentDefault(componentFactoryFunction) {
        if (typeof componentFactoryFunction !== 'function') {
            throw new external_error_1.BindError('Please register a constructor function');
        }
        if (this._componentTypesDefault !== undefined) {
            throw new external_error_1.BindError(`${i18n_strings_1.i18nStrings[3 /* I18nStringId.ComponentIsAlreadyRegistered */]} - default`);
        }
        this._componentTypesDefault = componentFactoryFunction;
    }
    getRegisteredComponentTypeNames() {
        const typeNamesIterableIterator = this._componentTypesMap.keys();
        return Array.from(typeNamesIterableIterator);
    }
    /**
     * Returns a previously registered component instantiator.  Attempts to utilize registered
     * component type by first, then falls back to the component constructor callback function (if registered).
     * If neither gets an instantiator, then returns `undefined`.
     * Note that `undefined` will return if config.componentType is not a string
     *
     * @param config - The item config
     * @public
     */
    getComponentInstantiator(config) {
        let instantiator;
        const typeName = resolved_config_1.ResolvedComponentItemConfig.resolveComponentTypeName(config);
        if (typeName !== undefined) {
            instantiator = this._componentTypesMap.get(typeName);
        }
        return instantiator || this._componentTypesDefault;
    }
    /** @internal */
    bindComponent(container, itemConfig) {
        const factoryFunction = this.getComponentInstantiator(itemConfig);
        let result = undefined;
        if (factoryFunction !== undefined) {
            // handle case where component is obtained by name or component constructor callback
            let componentState;
            if (itemConfig.componentState === undefined) {
                componentState = undefined;
            }
            else {
                // make copy
                componentState = (0, utils_1.deepExtendValue)({}, itemConfig.componentState);
            }
            if (factoryFunction !== undefined) {
                result = factoryFunction(container, componentState);
            }
            /*
            if (virtual) {
                if (component === undefined) {
                    throw new UnexpectedUndefinedError('GLBCVCU988774');
                } else {
                    const virtuableComponent = component as GoldenLayout.VirtuableComponent;
                    const componentRootElement = virtuableComponent.rootHtmlElement;
                    if (componentRootElement === undefined) {
                        throw new BindError(`${i18nStrings[I18nStringId.VirtualComponentDoesNotHaveRootHtmlElement]}: ${typeName}`);
                    } else {
                        ensureElementPositionAbsolute(componentRootElement);
                        this.container.appendChild(componentRootElement);
                        this._virtuableComponentMap.set(container, virtuableComponent);
                        container.virtualVisibilityChangeRequiredEvent = this._containerVirtualVisibilityChangeRequiredEventListener;
                        container.virtualZIndexChangeRequiredEvent = this._containerVirtualZIndexChangeRequiredEventListener;
                    }
                }
            }

            this._registeredComponentMap.set(container, component);

            result = {
                virtual: instantiator.virtual,
                component,
                };
            */
        }
        else {
            //result = super.bindComponent(container, itemConfig);
        }
        return result;
    }
    /** @internal */
    unbindComponent(container, handle) {
        /*
        const registeredComponent = this._registeredComponentMap.get(container);
        if (registeredComponent === undefined) {
            super.unbindComponent(container, handle); // was not created from registration so use virtual unbind events
        } else {
            const virtuableComponent = this._virtuableComponentMap.get(container);
            if (virtuableComponent !== undefined) {
                const componentRootElement = virtuableComponent.rootHtmlElement;
                if (componentRootElement === undefined) {
                    throw new AssertError('GLUC77743', container.title);
                } else {
                    this.container.removeChild(componentRootElement);
                    this._virtuableComponentMap.delete(container);
                }
            }
        }
        */
    }
    /** @internal */
    handleContainerVirtualVisibilityChangeRequiredEvent(container, visible) {
        const virtuableComponent = this._virtuableComponentMap.get(container);
        if (virtuableComponent === undefined) {
            throw new internal_error_1.UnexpectedUndefinedError('GLHCVVCRE55934');
        }
        else {
            const rootElement = virtuableComponent.rootHtmlElement;
            if (rootElement === undefined) {
                throw new external_error_1.BindError(i18n_strings_1.i18nStrings[4 /* I18nStringId.ComponentIsNotVirtuable */] + ' ' + container.title);
            }
            else {
                (0, utils_1.setElementDisplayVisibility)(rootElement, visible);
            }
        }
    }
    /** @internal */
    handleContainerVirtualZIndexChangeRequiredEvent(container, logicalZIndex, defaultZIndex) {
        const virtuableComponent = this._virtuableComponentMap.get(container);
        if (virtuableComponent === undefined) {
            throw new internal_error_1.UnexpectedUndefinedError('GLHCVZICRE55935');
        }
        else {
            const rootElement = virtuableComponent.rootHtmlElement;
            if (rootElement === undefined) {
                throw new external_error_1.BindError(i18n_strings_1.i18nStrings[4 /* I18nStringId.ComponentIsNotVirtuable */] + ' ' + container.title);
            }
            else {
                rootElement.style.zIndex = defaultZIndex;
            }
        }
    }
}
exports.GoldenLayout = GoldenLayout;
//# sourceMappingURL=golden-layout.js.map
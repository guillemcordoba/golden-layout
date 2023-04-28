import { ResolvedComponentItemConfig, ResolvedHeaderedItemConfig } from '../config/resolved-config';
import { ComponentContainer } from '../container/component-container';
import { UnexpectedNullError } from '../errors/internal-error';
import { ItemType } from '../utils/types';
import { ContentItem } from './content-item';
import { Stack } from './stack';
import { numberToPixels } from '../utils/utils';
/** @public */
export class ComponentItem extends ContentItem {
    /** @internal @deprecated use {@link (ComponentItem:class).componentType} */
    get componentName() { return this._container.componentType; }
    get componentType() { return this._container.componentType; }
    get reorderEnabled() { return this._reorderEnabled; }
    /** @internal */
    get initialWantMaximise() { return this._initialWantMaximise; }
    get container() { return this._container; }
    get parentItem() { return this._parentItem; }
    get headerConfig() { return this._headerConfig; }
    get title() { return this._title; }
    get titleRenderer() { return this._titleRenderer; }
    get tab() { return this._tab; }
    get focused() { return this._focused; }
    /** @internal */
    constructor(layoutManager, config, 
    /** @internal */
    _parentItem) {
        super(layoutManager, config, _parentItem, ContentItem.createElement());
        this._parentItem = _parentItem;
        /** @internal */
        this._focused = false;
        this.isComponent = true;
        this._reorderEnabled = config.reorderEnabled;
        this.applyUpdatableConfig(config);
        this._initialWantMaximise = config.maximised;
        this._container = new ComponentContainer(config, this, layoutManager, (itemConfig) => this.handleUpdateItemConfigEvent(itemConfig), () => this.show(), () => this.hide(), (suppressEvent) => this.focus(suppressEvent), (suppressEvent) => this.blur(suppressEvent));
    }
    /** @internal */
    destroy() {
        const element = this.element;
        if (element)
            element.style.opacity = '0.1';
        const wasDragging = this.layoutManager.currentlyDragging();
        this.layoutManager.deferIfDragging((cancel) => {
            if (element)
                element.style.opacity = '';
            if (!cancel && !wasDragging) {
                this._container.destroy();
                super.destroy();
            }
        });
    }
    applyUpdatableConfig(config) {
        this.setTitle(config.title);
        this._headerConfig = config.header;
    }
    toConfig() {
        const stateRequestEvent = this._container.stateRequestEvent;
        const state = stateRequestEvent === undefined ? this._container.state : stateRequestEvent();
        const result = {
            type: ItemType.component,
            content: [],
            size: this.size,
            sizeUnit: this.sizeUnit,
            minSize: this.minSize,
            minSizeUnit: this.minSizeUnit,
            id: this.id,
            maximised: false,
            isClosable: this.isClosable,
            reorderEnabled: this._reorderEnabled,
            title: this._title,
            header: ResolvedHeaderedItemConfig.Header.createCopy(this._headerConfig),
            componentType: ResolvedComponentItemConfig.copyComponentType(this.componentType),
            componentState: state,
        };
        return result;
    }
    close() {
        if (this.parent === null) {
            throw new UnexpectedNullError('CIC68883');
        }
        else {
            this.parent.removeChild(this, false);
        }
    }
    // Used by Drag Proxy
    /** @internal */
    enterDragMode(width, height) {
        const style = this.element.style;
        style.height = `${height}px`;
        style.width = `${width}px`;
        this._container.enterDragMode(width, height);
    }
    /** @internal */
    exitDragMode() {
        const style = this.element.style;
        style.height = '';
        style.width = '';
        this._container.exitDragMode();
    }
    /** @internal */
    enterStackMaximised() {
        this._container.enterStackMaximised();
    }
    /** @internal */
    exitStackMaximised() {
        this._container.exitStackMaximised();
    }
    // Used by Drag Proxy
    /** @internal */
    drag() {
        this._container.drag();
    }
    /** @internal */
    init() {
        this.updateNodeSize();
        super.init();
        this._container.emit('open');
        this.initContentItems();
    }
    /**
     * Set this component's title
     *
     * @public
     * @param title -
     */
    setTitle(title) {
        this._title = title;
        this.emit('titleChanged', title);
        this.emit('stateChanged');
    }
    setTitleRenderer(renderer) {
        this._titleRenderer = renderer;
        this.emit('titleChanged', this._title);
        this.emit('stateChanged');
    }
    setTab(tab) {
        this._tab = tab;
        this.emit('tab', tab);
        this._container.setTab(tab);
    }
    /** @internal */
    hide() {
        this._container.setVisibility(false);
    }
    /** @internal */
    show() {
        this._container.setVisibility(true);
    }
    /**
     * Focuses the item if it is not already focused
     */
    focus(suppressEvent = false) {
        this.parentItem.setActiveComponentItem(this, true, suppressEvent);
    }
    /** @internal */
    setFocused(suppressEvent) {
        this._focused = true;
        this.tab.setFocused();
        if (!suppressEvent) {
            this.emitBaseBubblingEvent('focus');
        }
    }
    /**
     * Blurs (defocuses) the item if it is focused
     */
    blur(suppressEvent = false) {
        if (this._focused) {
            this.layoutManager.setFocusedComponentItem(undefined, suppressEvent);
        }
    }
    /** @internal */
    setBlurred(suppressEvent) {
        this._focused = false;
        this.tab.setBlurred();
        if (!suppressEvent) {
            this.emitBaseBubblingEvent('blur');
        }
    }
    /** @internal */
    setParent(parent) {
        this._parentItem = parent;
        super.setParent(parent);
    }
    /** @internal */
    handleUpdateItemConfigEvent(itemConfig) {
        this.applyUpdatableConfig(itemConfig);
    }
    /** @internal */
    updateNodeSize() {
        // OLD:  this._container.setSizeToNodeSize(width, height, force)
        const contentInset = this.layoutManager.layoutConfig.dimensions.contentInset;
        this.element.style.margin = contentInset ? `${contentInset}px` : '';
        const contentElement = this.container.contentElement;
        const componentElement = this.container.element;
        if (contentElement instanceof HTMLElement
            // && contentElement.style.display !== 'none'
            && this.parentItem instanceof Stack) {
            // Do not update size of hidden components to prevent unwanted reflows
            const stackElement = this.parentItem.element;
            let stackBounds;
            const itemElement = this.element;
            const itemBounds = itemElement.getBoundingClientRect();
            const layoutBounds = this.layoutManager.container.getBoundingClientRect();
            if (componentElement instanceof HTMLElement
                && contentElement !== componentElement) {
                stackBounds = stackElement.getBoundingClientRect();
                componentElement.style.top = numberToPixels(stackBounds.top - layoutBounds.top);
                componentElement.style.left = numberToPixels(stackBounds.left - layoutBounds.left);
                componentElement.style.width = numberToPixels(stackBounds.width);
                componentElement.style.height = numberToPixels(stackBounds.height);
            }
            else {
                stackBounds = layoutBounds;
            }
            contentElement.style.position = "absolute";
            contentElement.style.top = numberToPixels(itemBounds.top - stackBounds.top);
            contentElement.style.left = numberToPixels(itemBounds.left - stackBounds.left);
            contentElement.style.width = numberToPixels(itemBounds.width);
            contentElement.style.height = numberToPixels(itemBounds.height);
        }
        else
            console.log('updateNodeSize ignored');
        this.layoutManager.addVirtualSizedContainer(this.container);
    }
}
//# sourceMappingURL=component-item.js.map
import { UnexpectedUndefinedError } from '../errors/internal-error';
import { Stack } from '../items/stack';
import { DragListener } from '../utils/drag-listener';
import { enableIFramePointerEvents } from '../utils/utils';
/**
 * Represents an individual tab within a Stack's header
 * @public
 */
export class Tab {
    get isActive() { return this._isActive; }
    // get header(): Header { return this._header; }
    get componentItem() { return this._componentItem; }
    /** @deprecated use {@link (Tab:class).componentItem} */
    get contentItem() { return this._componentItem; }
    get element() { return this._element; }
    get titleElement() { return this._titleElement; }
    get closeElement() { return this._closeElement; }
    get reorderEnabled() { return this._dragListener !== undefined; }
    set reorderEnabled(value) {
        if (value !== this.reorderEnabled) {
            if (value) {
                this.enableReorder();
            }
            else {
                this.disableReorder();
            }
        }
    }
    /** @internal */
    constructor(
    /** @internal */
    _layoutManager, 
    /** @internal */
    _componentItem, 
    /** @internal */
    _closeEvent, 
    /** @internal */
    _focusEvent, 
    /** @internal */
    _dragStartEvent) {
        var _a;
        this._layoutManager = _layoutManager;
        this._componentItem = _componentItem;
        this._closeEvent = _closeEvent;
        this._focusEvent = _focusEvent;
        this._dragStartEvent = _dragStartEvent;
        /** @internal */
        this._isActive = false;
        /** @internal */
        this._tabTouchStartListener = (ev) => this.onTabTouchStart(ev);
        /** @internal */
        this._closeClickListener = () => this.onCloseClick();
        /** @internal */
        this._closeTouchStartListener = () => this.onCloseTouchStart();
        // /** @internal */
        // private readonly _closeMouseDownListener = () => this.onCloseMousedown();
        /** @internal */
        this._dragStartListenerOld = (x, y) => this.onDragStartOld(x, y);
        /** @internal */
        this._dragStartListener = (e) => this.onDragStart(e);
        /** @internal */
        this._contentItemDestroyListener = () => this.onContentItemDestroy();
        /** @internal */
        this._tabTitleChangedListener = (title) => this.setTitle(title);
        this.tabClickListener = (ev) => this.onTabClickDown(ev);
        this._element = document.createElement('div');
        this._element.classList.add("lm_tab" /* DomConstants.ClassName.Tab */);
        this._titleElement = document.createElement('span');
        this._titleElement.classList.add("lm_title" /* DomConstants.ClassName.Title */);
        this._closeElement = document.createElement('div');
        this._closeElement.classList.add("lm_close_tab" /* DomConstants.ClassName.CloseTab */);
        this._element.setAttribute('draggable', 'true');
        this._closeElement.setAttribute('draggable', 'false');
        this._element.appendChild(this._titleElement);
        this._element.appendChild(this._closeElement);
        if (_componentItem.isClosable) {
            this._closeElement.style.display = '';
        }
        else {
            this._closeElement.style.display = 'none';
        }
        this.setTitle(_componentItem.title);
        this._componentItem.on('titleChanged', this._tabTitleChangedListener);
        const reorderEnabled = (_a = _componentItem.reorderEnabled) !== null && _a !== void 0 ? _a : this._layoutManager.layoutConfig.settings.reorderEnabled;
        if (reorderEnabled) {
            this.enableReorder();
        }
        this._element.addEventListener('click', this.tabClickListener, { passive: true });
        //this._element.addEventListener('touchstart', this._tabTouchStartListener, { passive: true });
        if (this._componentItem.isClosable) {
            this._closeElement.addEventListener('click', this._closeClickListener, { passive: true });
            this._closeElement.addEventListener('touchstart', this._closeTouchStartListener, { passive: true });
            // this._closeElement.addEventListener('mousedown', this._closeMouseDownListener, { passive: true });
        }
        else {
            this._closeElement.remove();
            this._closeElement = undefined;
        }
        this._componentItem.setTab(this);
        this._layoutManager.emit('tabCreated', this);
    }
    /**
     * Sets the tab's title to the provided string and sets
     * its title attribute to a pure text representation (without
     * html tags) of the same string.
     */
    setTitle(title) {
        this._element.title = title;
        const parent = this.componentItem.parent;
        if (parent instanceof Stack)
            parent.header.updateTabSizes();
    }
    /**
     * Sets this tab's active state. To programmatically
     * switch tabs, use Stack.setActiveComponentItem( item ) instead.
     */
    setActive(isActive) {
        if (isActive === this._isActive) {
            return;
        }
        this._isActive = isActive;
        if (isActive) {
            this._element.classList.add("lm_active" /* DomConstants.ClassName.Active */);
        }
        else {
            this._element.classList.remove("lm_active" /* DomConstants.ClassName.Active */);
        }
    }
    /**
     * Destroys the tab
     * @internal
     */
    destroy() {
        const action = (cancel) => {
            var _a, _b;
            if (cancel) {
                return;
            }
            this._closeEvent = undefined;
            this._focusEvent = undefined;
            this._dragStartEvent = undefined;
            this._element.removeEventListener('click', this.tabClickListener);
            this._element.removeEventListener('touchstart', this._tabTouchStartListener);
            (_a = this._closeElement) === null || _a === void 0 ? void 0 : _a.removeEventListener('click', this._closeClickListener);
            (_b = this._closeElement) === null || _b === void 0 ? void 0 : _b.removeEventListener('touchstart', this._closeTouchStartListener);
            // this._closeElement?.removeEventListener('mousedown', this._closeMouseDownListener);
            this._componentItem.off('titleChanged', this._tabTitleChangedListener);
            if (this.reorderEnabled) {
                this.disableReorder();
            }
        };
        const lm = this._layoutManager;
        if (lm.currentlyDragging()) {
            lm.deferIfDragging(action);
        }
        else {
            action(false);
        }
        lm.deferIfDragging((cancel) => {
            if (!cancel)
                this._element.remove();
        });
    }
    /** @internal */
    setBlurred() {
        this._element.classList.remove("lm_focused" /* DomConstants.ClassName.Focused */);
        this._titleElement.classList.remove("lm_focused" /* DomConstants.ClassName.Focused */);
    }
    /** @internal */
    setFocused() {
        this._element.classList.add("lm_focused" /* DomConstants.ClassName.Focused */);
        this._titleElement.classList.add("lm_focused" /* DomConstants.ClassName.Focused */);
    }
    /**
     * Old callback for the DragListener
     * @param x - The tabs absolute x position
     * @param y - The tabs absolute y position
     * @internal
     */
    onDragStartOld(x, y) {
        if (this._dragListener === undefined) {
            throw new UnexpectedUndefinedError('TODSDLU10093');
        }
        else {
            if (this._dragStartEvent === undefined) {
                throw new UnexpectedUndefinedError('TODS23309');
            }
            else {
                this._dragStartEvent(x, y, this._dragListener, this.componentItem);
            }
        }
    }
    onDragStart(e) {
        // See drag-listener#startDrag
        const tabElement = this._element;
        document.body.classList.add("lm_dragging" /* DomConstants.ClassName.Dragging */);
        tabElement.classList.add("lm_dragging" /* DomConstants.ClassName.Dragging */);
        enableIFramePointerEvents(false);
        // FIXME: set non-maximized
        this._layoutManager.startComponentDrag(e, this.componentItem);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._layoutManager.deferIfDragging((_cancel) => {
            document.body.classList.remove("lm_dragging" /* DomConstants.ClassName.Dragging */);
            tabElement.classList.remove("lm_dragging" /* DomConstants.ClassName.Dragging */);
        });
    }
    /** @internal */
    onContentItemDestroy() {
        if (this._dragListener !== undefined) {
            this._dragListener.destroy();
            this._dragListener = undefined;
        }
    }
    /**
     * Callback when the tab is clicked
     * @internal
     */
    onTabClickDown(event) {
        const target = event.target;
        // return if clicking child of tab unless inside an lm_title
        if (target !== this._element) {
            for (let p = target; !p.classList.contains("lm_title"); p = p.parentNode) {
                if (p == this._element || p == document.body)
                    return;
            }
        }
        // left mouse button
        if (event.button === 0) {
            // event.stopPropagation();
            this.notifyFocus();
            // middle mouse button
        }
        else if (event.button === 1 && this._componentItem.isClosable) {
            // event.stopPropagation();
            this.notifyClose();
        }
    }
    /** @internal */
    onTabTouchStart(event) {
        if (event.target === this._element) {
            this.notifyFocus();
        }
    }
    /**
     * Callback when the tab's close button is clicked
     * @internal
     */
    onCloseClick() {
        this.notifyClose();
    }
    /** @internal */
    onCloseTouchStart() {
        this.notifyClose();
    }
    /**
     * Callback to capture tab close button mousedown
     * to prevent tab from activating.
     * @internal
     */
    // private onCloseMousedown(): void {
    //     // event.stopPropagation();
    // }
    /** @internal */
    notifyClose() {
        if (this._closeEvent === undefined) {
            throw new UnexpectedUndefinedError('TNC15007');
        }
        else {
            this._closeEvent(this._componentItem);
        }
    }
    /** @internal */
    notifyFocus() {
        if (this._focusEvent === undefined) {
            throw new UnexpectedUndefinedError('TNA15007');
        }
        else {
            this._focusEvent(this._componentItem);
        }
    }
    /** @internal */
    enableReorder() {
        var _a;
        if (this._layoutManager.useNativeDragAndDrop()) {
            this._element.addEventListener('dragstart', this._dragStartListener, { passive: true });
        }
        else {
            this._dragListener = new DragListener(this._element);
            (_a = this._dragListener) === null || _a === void 0 ? void 0 : _a.on('dragStart', this._dragStartListenerOld);
        }
        this._componentItem.on('destroy', this._contentItemDestroyListener);
    }
    /** @internal */
    disableReorder() {
        if (this._layoutManager.useNativeDragAndDrop()) {
            this._element.removeEventListener('dragstart', this._dragStartListener);
        }
        else if (this._dragListener === undefined) {
            throw new UnexpectedUndefinedError('TDR87745');
        }
        else {
            this._componentItem.off('destroy', this._contentItemDestroyListener);
            this._dragListener.off('dragStart', this._dragStartListenerOld);
            this._dragListener = undefined;
        }
    }
}
/** @public */
(function (Tab) {
    let RenderFlags;
    (function (RenderFlags) {
        RenderFlags[RenderFlags["DropdownActive"] = 1] = "DropdownActive";
        RenderFlags[RenderFlags["InDropdownMenu"] = 2] = "InDropdownMenu";
        RenderFlags[RenderFlags["IsActiveTab"] = 4] = "IsActiveTab";
    })(RenderFlags = Tab.RenderFlags || (Tab.RenderFlags = {}));
})(Tab || (Tab = {}));
//# sourceMappingURL=tab.js.map
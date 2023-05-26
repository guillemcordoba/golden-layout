import { AssertError } from '../errors/internal-error';
import { numberToPixels, pixelsToNumber } from '../utils/utils';
import { Tab } from './tab';
/** @internal */
export class TabsContainer {
    get tabs() { return this._tabs; }
    get tabCount() { return this._tabs.length; }
    get lastVisibleTabIndex() { return this._lastVisibleTabIndex; }
    get element() { return this._element; }
    get dropdownElement() { return this._dropdownElement; }
    get dropdownActive() { return this._dropdownActive; }
    constructor(_layoutManager, _componentRemoveEvent, _componentFocusEvent, _componentDragStartEvent, _dropdownActiveChangedEvent) {
        this._layoutManager = _layoutManager;
        this._componentRemoveEvent = _componentRemoveEvent;
        this._componentFocusEvent = _componentFocusEvent;
        this._componentDragStartEvent = _componentDragStartEvent;
        this._dropdownActiveChangedEvent = _dropdownActiveChangedEvent;
        // There is one tab per ComponentItem in stack.  However they may not be ordered the same
        this._tabs = [];
        this._lastVisibleTabIndex = -1;
        this._dropdownActive = false;
        this._element = document.createElement('section');
        this._element.classList.add("lm_tabs" /* DomConstants.ClassName.Tabs */);
        this._dropdownElement = document.createElement('section');
        this._dropdownElement.classList.add("lm_tabdropdown_list" /* DomConstants.ClassName.TabDropdownList */);
        this._dropdownElement.style.display = 'none';
    }
    destroy() {
        for (let i = 0; i < this._tabs.length; i++) {
            this._tabs[i].destroy();
        }
    }
    /**
     * Creates a new tab and associates it with a contentItem
     * @param index - The position of the tab
     */
    createTab(componentItem, index) {
        //If there's already a tab relating to the
        //content item, don't do anything
        for (let i = 0; i < this._tabs.length; i++) {
            if (this._tabs[i].componentItem === componentItem) {
                return;
            }
        }
        const tab = new Tab(this._layoutManager, componentItem, (item) => this.handleTabCloseEvent(item), (item) => this.handleTabFocusEvent(item), (x, y, dragListener, item) => this.handleTabDragStartEvent(x, y, dragListener, item));
        if (index === undefined) {
            index = this._tabs.length;
        }
        this.markAsSingle(this._tabs.length == 0);
        this._tabs.splice(index, 0, tab);
        if (index < this._element.childNodes.length) {
            this._element.insertBefore(tab.element, this._element.childNodes[index]);
        }
        else {
            this._element.appendChild(tab.element);
        }
    }
    /** @internal */
    markAsSingle(is_single) {
        var _a, _b;
        const stackNode = (_b = (_a = this.element) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode;
        if (is_single) {
            stackNode.classList.add("lm_single");
        }
        else {
            stackNode.classList.remove("lm_single");
        }
    }
    removeTab(componentItem) {
        // componentItem cannot be ActiveComponentItem
        for (let i = 0; i < this._tabs.length; i++) {
            if (this._tabs[i].componentItem === componentItem) {
                const tab = this._tabs[i];
                tab.destroy();
                this._layoutManager.deferIfDragging((cancel) => {
                    if (!cancel) {
                        this._tabs.splice(i, 1);
                        if (this._tabs.length <= 1)
                            this.markAsSingle(true);
                        if (i <= this._lastVisibleTabIndex)
                            --this._lastVisibleTabIndex;
                    }
                });
                return;
            }
        }
        throw new Error('contentItem is not controlled by this header');
    }
    processActiveComponentChanged(newActiveComponentItem) {
        let activeIndex = -1;
        for (let i = 0; i < this._tabs.length; i++) {
            const isActive = this._tabs[i].componentItem === newActiveComponentItem;
            this._tabs[i].setActive(isActive);
            if (isActive) {
                activeIndex = i;
            }
        }
        if (activeIndex < 0) {
            throw new AssertError('HSACI56632');
        }
        else {
            if (this._layoutManager.layoutConfig.settings.reorderOnTabMenuClick) {
                /**
                 * If the tab selected was in the dropdown, move everything down one to make way for this one to be the first.
                 * This will make sure the most used tabs stay visible.
                 */
                if (this._lastVisibleTabIndex !== -1 && activeIndex > this._lastVisibleTabIndex) {
                    const activeTab = this._tabs[activeIndex];
                    for (let j = activeIndex; j > 0; j--) {
                        this._tabs[j] = this._tabs[j - 1];
                    }
                    this._tabs[0] = activeTab;
                    // updateTabSizes will always be called after this and it will reposition tab elements
                }
            }
        }
    }
    /**
     * Pushes the tabs to the tab dropdown if the available space is not sufficient
     */
    updateTabSizes(header, activeComponentItem) {
        let dropDownActive = false;
        const success = this.tryUpdateTabSizes(dropDownActive, header, activeComponentItem);
        if (!success) {
            dropDownActive = true;
            // this will always succeed
            this.tryUpdateTabSizes(dropDownActive, header, activeComponentItem);
        }
        if (dropDownActive !== this._dropdownActive) {
            this._dropdownActive = dropDownActive;
            this._dropdownActiveChangedEvent();
        }
    }
    tryUpdateTabSizes(dropdownActive, header, activeComponentItem) {
        const headerNode = this.element.parentNode;
        headerNode.classList.remove("lm_tight_mode");
        let availableWidth = header.availableTabsSize();
        this.element.style.width = ''; //numberToPixels(availableWidth);
        if (this._tabs.length > 0) {
            if (activeComponentItem === undefined) {
                throw new Error('non-empty tabs must have active component item');
            }
            let cumulativeTabWidth = 0;
            const tabOverlapAllowance = this._layoutManager.layoutConfig.settings.tabOverlapAllowance || (dropdownActive ? 6 : 0);
            const activeIndex = this._tabs.indexOf(activeComponentItem.tab);
            const activeTab = this._tabs[activeIndex];
            while (dropdownActive && this._dropdownElement.firstChild) {
                this._dropdownElement.removeChild(this._dropdownElement.firstChild);
            }
            const tabMarginRightPixels = getComputedStyle(activeTab.element).marginRight;
            const tabMarginRight = pixelsToNumber(tabMarginRightPixels);
            let tabAvail, activeTabAvail;
            const numTabs = this._tabs.length;
            if (!dropdownActive || numTabs <= 1) {
                tabAvail = availableWidth - tabMarginRight;
                activeTabAvail = tabAvail;
            }
            else {
                // the active tab gets a double share of the available width.
                tabAvail = (availableWidth - numTabs * tabMarginRight)
                    / (numTabs + 1);
                activeTabAvail = 2 * tabAvail;
            }
            let tight_mode = false;
            this._lastVisibleTabIndex = numTabs - 1;
            for (let i = 0; i < numTabs; i++) {
                const tab = this._tabs[i];
                const tabElement = tab.element;
                const isActiveTab = activeIndex === i;
                tabElement.style.marginLeft = '';
                tabElement.style.zIndex = '';
                const component = tab.componentItem;
                const renderer = (container, el, width, flags) => {
                    if (component.titleRenderer) {
                        component.titleRenderer(container, el, width, flags);
                    }
                    else {
                        while (el.lastChild) {
                            el.removeChild(el.lastChild);
                        }
                        el.appendChild(document.createTextNode(component.title));
                    }
                };
                //Put the tab in the tabContainer so its true width can be checked
                if (tabElement.parentElement !== this._element) {
                    this._element.appendChild(tabElement);
                }
                renderer(component.container, tab.titleElement, isActiveTab ? activeTabAvail : tabAvail, (isActiveTab ? Tab.RenderFlags.IsActiveTab : 0) |
                    (dropdownActive ? Tab.RenderFlags.DropdownActive : 0));
                cumulativeTabWidth = tabElement.offsetLeft - this._element.offsetLeft + tabElement.offsetWidth + tabMarginRight;
                if (dropdownActive) {
                    const el = document.createElement('span');
                    el.classList.add("lm_title" /* DomConstants.ClassName.Title */);
                    const w = availableWidth * 0.9;
                    renderer(component.container, el, w, (isActiveTab ? Tab.RenderFlags.IsActiveTab : 0) |
                        Tab.RenderFlags.DropdownActive |
                        Tab.RenderFlags.InDropdownMenu);
                    this._dropdownElement.appendChild(el);
                    el === null || el === void 0 ? void 0 : el.addEventListener('click', tab.tabClickListener, { passive: true });
                }
                if (cumulativeTabWidth > availableWidth && numTabs > 1
                    && !tight_mode) {
                    tight_mode = true;
                    headerNode.classList.add("lm_tight_mode");
                    // If tight-mode makes the controls (header buttons)
                    // take less space, we should have more available space.
                    availableWidth = header.availableTabsSize();
                    this.element.style.width = numberToPixels(availableWidth);
                    cumulativeTabWidth = tabElement.offsetLeft - this._element.offsetLeft + tabElement.offsetWidth + tabMarginRight;
                }
            }
            if (cumulativeTabWidth > availableWidth) {
                if (numTabs <= 1) {
                    return false;
                }
                let overlap = (cumulativeTabWidth - availableWidth)
                    / (numTabs - 1);
                //Check overlap against allowance.
                if (overlap >= tabOverlapAllowance) {
                    if (!dropdownActive) {
                        //We now know the tab menu must be shown, so we have to recalculate everything.
                        return false;
                    }
                    overlap = tabOverlapAllowance;
                }
                for (let j = 0; j < numTabs; j++) {
                    const marginLeft = j === 0 ? ''
                        : '-' + numberToPixels(overlap);
                    this._tabs[j].element.style.zIndex =
                        '' + ((j <= activeIndex ? j - activeIndex
                            : activeIndex - j) + numTabs);
                    this._tabs[j].element.style.marginLeft = marginLeft;
                }
                const activeElement = activeTab.element;
                if (activeElement.offsetLeft + activeElement.clientWidth
                    > availableWidth) {
                    if (!dropdownActive)
                        return false;
                    if (activeIndex > 0) {
                        // If active tab isn't fully visible, shift it and
                        // earlier elements left as needed (and possible)
                        const maxPrior = Math.max((availableWidth - activeElement.clientWidth) / activeIndex, 0);
                        for (let j = 1; j <= activeIndex; j++) {
                            const rightExcess = this._tabs[j].element.offsetLeft - j * maxPrior;
                            if (rightExcess > 0) {
                                this._tabs[j].element.style.marginLeft = '-' + numberToPixels(overlap + rightExcess);
                            }
                        }
                    }
                }
                this._lastVisibleTabIndex = activeIndex;
                for (let j = activeIndex + 1; j < numTabs; j++) {
                    const tabElement = this._tabs[j].element;
                    if (tabElement.offsetLeft + tabElement.offsetWidth
                        > availableWidth + tabOverlapAllowance)
                        break;
                    this._lastVisibleTabIndex = j;
                }
            }
        }
        return true;
    }
    /**
     * Shows drop down for additional tabs when there are too many to display.
     */
    showAdditionalTabsDropdown() {
        this._dropdownElement.style.display = '';
    }
    /**
     * Hides drop down for additional tabs when there are too many to display.
     */
    hideAdditionalTabsDropdown() {
        this._dropdownElement.style.display = 'none';
    }
    handleTabCloseEvent(componentItem) {
        this._componentRemoveEvent(componentItem);
    }
    handleTabFocusEvent(componentItem) {
        this._componentFocusEvent(componentItem);
    }
    handleTabDragStartEvent(x, y, dragListener, componentItem) {
        this._componentDragStartEvent(x, y, dragListener, componentItem);
    }
}
//# sourceMappingURL=tabs-container.js.map
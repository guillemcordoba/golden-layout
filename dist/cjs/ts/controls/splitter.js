"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Splitter = void 0;
const drag_listener_1 = require("../utils/drag-listener");
const utils_1 = require("../utils/utils");
/** @internal */
class Splitter {
    get element() { return this._element; }
    get dragHandleElement() { return this._dragHandleElement; }
    get backgroundElement() { return this._backgroundElement; }
    get dragHandleOffset() { return this._dragHandleOffset; }
    constructor(_isVertical, _size, grabSize) {
        this._isVertical = _isVertical;
        this._size = _size;
        this._grabSize = grabSize < this._size ? this._size : grabSize;
        this._element = document.createElement('div');
        this._element.classList.add("lm_splitter" /* DomConstants.ClassName.Splitter */);
        this._backgroundElement = document.createElement('div');
        const dragHandleElement = document.createElement('div');
        this._dragHandleElement = dragHandleElement;
        dragHandleElement.classList.add("lm_drag_handle" /* DomConstants.ClassName.DragHandle */);
        this._backgroundElement.classList.add("lm_bg" /* DomConstants.ClassName.Bg */);
        this._element.setAttribute('draggable', 'true');
        const handleExcessSize = this._grabSize - this._size;
        const handleExcessPos = handleExcessSize / 2;
        this._dragHandleOffset = handleExcessPos;
        const padding = (0, utils_1.numberToPixels)(handleExcessPos);
        if (this._isVertical) {
            dragHandleElement.style.top = `${-handleExcessPos}px`;
            dragHandleElement.style.paddingTop = padding;
            dragHandleElement.style.paddingBottom = padding;
            dragHandleElement.style.height = (0, utils_1.numberToPixels)(this._size);
            this._backgroundElement.style.top = `${-handleExcessPos}px`;
            this._backgroundElement.style.height = `${this._grabSize}px`;
            this._element.classList.add("lm_vertical" /* DomConstants.ClassName.Vertical */);
            this._element.style.height = (0, utils_1.numberToPixels)(this._size);
        }
        else {
            dragHandleElement.style.left = `${-handleExcessPos}px`;
            dragHandleElement.style.paddingLeft = padding;
            dragHandleElement.style.paddingRight = padding;
            dragHandleElement.style.width = (0, utils_1.numberToPixels)(this._size);
            this._backgroundElement.style.left = `${-handleExcessPos}px`;
            this._backgroundElement.style.width = `${this._grabSize}px`;
            this._element.classList.add("lm_horizontal" /* DomConstants.ClassName.Horizontal */);
            this._element.style.width = (0, utils_1.numberToPixels)(this._size);
        }
        this._element.appendChild(this._backgroundElement);
        this._element.appendChild(dragHandleElement);
        this._dragListener = new drag_listener_1.DragListener(this._element);
    }
    destroy() {
        this._element.remove();
    }
    on(eventName, callback) {
        this._dragListener.on(eventName, callback);
    }
}
exports.Splitter = Splitter;
//# sourceMappingURL=splitter.js.map
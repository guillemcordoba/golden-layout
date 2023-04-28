import { numberToPixels, setElementDisplayVisibility } from '../utils/utils';
/** @internal */
export class DropTargetIndicator {
    constructor(parent = document.body, before = null) {
        // Maybe use container instead of Document Body?
        this._element = document.createElement('div');
        this._element.classList.add("lm_dropTargetIndicator" /* DomConstants.ClassName.DropTargetIndicator */);
        const innerElement = document.createElement('div');
        innerElement.classList.add("lm_inner" /* DomConstants.ClassName.Inner */);
        this._element.appendChild(innerElement);
        parent.insertBefore(this._element, before);
    }
    destroy() {
        this._element.remove();
    }
    highlightArea(area, margin) {
        this._element.style.left = numberToPixels(area.x1 + margin);
        this._element.style.top = numberToPixels(area.y1 + margin);
        this._element.style.width = numberToPixels(area.x2 - area.x1 - margin);
        this._element.style.height = numberToPixels(area.y2 - area.y1 - margin);
        this._element.style.display = 'block';
    }
    hide() {
        setElementDisplayVisibility(this._element, false);
    }
}
//# sourceMappingURL=drop-target-indicator.js.map
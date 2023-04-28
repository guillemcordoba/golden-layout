import { EventEmitter } from './event-emitter';
import { enableIFramePointerEvents } from './utils';
/** @internal */
export class DragListener extends EventEmitter {
    constructor(_eElement) {
        super();
        this._eElement = _eElement;
        this._pointerTracking = false;
        this._pointerDownEventListener = (ev) => this.onPointerDown(ev);
        this._pointerMoveEventListener = (ev) => this.onPointerMove(ev);
        this._pointerUpEventListener = (ev) => this.onPointerUp(ev);
        this._timeout = undefined;
        this._oDocument = document;
        this._eBody = document.body;
        /**
         * The delay after which to start the drag in milliseconds
         * Do NOT make too short (previous value of 200 was not long enough for my touchpad)
         * Should generally rely on the mouse move to start drag.  Not this delay.
         */
        this._nDelay = 1800;
        /**
         * The distance the mouse needs to be moved to qualify as a drag
         * Previous comment: works better with delay only
         * ???
         * Probably somehow needs tuning for different devices
         */
        this._nDistance = 10;
        this._nX = 0;
        this._nY = 0;
        this._nOriginalX = 0;
        this._nOriginalY = 0;
        this._dragging = false;
        this._eElement.addEventListener('pointerdown', this._pointerDownEventListener, { passive: true });
    }
    destroy() {
        this.checkRemovePointerTrackingEventListeners();
        this._eElement.removeEventListener('pointerdown', this._pointerDownEventListener);
    }
    cancelDrag() {
        this.processDragStop(undefined);
    }
    onPointerDown(oEvent) {
        for (let target = oEvent.target;; target = target.parentNode) {
            if (!(target instanceof HTMLElement))
                return;
            const draggable = target.getAttribute('draggable');
            if (draggable === 'true')
                break;
            if (draggable !== null)
                return;
        }
        this.processPointerDown(this.getPointerCoordinates(oEvent));
    }
    processPointerDown(coordinates) {
        this._nOriginalX = coordinates.x;
        this._nOriginalY = coordinates.y;
        this._oDocument.addEventListener('pointermove', this._pointerMoveEventListener);
        this._oDocument.addEventListener('pointerup', this._pointerUpEventListener, { passive: true });
        this._pointerTracking = true;
        this._timeout = setTimeout(() => {
            try {
                this.startDrag();
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        }, this._nDelay);
    }
    onPointerMove(oEvent) {
        if (this._pointerTracking) {
            this.processDragMove(oEvent);
            oEvent.preventDefault();
        }
    }
    processDragMove(dragEvent) {
        this._nX = dragEvent.pageX - this._nOriginalX;
        this._nY = dragEvent.pageY - this._nOriginalY;
        if (this._dragging === false) {
            if (Math.abs(this._nX) > this._nDistance ||
                Math.abs(this._nY) > this._nDistance) {
                this.startDrag();
            }
        }
        if (this._dragging) {
            this.emit('drag', this._nX, this._nY, dragEvent);
        }
    }
    onPointerUp(oEvent) {
        this.processDragStop(oEvent);
    }
    processDragStop(dragEvent) {
        if (this._timeout !== undefined) {
            clearTimeout(this._timeout);
            this._timeout = undefined;
        }
        this.checkRemovePointerTrackingEventListeners();
        if (this._dragging === true) {
            this._eBody.classList.remove("lm_dragging" /* DomConstants.ClassName.Dragging */);
            this._eElement.classList.remove("lm_dragging" /* DomConstants.ClassName.Dragging */);
            enableIFramePointerEvents(true);
            this._dragging = false;
            this.emit('dragStop', dragEvent);
        }
    }
    checkRemovePointerTrackingEventListeners() {
        if (this._pointerTracking) {
            this._oDocument.removeEventListener('pointermove', this._pointerMoveEventListener);
            this._oDocument.removeEventListener('pointerup', this._pointerUpEventListener);
            this._pointerTracking = false;
        }
    }
    startDrag() {
        if (this._timeout !== undefined) {
            clearTimeout(this._timeout);
            this._timeout = undefined;
        }
        this._dragging = true;
        this._eBody.classList.add("lm_dragging" /* DomConstants.ClassName.Dragging */);
        this._eElement.classList.add("lm_dragging" /* DomConstants.ClassName.Dragging */);
        enableIFramePointerEvents(false);
        this.emit('dragStart', this._nOriginalX, this._nOriginalY);
    }
    getPointerCoordinates(event) {
        const result = {
            x: event.pageX,
            y: event.pageY
        };
        return result;
    }
}
//# sourceMappingURL=drag-listener.js.map
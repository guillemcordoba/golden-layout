import { AreaLinkedRect } from '../utils/types';
/** @internal */
export declare class DropTargetIndicator {
    private _element;
    constructor(parent?: HTMLElement, before?: Node | null);
    destroy(): void;
    highlightArea(area: AreaLinkedRect, margin: number): void;
    hide(): void;
}
//# sourceMappingURL=drop-target-indicator.d.ts.map
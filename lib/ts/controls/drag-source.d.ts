import { ComponentItemConfig as ConfigComponentItemConfig } from "../config/config";
import { LayoutManager } from "../layout-manager";
import { JsonValue } from "../utils/types";
/**
 * Allows for any DOM item to create a component on drag
 * start to be dragged into the Layout
 * @public
 */
export declare class DragSource {
    /** @internal */
    private _layoutManager;
    /** @internal */
    private readonly _element;
    /** @internal */
    private readonly _extraAllowableChildTargets;
    /** @internal @deprecated replace with componentItemConfigOrFtn in version 3 */
    private _componentTypeOrFtn;
    /** @internal @deprecated remove in version 3 */
    private _componentState;
    /** @internal @deprecated remove in version 3 */
    private _title;
    /** @internal @deprecated remove in version 3 */
    private _id;
    /** @internal */
    private readonly _rootContainer?;
    /** @internal */
    private _dragListener;
    /** @internal */
    private _dummyGroundContainer;
    /** @internal */
    private _dummyGroundContentItem;
    /** @internal */
    constructor(
    /** @internal */
    _layoutManager: LayoutManager, 
    /** @internal */
    _element: HTMLElement, 
    /** @internal */
    _extraAllowableChildTargets: HTMLElement[], 
    /** @internal @deprecated replace with componentItemConfigOrFtn in version 3 */
    _componentTypeOrFtn: JsonValue | (() => DragSource.ComponentItemConfig | ConfigComponentItemConfig), 
    /** @internal @deprecated remove in version 3 */
    _componentState: JsonValue | undefined, 
    /** @internal @deprecated remove in version 3 */
    _title: string | undefined, 
    /** @internal @deprecated remove in version 3 */
    _id: string | undefined, 
    /** @internal */
    _rootContainer?: HTMLElement | undefined);
    /**
     * Disposes of the drag listeners so the drag source is not usable any more.
     * @internal
     */
    destroy(): void;
    /**
     * Called initially and after every drag
     * @internal
     */
    private createDragListener;
    /**
     * Callback for the DragListener's dragStart event
     *
     * @param x - The x position of the mouse on dragStart
     * @param y - The x position of the mouse on dragStart
     * @internal
     */
    private onDragStart;
    /** @internal */
    private onDragStop;
    /**
     * Called after every drag and when the drag source is being disposed of.
     * @internal
     */
    private removeDragListener;
}
/** @public */
export declare namespace DragSource {
    /** @deprecated  use Config {@link (ComponentItemConfig:interface)} */
    interface ComponentItemConfig {
        type: JsonValue;
        state?: JsonValue;
        title?: string;
    }
    /** @deprecated remove in version 3 */
    function isDragSourceComponentItemConfig(config: DragSource.ComponentItemConfig | ConfigComponentItemConfig): config is DragSource.ComponentItemConfig;
}
//# sourceMappingURL=drag-source.d.ts.map
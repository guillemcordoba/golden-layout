/** @internal */
export declare type WidthOrHeightPropertyName = 'width' | 'height';
/** @internal */
export declare namespace WidthOrHeightPropertyName {
    const width = "width";
    const height = "height";
}
/** @internal */
export interface WidthAndHeight {
    width: number;
    height: number;
}
/** @internal */
export interface LeftAndTop {
    left: number;
    top: number;
}
/** @public */
export declare type Side = 'top' | 'left' | 'right' | 'bottom';
/** @public */
export declare namespace Side {
    const top = "top";
    const left = "left";
    const right = "right";
    const bottom = "bottom";
}
/** @public */
export declare type LogicalZIndex = 'base' | 'drag' | 'stackMaximised';
/** @public */
export declare namespace LogicalZIndex {
    const base = "base";
    const drag = "drag";
    const stackMaximised = "stackMaximised";
}
/** @public */
export declare const LogicalZIndexToDefaultMap: {
    base: string;
    drag: string;
    stackMaximised: string;
};
/** @internal */
export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}
/** @internal */
export interface AreaLinkedRect {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}
/** @public */
export declare type JsonValue = string | number | boolean | null | Json | object | JsonValueArray;
/** @public */
export interface Json {
    [name: string]: JsonValue;
}
/** @public */
export declare type JsonValueArray = Array<JsonValue>;
/** @public */
export declare namespace JsonValue {
    function isJson(value: JsonValue): value is Json;
    function isJsonObject(value: JsonValue): value is Json | object;
}
/** @public */
export declare type ItemType = 'ground' | 'row' | 'column' | 'stack' | 'component';
/** @public */
export declare namespace ItemType {
    const ground = "ground";
    const row = "row";
    const column = "column";
    const stack = "stack";
    const component = "component";
}
/** @public */
export declare type ResponsiveMode = 'none' | 'always' | 'onload';
/** @public */
export declare namespace ResponsiveMode {
    const none = "none";
    const always = "always";
    const onload = "onload";
}
/**
 * Length units which can specify the size of a Component Item
 * @public
 */
export declare type SizeUnit = 'px' | '%' | 'fr' | 'em';
/** @public */
export declare enum SizeUnitEnum {
    Pixel = "px",
    Percent = "%",
    Fractional = "fr",
    Em = "em"
}
/** @public */
export declare namespace SizeUnitEnum {
    function tryParse(value: string): SizeUnitEnum | undefined;
    function format(value: SizeUnitEnum): SizeUnitEnum;
}
//# sourceMappingURL=types.d.ts.map
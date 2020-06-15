import { Line, Mesh, Object3D, Points } from "three";

export function hasMaterial(object: Object3D): object is Mesh | Line | Points {
    return (object as Mesh | Line | Points).material !== undefined;
}
export function isTouchEvent(
    event: TouchEvent | MouseEvent
): event is TouchEvent {
    const e = event as TouchEvent;
    return (
        e.touches !== undefined &&
        e.touches.length > 0 &&
        e.touches[0] != undefined
    );
}

export function getRelativeCoordinates(
    e: TouchEvent | MouseEvent,
    container: HTMLDivElement
): { x: number; y: number } {
    const pos = { x: 0, y: 0 };
    const offset = { left: 0, top: 0 };
    let ref;

    ref = container.offsetParent;

    pos.x = isTouchEvent(e) ? e.touches[0].pageX : e.pageX;
    pos.y = isTouchEvent(e) ? e.touches[0].pageY : e.pageY;

    offset.left = container.offsetLeft;
    offset.top = container.offsetTop;

    while (ref) {
        offset.left += ref.offsetLeft;
        offset.top += ref.offsetTop;
        ref = (ref as any).offsetParent;
    }

    return {
        x: pos.x - offset.left,
        y: pos.y - offset.top,
    };
}

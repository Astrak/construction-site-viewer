import { TweenLite } from "gsap";
import { Viewer } from "../app/Viewer";
import { getRelativeCoordinates } from "../utils";
import { Button } from "./Button";
import "./Zoomer.css";

export class Zoomer {
    domElement = document.createElement("div");
    interactionBox = document.createElement("div");
    indicator = document.createElement("div");
    currentTween: null | any = null;
    mousedown: boolean = false;
    constructor(public viewer: Viewer, public container: HTMLDivElement) {
        this.domElement.id = "ui-zoomer";

        const zoomIn = new Button(
            "<img width=24 src='public/img/zoom-in.svg'/>"
        );
        zoomIn.domElement.addEventListener(
            "click",
            this.zoomIn.bind(this),
            false
        );
        this.domElement.appendChild(zoomIn.domElement);

        this.interactionBox.id = "ui-zoomer-box";
        this.interactionBox.addEventListener(
            "click",
            this.setZoom.bind(this),
            false
        );
        this.interactionBox.addEventListener(
            "mousedown",
            this.onMouseDown.bind(this),
            false
        );
        this.interactionBox.addEventListener(
            "touchstart",
            this.onMouseDown.bind(this),
            false
        );
        window.addEventListener(
            "mousemove",
            this.onMouseMove.bind(this),
            false
        );
        window.addEventListener(
            "touchmove",
            this.onMouseMove.bind(this),
            false
        );
        window.addEventListener("mouseup", this.onMouseUp.bind(this), false);
        window.addEventListener("touchend", this.onMouseUp.bind(this), false);
        this.domElement.appendChild(this.interactionBox);

        for (let i = 0; i < 9; i++) {
            const zoomLevel = document.createElement("span");
            zoomLevel.className = "ui-zoomer-level";
            zoomLevel.style.top = (i * 90) / 8 + 5 + "%";
            this.interactionBox.appendChild(zoomLevel);
        }

        const zoomOut = new Button(
            "<img width=24 src='public/img/zoom-out.svg'/>"
        );
        zoomOut.domElement.style.display = "block";
        zoomOut.domElement.style.position = "absolute";
        zoomOut.domElement.style.bottom = "0";
        zoomOut.domElement.addEventListener(
            "click",
            this.zoomOut.bind(this),
            false
        );
        this.domElement.appendChild(zoomOut.domElement);

        this.indicator.id = "ui-zoom-indicator";
        this.interactionBox.appendChild(this.indicator);

        this.currentTween = null;
    }

    onMouseDown() {
        this.mousedown = true;
    }

    onMouseMove(e: TouchEvent | MouseEvent) {
        if (!this.mousedown) {
            return;
        }

        const y = Math.min(
            1,
            Math.max(
                0,
                getRelativeCoordinates(e, this.interactionBox).y /
                    // tslint:disable-next-line: radix
                    parseInt(getComputedStyle(this.interactionBox, null).height)
            )
        );

        const nextZoomDistance = y * (23 - 3.5) + 3.5;

        this.viewer.renderer.cameraDistance = nextZoomDistance;
        this.viewer.controls.minDistance = nextZoomDistance;
        this.viewer.controls.maxDistance = nextZoomDistance;
    }

    onMouseUp() {
        this.viewer.renderer.cameraDistance = null;
        this.viewer.controls.minDistance = 3.5;
        this.viewer.controls.maxDistance = 23;

        this.mousedown = false;
    }

    update() {
        const currentZoomScale =
            (this.getCurrentZoomDistance() - 3.5) / (23 - 3.5);

        this.indicator.style.top = currentZoomScale * 100 + "%";
    }

    getCurrentZoomDistance() {
        return this.viewer.camera.position
            .clone()
            .sub(this.viewer.controls.target)
            .length();
    }

    show() {
        this.container.appendChild(this.domElement);
    }

    setZoom(e: TouchEvent | MouseEvent) {
        const y = Math.min(
            1,
            Math.max(
                0,
                getRelativeCoordinates(e, this.interactionBox).y /
                    // tslint:disable-next-line: radix
                    parseInt(getComputedStyle(this.interactionBox, null).height)
            )
        );

        const nextZoomDistance = y * (23 - 3.5) + 3.5;

        const currentZoomDistance = this.getCurrentZoomDistance();

        this.zoomFromTo(currentZoomDistance, nextZoomDistance);
    }

    zoomFromTo(currentZoomDistance: number, nextZoomDistance: number) {
        const tween = { distance: currentZoomDistance };

        if (this.currentTween) {
            this.currentTween.kill();
        }

        this.currentTween = TweenLite.to(tween, 1, {
            distance: nextZoomDistance,
            onUpdate() {
                this.viewer.controls.minDistance = tween.distance;
                this.viewer.controls.maxDistance = tween.distance;
                this.viewer.camera.update = true;
            },
            onComplete() {
                this.viewer.controls.minDistance = 3.5;
                this.viewer.controls.maxDistance = 23;
            },
        });
    }

    zoomIn() {
        const currentZoomDistance = this.getCurrentZoomDistance();

        const nextZoomDistance = Math.max(currentZoomDistance ** 0.85, 3.5);

        this.zoomFromTo(currentZoomDistance, nextZoomDistance);
    }

    zoomOut() {
        const currentZoomDistance = this.getCurrentZoomDistance();

        const nextZoomDistance = Math.min(currentZoomDistance ** 1.15, 23);

        this.zoomFromTo(currentZoomDistance, nextZoomDistance);
    }
}

import { TweenLite } from "gsap";
import Button from "./Button.js";

import "./Zoomer.css";

export default class Zoomer {
    constructor(viewer, container) {
        this.container = container;
        this.viewer = viewer;

        this.domElement = document.createElement("div");
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

        this.interactionBox = document.createElement("div");
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

        this.indicator = document.createElement("div");
        this.indicator.id = "ui-zoom-indicator";
        this.interactionBox.appendChild(this.indicator);

        this.currentTween = null;
    }

    onMouseDown() {
        this.mousedown = true;
    }

    onMouseMove(e) {
        if (!this.mousedown) return;

        const y = Math.min(
            1,
            Math.max(
                0,
                getRelativeCoordinates(e, this.interactionBox).y /
                    parseInt(getComputedStyle(this.interactionBox, null).height)
            )
        );

        const nextZoomDistance = y * (23 - 3.5) + 3.5;

        this.viewer.renderer.cameraDistance = nextZoomDistance;
        this.viewer.controls.minDistance = this.viewer.controls.maxDistance = nextZoomDistance;
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

    setZoom(e) {
        const y = Math.min(
            1,
            Math.max(
                0,
                getRelativeCoordinates(e, this.interactionBox).y /
                    parseInt(getComputedStyle(this.interactionBox, null).height)
            )
        );

        const nextZoomDistance = y * (23 - 3.5) + 3.5;

        const currentZoomDistance = this.getCurrentZoomDistance();

        this.zoomFromTo(currentZoomDistance, nextZoomDistance);
    }

    zoomFromTo(currentZoomDistance, nextZoomDistance) {
        const that = this;

        const tween = { distance: currentZoomDistance };

        if (this.currentTween) this.currentTween.kill();

        this.currentTween = TweenLite.to(tween, 1, {
            distance: nextZoomDistance,
            onUpdate() {
                that.viewer.controls.minDistance = that.viewer.controls.maxDistance =
                    tween.distance;
                that.viewer.camera.update = true;
            },
            onComplete() {
                that.viewer.controls.minDistance = 3.5;
                that.viewer.controls.maxDistance = 23;
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

function getRelativeCoordinates(e, container) {
    var pos = {},
        offset = {},
        ref;

    ref = container.offsetParent;

    pos.x = !!e.touches ? e.touches[0].pageX : e.pageX;
    pos.y = !!e.touches ? e.touches[0].pageY : e.pageY;

    offset.left = container.offsetLeft;
    offset.top = container.offsetTop;

    while (ref) {
        offset.left += ref.offsetLeft;
        offset.top += ref.offsetTop;

        ref = ref.offsetParent;
    }

    return {
        x: pos.x - offset.left,
        y: pos.y - offset.top,
    };
}

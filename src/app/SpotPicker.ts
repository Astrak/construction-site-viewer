import { EventEmitter } from "events";
import { TweenLite } from "gsap";
import { Group, PerspectiveCamera, Raycaster, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { state } from "../store";
import { isTouchEvent } from "../utils";
import { Hotspot } from "./Hotspot";

export class SpotPicker extends EventEmitter {
    raycaster = new Raycaster();
    constructor(
        public renderer: WebGLRenderer,
        public camera: PerspectiveCamera,
        public controls: OrbitControls,
        public hotspotsContainer: Group,
        public hotspots: Hotspot[]
    ) {
        super();
        renderer.domElement.addEventListener(
            "click",
            this.pick.bind(this),
            false
        );
    }

    pick(e: TouchEvent | MouseEvent) {
        const mouse = {
            x:
                (2 * (isTouchEvent(e) ? e.touches[0].pageX : e.pageX)) /
                    innerWidth -
                1,
            y:
                1 -
                ((isTouchEvent(e) ? e.touches[0].pageY : e.pageY) * 2) /
                    innerHeight,
        };

        this.raycaster.setFromCamera(mouse, this.camera);

        const intersections = this.raycaster.intersectObjects(
            this.hotspotsContainer.children
        );

        if (intersections[0] !== undefined) {
            this.navigateTo(intersections[0].object.name);
        }
    }

    navigateTo(place: string) {
        const sprite = this.hotspots.find(
            (hotspot) => hotspot.sprite.name === place
        )!.sprite;
        this.controls.enabled = false;
        const camera = this.camera;
        const controls = this.controls;

        // Tween controls' target
        TweenLite.to(controls.target, 2, {
            x: sprite.position.x,
            z: sprite.position.z,
            onUpdate() {
                state.updateCamera = true;
                camera.lookAt(controls.target);
            },
            onComplete() {
                controls.enabled = true;
            },
        });

        TweenLite.to(camera.position, 2, {
            x: sprite.userData.camera[0],
            y: sprite.userData.camera[1],
            z: sprite.userData.camera[2],
        });

        // Show/hide hotspots
        this.hotspots.forEach((hotspot) => {
            hotspot.sprite === sprite ? hotspot.hide() : hotspot.show();
        });

        this.emit("navigation", place);
    }
}

import { TweenLite } from "gsap";
import { Material } from "three";
import { Viewer } from "../app/Viewer.js";
import { MODES } from "../constants/modes";
import { hasMaterial } from "../utils";
import { Button } from "./Button";
import "./Modes.css";
import { Timeline } from "./Timeline.js";

export class Modes {
    domElement = document.createElement("div");
    animations: any[] = [];
    constructor(
        public viewer: Viewer,
        public timeline: Timeline,
        public activeModes: string[],
        public container: HTMLDivElement
    ) {
        this.viewer = viewer;
        this.timeline = timeline;
        this.container = container;
        this.activeModes = activeModes;

        this.domElement.style.marginTop =
            (-Object.keys(MODES).length * 39) / 2 + "px";
        this.domElement.id = "ui-modes";

        const modesButton: Button[] = [];

        // tslint:disable-next-line: forin
        for (const MODE in MODES) {
            const modeButton = new Button((MODES as any)[MODE]);
            modeButton.domElement.style.display = "block";
            modesButton.push(modeButton);
            this.domElement.appendChild(modeButton.domElement);

            modeButton.domElement.addEventListener(
                "click",
                () => {
                    if (this.animations.length > 0) {
                        this.animations.forEach((animation) =>
                            animation.kill()
                        );
                        this.animations = [];
                        this.activeModes.splice(0, 1);
                        this.timeline.setSceneContentToDate();
                    }
                    if (modeButton.selected) {
                        // unselect mode
                        modeButton.unselect();
                        this.hideObjectsInMode(MODE);
                    } else {
                        // select mode
                        modesButton.forEach(
                            (button) => button.unselect(),
                            false
                        ); // unselect other modes
                        modeButton.select();
                        const activeMode = activeModes[0];
                        this.hideObjectsInMode(activeMode);
                        this.showObjectsInMode(MODE);
                    }
                },
                false
            );
        }
    }

    show() {
        this.container.appendChild(this.domElement);
    }

    hideObjectsInMode(mode: string) {
        const disappear = { opacity: 0.7 };

        const anim = TweenLite.to(disappear, 1, {
            opacity: 0,
            onUpdate() {
                this.viewer.objectsList.forEach((object: any) => {
                    if (object.userData.mode === mode && hasMaterial(object)) {
                        (object.material as Material).opacity =
                            disappear.opacity;
                    }
                });
                this.viewer.camera.update = true;
            },
            onComplete() {
                const index = this.activeModes.indexOf(mode);
                this.activeModes.splice(index, 1);
                this.timeline.setSceneContentToDate();
                this.animations.splice(this.animations.indexOf(anim), 1);
            },
        });
        this.animations.push(anim);
    }

    showObjectsInMode(mode: string) {
        this.activeModes.push(mode);
        this.timeline.setSceneContentToDate();

        const appear = { opacity: 0 };

        const anim = TweenLite.to(appear, 1, {
            opacity: 0.7,
            onUpdate() {
                this.viewer.objectsList.forEach((object: any) => {
                    if (object.userData.mode === mode && hasMaterial(object)) {
                        (object.material as Material).opacity = appear.opacity;
                    }
                });
                this.viewer.camera.update = true;
            },
            onComplete() {
                this.animations.splice(this.animations.indexOf(anim), 1);
            },
        });
        this.animations.push(anim);
    }
}

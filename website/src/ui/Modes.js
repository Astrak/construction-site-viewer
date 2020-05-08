import { TweenLite } from "gsap";
import Button from "./Button.js";
import MODES from "./../constants/modes";

import "./Modes.css";

export default class Modes {
    constructor(viewer, timeline, activeModes, container) {
        const that = this;

        this.viewer = viewer;
        this.timeline = timeline;
        this.container = container;
        this.activeModes = activeModes;

        this.domElement = document.createElement("div");
        this.domElement.style.marginTop =
            (-Object.keys(MODES).length * 39) / 2 + "px";
        this.domElement.id = "ui-modes";

        this.animations = [];

        const modesButton = [];

        for (let MODE in MODES) {
            const modeButton = new Button(MODES[MODE]);
            modeButton.domElement.style.display = "block";
            modesButton.push(modeButton);
            this.domElement.appendChild(modeButton.domElement);

            modeButton.domElement.addEventListener(
                "click",
                () => {
                    if (this.animations.length) {
                        this.animations.forEach((animation) =>
                            animation.kill()
                        );
                        this.animations = [];
                        this.activeModes.splice(0, 1);
                        this.timeline.setSceneContentToDate();
                    }
                    if (modeButton.selected) {
                        //unselect mode
                        modeButton.unselect();
                        this.hideObjectsInMode(MODE);
                    } else {
                        //select mode
                        modesButton.forEach(
                            (button) => button.unselect(),
                            false
                        ); //unselect other modes
                        modeButton.select();
                        const activeMode = activeModes[0];
                        if (activeMode) this.hideObjectsInMode(activeMode);
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

    hideObjectsInMode(mode) {
        const that = this;

        const disappear = { opacity: 0.7 };

        let anim;
        anim = TweenLite.to(disappear, 1, {
            opacity: 0,
            onUpdate() {
                that.viewer.objectsList.forEach((object) => {
                    if (object.userData.mode === mode)
                        object.material.opacity = disappear.opacity;
                });
                that.viewer.camera.update = true;
            },
            onComplete() {
                const index = that.activeModes.indexOf(mode);
                that.activeModes.splice(index, 1);
                that.timeline.setSceneContentToDate();
                that.animations.splice(that.animations.indexOf(anim), 1);
            },
        });
        this.animations.push(anim);
    }

    showObjectsInMode(mode) {
        const that = this;

        that.activeModes.push(mode);
        that.timeline.setSceneContentToDate();

        const appear = { opacity: 0 };

        let anim;
        anim = TweenLite.to(appear, 1, {
            opacity: 0.7,
            onUpdate() {
                that.viewer.objectsList.forEach((object) => {
                    if (object.userData.mode === mode)
                        object.material.opacity = appear.opacity;
                });
                that.viewer.camera.update = true;
            },
            onComplete() {
                that.animations.splice(that.animations.indexOf(anim), 1);
            },
        });
        this.animations.push(anim);
    }
}

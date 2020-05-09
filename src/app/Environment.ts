import { TweenLite } from "gsap";
import {
    AmbientLight,
    DirectionalLight,
    Object3D,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import { Sky } from "three/examples/jsm/objects/Sky";

import { DAYTIMES, defaultDayTime } from "../constants/dayTimes";
import { state } from "../store";

export class Environment {
    targetDayTime: string = "day";
    activeDayTime: string = "day";
    meshAnimations: any[] = [];
    sun = new DirectionalLight(0xffffff, 1);
    ambient = new AmbientLight(0xaaaacc);
    sky = new Sky();
    actions: {
        makeMorning: () => void;
        makeDay: () => void;
        makeEvening: () => void;
    } = {
        // tslint:disable: no-empty
        makeMorning: () => {},
        makeDay: () => {},
        makeEvening: () => {},
        // tslint:enable: no-empty
    };
    constructor(
        renderer: WebGLRenderer,
        public scene: Scene,
        camera: PerspectiveCamera,
        setBasicMaterialsIntensity: (value: number) => void,
        objectsList: Object3D[]
    ) {
        this.setLighting();

        this.setSky();

        const sun = this.sun;
        const sky = this.sky;

        /* INTERACTION API */
        // tslint:disable-next-line: forin
        for (const dayTime in DAYTIMES) {
            (this.actions as any)[`make${dayTime}`] = () => {
                if (this.targetDayTime === dayTime) {
                    return;
                }

                this.targetDayTime = dayTime;

                // lighting + sky + shadow tween
                const mapSizeDuringTween = 1024;
                this.sun.shadow.mapSize.set(
                    mapSizeDuringTween,
                    mapSizeDuringTween
                );
                TweenLite.to(sun.position, 2, {
                    x: (DAYTIMES as any)[dayTime][0],
                    y: (DAYTIMES as any)[dayTime][1],
                    z: (DAYTIMES as any)[dayTime][2],
                    onUpdate() {
                        sky.material.uniforms.sunPosition.value.copy(
                            sun.position
                        );
                        state.updateCamera = true;
                        renderer.shadowMap.needsUpdate = true;
                    },
                    onComplete() {
                        this.sun.shadow.mapSize.set(4096, 4096);
                        state.updateCamera = true;
                        renderer.shadowMap.needsUpdate = true;
                    },
                });

                // basic materials tween
                const treesColorTween = { value: 0 };
                TweenLite.to(treesColorTween, 2, {
                    value: 1,
                    onUpdate() {
                        let v;
                        if (dayTime === "day") {
                            v = treesColorTween.value * 0.5 + 0.5;
                        } else if (this.activeDayTime === "day") {
                            v = (1 - treesColorTween.value) * 0.5 + 0.5;
                        } else {
                            v =
                                (1 - (2 * treesColorTween.value - 1) ** 2) *
                                    0.5 +
                                0.5;
                        }
                        setBasicMaterialsIntensity(v);
                    },
                    onComplete() {
                        this.activeDayTime = dayTime;
                    },
                });

                // daytimes meshes tween
                const bottomPosition = -0.8;
                const tweenHide = { height: 0 };
                const tweenShow = { height: bottomPosition };

                if (this.meshAnimations.length > 0) {
                    this.meshAnimations.forEach((animation) =>
                        animation.kill()
                    );
                    this.meshAnimations = [];
                    objectsList.forEach((object) => {
                        if (
                            object.userData.dayTime &&
                            object.userData.dayTime !== this.targetDayTime
                        ) {
                            object.position.y = bottomPosition;
                            object.updateMatrix();
                        }
                    });
                }

                const hideAnim = TweenLite.to(tweenHide, 1, {
                    height: bottomPosition,
                    onUpdate() {
                        objectsList.forEach((object) => {
                            if (
                                object.userData.dayTime &&
                                object.userData.dayTime === this.activeDayTime
                            ) {
                                object.position.y = tweenHide.height;
                                object.updateMatrix();
                            }
                        });
                    },
                    onComplete() {
                        this.meshAnimations.splice(
                            this.meshAnimations.indexOf(hideAnim),
                            1
                        );
                    },
                });
                this.meshAnimations.push(hideAnim);

                const showAnim = TweenLite.to(tweenShow, 1, {
                    height: 0,
                    onUpdate() {
                        objectsList.forEach((object) => {
                            if (
                                object.userData.dayTime &&
                                object.userData.dayTime === this.targetDayTime
                            ) {
                                object.position.y = tweenShow.height;
                                object.updateMatrix();
                            }
                        });
                    },
                    onComplete() {
                        this.meshAnimations.splice(
                            this.meshAnimations.indexOf(showAnim),
                            1
                        );
                    },
                });
                this.meshAnimations.push(showAnim);
            };
        }
    }

    setLighting() {
        this.sun.position.set(
            DAYTIMES[defaultDayTime][0],
            DAYTIMES[defaultDayTime][1],
            DAYTIMES[defaultDayTime][2]
        );
        Object.assign(this.sun.shadow.camera, {
            top: 35,
            left: -50,
            right: 30,
            bottom: -30,
            far: 200,
            near: 2,
        });
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.set(4096, 4096);
        // const helper = new CameraHelper(this.sun.shadow.camera);

        this.ambient.intensity = 0.4;

        this.scene.add(this.sun, this.ambient);
    }

    setSky() {
        this.sky.scale.setScalar(100);
        this.sky.name = "sky";
        this.sky.userData.waterMirrored = true;
        /* this.sky.sunSphere = new Object3D();
        this.sky.sunSphere.position.set(1, 1, 1); */
        this.sky.material.uniforms.sunPosition.value.copy(this.sun.position);
        this.scene.add(this.sky);
    }
}

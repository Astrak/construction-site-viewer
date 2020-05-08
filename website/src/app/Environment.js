import Sky from "./../lib/Skyr89";
import { Object3D, DirectionalLight, AmbientLight, CameraHelper } from "three";
import { TweenLite } from "gsap";

import { DAYTIMES, defaultDayTime } from "./../constants/dayTimes";

export default class Environment {
    constructor(
        renderer,
        scene,
        camera,
        setBasicMaterialsIntensity,
        objectsList
    ) {
        const that = this;

        this.scene = scene;

        this.setLighting();

        this.setSky();

        this.activeDayTime = "day";
        this.targetDayTime = "day";

        this.meshAnimations = [];

        const sun = this.sun,
            sky = this.sky;

        /* INTERACTION API */
        for (let dayTime in DAYTIMES) {
            this["make" + dayTime] = () => {
                if (that.targetDayTime === dayTime) return;

                that.targetDayTime = dayTime;

                //lighting + sky + shadow tween
                const mapSizeDuringTween = 1024;
                that.sun.shadow.mapSize.set(
                    mapSizeDuringTween,
                    mapSizeDuringTween
                );
                TweenLite.to(sun.position, 2, {
                    x: DAYTIMES[dayTime][0],
                    y: DAYTIMES[dayTime][1],
                    z: DAYTIMES[dayTime][2],
                    onUpdate() {
                        sky.material.uniforms.sunPosition.value.copy(
                            sun.position
                        );
                        camera.update = true;
                        renderer.shadowMap.needsUpdate = true;
                    },
                    onComplete() {
                        that.sun.shadow.mapSize.set(4096, 4096);
                        camera.update = true;
                        renderer.shadowMap.needsUpdate = true;
                    },
                });

                //basic materials tween
                const treesColorTween = { value: 0 };
                TweenLite.to(treesColorTween, 2, {
                    value: 1,
                    onUpdate() {
                        let v;
                        if (dayTime === "day")
                            v = treesColorTween.value * 0.5 + 0.5;
                        else if (that.activeDayTime === "day")
                            v = (1 - treesColorTween.value) * 0.5 + 0.5;
                        else
                            v =
                                (1 - (2 * treesColorTween.value - 1) ** 2) *
                                    0.5 +
                                0.5;
                        setBasicMaterialsIntensity(v);
                    },
                    onComplete() {
                        that.activeDayTime = dayTime;
                    },
                });

                //daytimes meshes tween
                const bottomPosition = -0.8,
                    tweenHide = { height: 0 },
                    tweenShow = { height: bottomPosition };

                if (that.meshAnimations.length) {
                    that.meshAnimations.forEach((animation) =>
                        animation.kill()
                    );
                    that.meshAnimations = [];
                    objectsList.forEach((object) => {
                        if (
                            object.userData.dayTime &&
                            object.userData.dayTime !== that.targetDayTime
                        ) {
                            object.position.y = bottomPosition;
                            object.updateMatrix();
                        }
                    });
                }

                let hideAnim;
                hideAnim = TweenLite.to(tweenHide, 1, {
                    height: bottomPosition,
                    onUpdate() {
                        objectsList.forEach((object) => {
                            if (
                                object.userData.dayTime &&
                                object.userData.dayTime === that.activeDayTime
                            ) {
                                object.position.y = tweenHide.height;
                                object.updateMatrix();
                            }
                        });
                    },
                    onComplete() {
                        that.meshAnimations.splice(
                            that.meshAnimations.indexOf(hideAnim),
                            1
                        );
                    },
                });
                that.meshAnimations.push(hideAnim);

                let showAnim;
                showAnim = TweenLite.to(tweenShow, 1, {
                    height: 0,
                    onUpdate() {
                        objectsList.forEach((object) => {
                            if (
                                object.userData.dayTime &&
                                object.userData.dayTime === that.targetDayTime
                            ) {
                                object.position.y = tweenShow.height;
                                object.updateMatrix();
                            }
                        });
                    },
                    onComplete() {
                        that.meshAnimations.splice(
                            that.meshAnimations.indexOf(showAnim),
                            1
                        );
                    },
                });
                that.meshAnimations.push(showAnim);
            };
        }
    }

    setLighting() {
        this.sun = new DirectionalLight(0xffffff, 1);
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
        const helper = new CameraHelper(this.sun.shadow.camera);

        this.ambient = new AmbientLight(0xaaaacc);
        this.ambient.intensity = 0.4;

        this.scene.add(this.sun, this.ambient);
    }

    setSky() {
        const sky = new Sky();
        sky.scale.setScalar(100);
        sky.name = "sky";
        sky.userData.waterMirrored = true;

        sky.sunSphere = new Object3D();
        sky.sunSphere.position.set(1, 1, 1);
        sky.material.uniforms.sunPosition.value.copy(this.sun.position);

        this.scene.add(sky);

        this.sky = sky;
    }
}

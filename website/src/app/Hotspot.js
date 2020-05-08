import TweenLite from "gsap";
import { Sprite, SpriteMaterial, TextureLoader } from "three";

export default class Hotspot {
    constructor(parent, crds, camera, name) {
        const that = this;
        const tLoader = new TextureLoader();

        this.sprite = new Sprite(
            new SpriteMaterial({
                transparent: true,
                opacity: 1,
                depthTest: false,
                depthWrite: false,
                map: tLoader.load("public/img/hotspot_hex.png"),
            })
        );
        this.scale = 1.3;
        this.sprite.name = name;
        //this.sprite.matrixAutoUpdate = false;
        this.sprite.scale.multiplyScalar(this.scale);
        this.sprite.position.set(crds[0], 1, crds[2]);
        this.sprite.matrixNeedsUpdate = true;
        this.sprite.userData.camera = camera;
        parent.add(this.sprite);

        this.hiding = false;
    }

    show() {
        if (!this.hiding) return;

        const that = this;

        const sprite = this.sprite;
        sprite.visible = true;
        sprite.material.opacity = 0;
        TweenLite.to(sprite.material, 1, {
            opacity: 1,
            onUpdate() {
                sprite.scale
                    .set(1, 1, 1)
                    .multiplyScalar(sprite.material.opacity * that.scale);
            },
            onComplete() {
                that.hiding = false;
            },
        });
    }

    hide() {
        const that = this;

        const sprite = this.sprite;
        sprite.visible = true;
        sprite.material.opacity = 1;

        const spriteScaleTween = { value: 0 };

        TweenLite.to(spriteScaleTween, 1, {
            value: 1,
            onUpdate() {
                sprite.scale
                    .set(1, 1, 1)
                    .multiplyScalar(that.scale * (1 - spriteScaleTween.value));
            },
        });

        TweenLite.to(sprite.material, 1, {
            opacity: 0,
            onComplete() {
                sprite.visible = false;
            },
        });

        this.hiding = true;
    }
}

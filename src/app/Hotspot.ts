import TweenLite from "gsap";
import {
    Group,
    PerspectiveCamera,
    Sprite,
    SpriteMaterial,
    TextureLoader,
} from "three";

export class Hotspot {
    sprite: Sprite;
    hiding: boolean = false;
    scale = 1.3;
    constructor(
        parent: Group,
        crds: [number, number, number],
        camera: PerspectiveCamera,
        name: string
    ) {
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
        this.sprite.name = name;
        this.sprite.scale.multiplyScalar(this.scale);
        this.sprite.position.set(crds[0], 1, crds[2]);
        this.sprite.userData.camera = camera;
        parent.add(this.sprite);
    }

    show() {
        if (!this.hiding) {
            return;
        }
        const sprite = this.sprite;
        sprite.visible = true;
        sprite.material.opacity = 0;
        TweenLite.to(sprite.material, 1, {
            opacity: 1,
            onUpdate() {
                sprite.scale
                    .set(1, 1, 1)
                    .multiplyScalar(sprite.material.opacity * this.scale);
            },
            onComplete() {
                this.hiding = false;
            },
        });
    }

    hide() {
        const sprite = this.sprite;
        sprite.visible = true;
        sprite.material.opacity = 1;

        const spriteScaleTween = { value: 0 };

        TweenLite.to(spriteScaleTween, 1, {
            value: 1,
            onUpdate() {
                sprite.scale
                    .set(1, 1, 1)
                    .multiplyScalar(this.scale * (1 - spriteScaleTween.value));
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

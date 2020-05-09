import { Group, Mesh, Object3D, PerspectiveCamera, Scene } from "three";
import { Environment } from "./Environment";
import { Hotspot } from "./Hotspot";
import { Loader } from "./Loader";
import { Renderer } from "./Renderer";
import { SpotPicker } from "./SpotPicker";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { HOTSPOTS } from "../constants/hotspots";
import { state } from "../store";

export class Viewer {
    userIsViewing: boolean = false;
    renderer: Renderer;
    scene: Scene = new Scene();
    camera: PerspectiveCamera = new PerspectiveCamera(
        50,
        innerWidth / innerHeight,
        0.1,
        1200
    );
    tweenedColorObjects: Mesh[] = [];
    objectsList: Object3D[] = [];
    controls: OrbitControls;
    environment: Environment;
    spotPicker: SpotPicker;
    loader: Loader;
    city = new Group();
    constructor() {
        this.renderer = new Renderer(this);
        this.camera.position.set(43, 4, 12);
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.renderer.domElement
        );
        Object.assign(this.controls, {
            enableDamping: true,
            rotateDampingFactor: 0.05,
            rotateSpeed: 0.017,
            panSpeed: 0.02,
            enablePan: false,
            minDistance: 4,
            maxDistance: 23,
            zoomSpeed: 0.12,
        });
        this.controls.addEventListener(
            "change",
            () => (state.updateCamera = true)
        );
        this.controls.target.set(35, 1, 17);

        this.renderer.setRendering(this.scene, this.camera, this.controls);

        const boundResize = this.resize.bind(this);
        window.addEventListener("resize", boundResize);

        // prepares renderer, interaction, environment
        this.buildScene();

        // render loop before assets load
        this.start();

        // start loading
        this.loader = new Loader(
            this.renderer,
            this.camera,
            this.city,
            this.objectsList,
            this.tweenedColorObjects
        );
        this.loader.start();
    }

    buildScene() {
        this.city.position.set(50, 0, 25);
        this.scene.add(this.city);
        this.environment = new Environment(
            this.renderer.renderer,
            this.scene,
            this.camera,
            this.setBasicMaterialsIntensity.bind(this),
            this.objectsList
        );

        const hotspotsGroup = new Group();
        this.scene.add(hotspotsGroup);
        const hotspotsArray = [];

        // tslint:disable-next-line: forin
        for (const place in HOTSPOTS) {
            hotspotsArray.push(
                new Hotspot(
                    hotspotsGroup,
                    (HOTSPOTS as any)[place].center,
                    (HOTSPOTS as any)[place].camera,
                    place
                )
            );
        }

        this.spotPicker = new SpotPicker(
            this.renderer.renderer,
            this.camera,
            this.controls,
            hotspotsGroup,
            hotspotsArray
        );
    }

    setBasicMaterialsIntensity(intensity: number) {
        this.tweenedColorObjects.forEach((object) =>
            (object.material as any).color.setRGB(
                intensity,
                intensity,
                intensity
            )
        );
    }

    addMode(mode: string) {
        this.objectsList.forEach((object) => {
            if (object.userData.mode === mode) {
                object.visible = true;
            }
        });
    }

    removeMode(mode: string) {
        this.objectsList.forEach((object) => {
            if (object.userData.mode === mode) {
                object.visible = false;
            }
        });
    }

    resize() {
        this.renderer.resize();
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
        state.updateCamera = true;
    }

    start() {
        this.renderer.animate();
    }
}

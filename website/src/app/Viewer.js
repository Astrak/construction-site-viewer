import { PerspectiveCamera, Scene, Group } from "three";

import Renderer from "./Renderer";
import Loader from "./Loader";
import Hotspot from "./Hotspot";
import SpotPicker from "./SpotPicker";
import Environment from "./Environment";

import OrbitControls from "./../lib/OrbitControlsr87-with-damping";

import HOTSPOTS from "./../constants/hotspots";

export default class Viewer {
    constructor() {
        this.userIsViewing = false;

        this.renderer = new Renderer(this);

        this.scene = new Scene();

        this.camera = new PerspectiveCamera(
            50,
            innerWidth / innerHeight,
            0.1,
            1200
        );
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
            () => (this.camera.update = true)
        );
        this.controls.target.set(35, 1, 17);

        this.renderer.setRendering(this.scene, this.camera, this.controls);

        window.addEventListener("resize", this.resize.bind(this));

        this.tweenedColorObjects = [];
        this.objectsList = [];

        //prepares renderer, interaction, environment
        this.buildScene();

        //render loop before assets load
        this.start();

        //start loading
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
        //root object
        const city = new Group();
        city.position.set(50, 0, 25);
        this.scene.add(city);
        this.city = city;
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

        for (let place in HOTSPOTS) {
            hotspotsArray.push(
                new Hotspot(
                    hotspotsGroup,
                    HOTSPOTS[place].center,
                    HOTSPOTS[place].camera,
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

    setBasicMaterialsIntensity(v) {
        this.tweenedColorObjects.forEach((object) =>
            object.material.color.setRGB(v, v, v)
        );
    }

    addMode(mode) {
        this.objectsList.forEach((object) => {
            if (object.userData.mode === mode) object.visible = true;
        });
    }

    removeMode(mode) {
        this.objectsList.forEach((object) => {
            if (object.userData.mode === mode) object.visible = false;
        });
    }

    resize() {
        this.renderer.resize();
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
        this.camera.update = true;
    }

    start() {
        this.renderer.animate();
    }
}

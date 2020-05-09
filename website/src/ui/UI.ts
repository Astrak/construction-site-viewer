import { Viewer } from "../app/Viewer";
import { Ambiancer } from "./Ambiancer";
import { ImageManager } from "./ImageManager";
import { Modes } from "./Modes";
import { SplashScreen } from "./SplashScreen";
import { Timeline } from "./Timeline";
import { Zoomer } from "./Zoomer";

import "./UI.css";

export class UI {
    wrapper = document.createElement("div");
    activeModes: string[] = [];
    container = document.createElement("div");
    verticalAligner = document.createElement("span");
    ambiancer: Ambiancer;
    timeline: Timeline;
    modes: Modes;
    zoomer: Zoomer;
    imageManager: ImageManager;
    splashScreen: SplashScreen;
    constructor(viewer: Viewer) {
        this.wrapper.id = "ui-wrapper";
        document.getElementById("app").appendChild(this.wrapper);

        this.container.id = "ui-container";
        this.wrapper.appendChild(this.container);

        this.verticalAligner.id = "ui-container-vertical-aligner";
        this.container.appendChild(this.verticalAligner);

        // Top : ambiancer (+ menu button)
        this.ambiancer = new Ambiancer(viewer, this.container);

        // Bottom : timeline
        this.timeline = new Timeline(viewer, this.activeModes, this.container);

        // Left : display modes
        this.modes = new Modes(
            viewer,
            this.timeline,
            this.activeModes,
            this.container
        );

        // Right: zoomer
        this.zoomer = new Zoomer(viewer, this.container);

        this.imageManager = new ImageManager(viewer, this.container);

        this.splashScreen = new SplashScreen(viewer, this.container);
        this.splashScreen.startCallBack = () => {
            viewer.userIsViewing = true;
            this.ambiancer.show();
            this.timeline.show();
            this.modes.show();
            this.zoomer.show();
            this.imageManager.show();
        };
        // tslint:disable-next-line: max-line-length
        this.splashScreen.playAudioSpecialCallBack = this.ambiancer.playAudio.bind(
            this.ambiancer
        );
    }
}

import { TweenLite } from "gsap";
import { Viewer } from "../app/Viewer";
import { SPLASH_SCREEN_CONTENT } from "../constants/splashScreenContent";
import { Button } from "./Button";
import "./SplashScreen.css";

export class SplashScreen {
    domElement = document.createElement("div");
    contentElement = document.createElement("div");
    progress = document.createElement("span");
    // tslint:disable-next-line: no-empty
    startCallBack: () => void = () => {};
    // tslint:disable-next-line: no-empty
    playAudioSpecialCallBack: () => void = () => {};
    startButton = new Button(SPLASH_SCREEN_CONTENT.startText);
    constructor(viewer: Viewer, public container: HTMLDivElement) {
        this.domElement.id = "ui-splash-screen";
        container.appendChild(this.domElement);

        const aligner = document.createElement("span");
        aligner.className = "valign";
        this.domElement.appendChild(aligner);

        this.contentElement.id = "ui-splash-screen-content";
        this.contentElement.classList.add("ui-splash-screen-content-hidden");
        setTimeout(() => {
            this.contentElement.classList.remove(
                "ui-splash-screen-content-hidden"
            );
            this.contentElement.classList.add("ui-splash-screen-content-show");
        }, 0);
        this.domElement.appendChild(this.contentElement);

        // h1 & h2
        const titleElement = document.createElement("h1");
        titleElement.id = "ui-splash-screen-title";
        titleElement.innerHTML = SPLASH_SCREEN_CONTENT.title;
        this.contentElement.appendChild(titleElement);
        const subtitleElement = document.createElement("h2");
        subtitleElement.id = "ui-splash-screen-subtitle";
        subtitleElement.innerHTML = SPLASH_SCREEN_CONTENT.subtitle;
        this.contentElement.appendChild(subtitleElement);

        // separator
        const separator = document.createElement("span");
        separator.id = "ui-splash-screen-separator";
        this.contentElement.appendChild(separator);

        // content
        for (const introduction of SPLASH_SCREEN_CONTENT.introduction) {
            const introducerParagraph = document.createElement("p");
            introducerParagraph.innerHTML = introduction;
            this.contentElement.appendChild(introducerParagraph);
        }

        // progress separator
        const progressContainer = document.createElement("div");
        progressContainer.id = "ui-splash-screen-progress-container";
        this.contentElement.appendChild(progressContainer);
        this.progress.id = "ui-splash-screen-progress";
        progressContainer.appendChild(this.progress);

        // start button
        this.startButton.domElement.addEventListener(
            "click",
            this.remove.bind(this),
            false
        );
        this.startButton.domElement.classList.add(
            "ui-splash-screen-start-hidden"
        );
        this.contentElement.appendChild(this.startButton.domElement);

        viewer.loader.on("asset-loaded", this.updateProgress.bind(this));
        viewer.loader.on("assets-loaded", this.allowRemoval.bind(this));
    }

    updateProgress(progress: number) {
        this.progress.style.width = progress * 100 + "%";
        this.progress.style.left = 50 - (progress * 100) / 2 + "%";
    }

    allowRemoval() {
        setTimeout(() => {
            this.startButton.domElement.classList.toggle(
                "ui-splash-screen-start-hidden"
            );
            this.startButton.domElement.classList.toggle(
                "ui-splash-screen-start-show"
            );
        }, 500);
    }

    remove() {
        this.startButton.select();
        this.playAudioSpecialCallBack();

        setTimeout(() => {
            this.contentElement.classList.toggle(
                "ui-splash-screen-content-hidden"
            );
            this.contentElement.classList.toggle(
                "ui-splash-screen-content-show"
            );

            TweenLite.to(this.domElement, 1.5, {
                css: { top: "-100%" },
                ease: Power3.easeOut,
                delay: 1,
                onComplete() {
                    this.container.removeChild(this.domElement);
                    this.startCallBack();
                },
            });
        }, 300);
    }
}

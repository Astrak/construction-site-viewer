import { TweenLite } from "gsap";

import Button from "./Button";

import SPLASH_SCREEN_CONTENT from "../constants/splashScreenContent";

import "./SplashScreen.css";

export default class SplashScreen {
    constructor(viewer, container) {
        const that = this;

        this.container = container;

        this.domElement = document.createElement("div");
        this.domElement.id = "ui-splash-screen";
        container.appendChild(this.domElement);

        const aligner = document.createElement("span");
        aligner.className = "valign";
        this.domElement.appendChild(aligner);

        this.contentElement = document.createElement("div");
        this.contentElement.id = "ui-splash-screen-content";
        this.contentElement.classList.add("ui-splash-screen-content-hidden");
        setTimeout(() => {
            that.contentElement.classList.remove(
                "ui-splash-screen-content-hidden"
            );
            that.contentElement.classList.add("ui-splash-screen-content-show");
        }, 0);
        this.domElement.appendChild(this.contentElement);

        //h1 & h2
        const titleElement = document.createElement("h1");
        titleElement.id = "ui-splash-screen-title";
        titleElement.innerHTML = SPLASH_SCREEN_CONTENT.title;
        this.contentElement.appendChild(titleElement);
        const subtitleElement = document.createElement("h2");
        subtitleElement.id = "ui-splash-screen-subtitle";
        subtitleElement.innerHTML = SPLASH_SCREEN_CONTENT.subtitle;
        this.contentElement.appendChild(subtitleElement);

        //separator
        const separator = document.createElement("span");
        separator.id = "ui-splash-screen-separator";
        this.contentElement.appendChild(separator);

        //content
        for (let i = 0; i < SPLASH_SCREEN_CONTENT.introduction.length; i++) {
            const introducerParagraph = document.createElement("p");
            introducerParagraph.innerHTML =
                SPLASH_SCREEN_CONTENT.introduction[i];
            this.contentElement.appendChild(introducerParagraph);
        }

        //progress separator
        const progressContainer = document.createElement("div");
        progressContainer.id = "ui-splash-screen-progress-container";
        this.contentElement.appendChild(progressContainer);
        this.progress = document.createElement("span");
        this.progress.id = "ui-splash-screen-progress";
        progressContainer.appendChild(this.progress);

        //start button
        this.startButton = new Button(SPLASH_SCREEN_CONTENT.startText);
        this.startButton.domElement.addEventListener(
            "click",
            this.remove.bind(this),
            false
        );
        this.startButton.domElement.classList.add(
            "ui-splash-screen-start-hidden"
        );
        this.contentElement.appendChild(this.startButton.domElement);
        this.startCallBack = function () {};
        this.playAudioSpecialCallBack = function () {};

        viewer.loader.on("asset-loaded", this.updateProgress.bind(this));
        viewer.loader.on("assets-loaded", this.allowRemoval.bind(this));
    }

    updateProgress(progress) {
        this.progress.style.width = progress * 100 + "%";
        this.progress.style.left = 50 - (progress * 100) / 2 + "%";
    }

    allowRemoval() {
        const that = this;

        setTimeout(() => {
            that.startButton.domElement.classList.toggle(
                "ui-splash-screen-start-hidden"
            );
            that.startButton.domElement.classList.toggle(
                "ui-splash-screen-start-show"
            );
        }, 500);
    }

    remove() {
        const that = this;

        that.startButton.select();
        that.playAudioSpecialCallBack();

        setTimeout(() => {
            that.contentElement.classList.toggle(
                "ui-splash-screen-content-hidden"
            );
            that.contentElement.classList.toggle(
                "ui-splash-screen-content-show"
            );

            TweenLite.to(that.domElement, 1.5, {
                css: { top: "-100%" },
                ease: Power3.easeOut,
                delay: 1,
                onComplete() {
                    that.container.removeChild(that.domElement);
                    that.startCallBack();
                },
            });
        }, 300);
    }
}

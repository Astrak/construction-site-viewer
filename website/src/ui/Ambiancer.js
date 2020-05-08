import { TweenLite } from "gsap";
import Button from "./Button";
import { DAYTIMES, defaultDayTime } from "./../constants/dayTimes";
import INFOS from "./../constants/infos";

import "./Ambiancer.css";

export default class Ambiancer {
    constructor(viewer, container) {
        const that = this;

        this.viewer = viewer;
        this.container = container;

        this.domElement = document.createElement("div");
        this.domElement.id = "ui-ambiancer";

        //day times
        const dayTimesButtons = [];
        for (let dayTime in DAYTIMES) {
            let content;
            switch (dayTime) {
                case "day":
                    content = "<img width=24 src='public/img/sun.svg'/>";
                    break;
                case "morning":
                    content = "<img width=24 src='public/img/sunrise.svg'/>";
                    break;
                case "evening":
                    content = "<img width=24 src='public/img/sunset.svg'/>";
                    break;
            }
            const dayTimeButton = new Button(content);
            if (defaultDayTime === dayTime) dayTimeButton.select();
            dayTimeButton.domElement.addEventListener(
                "click",
                (e) => {
                    dayTimesButtons.forEach((button) => button.unselect());
                    dayTimeButton.select();
                    viewer.environment.activeDayTime =
                        viewer.environment.targetDayTime;
                    viewer.environment["make" + dayTime]();
                },
                false
            );
            this.domElement.appendChild(dayTimeButton.domElement);
            dayTimesButtons.push(dayTimeButton);
        }

        //audio
        this.audio = new Audio();
        this.audio.src = "public/sound/soult.mp3";
        this.audio.loop = true;
        const volumeButton = new Button(
            "<img width=24 src='public/img/volume-up.svg'/>"
        );
        volumeButton.domElement.style.position = "absolute";
        volumeButton.domElement.style.right = "0";
        volumeButton.domElement.addEventListener(
            "click",
            () => {
                that.muteAudio = !that.muteAudio;
                that.muteAudio
                    ? volumeButton.select()
                    : volumeButton.unselect();
                TweenLite.to(that.audio, 2, {
                    volume: that.muteAudio ? 0 : 0.5,
                });
                volumeButton.domElement.innerHTML = that.muteAudio
                    ? "<img width=24 src='public/img/volume-off.svg'/>"
                    : "<img width=24 src='public/img/volume-up.svg'/>";
            },
            false
        );
        this.domElement.appendChild(volumeButton.domElement);

        //info
        const info = new Button("<img width=24 src='public/img/menu.svg'/>");
        info.domElement.style.position = "absolute";
        info.domElement.style.left = "0";
        info.domElement.addEventListener(
            "click",
            this.showInfos.bind(this),
            false
        );
        this.domElement.appendChild(info.domElement);

        this.infoAnimation = document.createElement("span");
        this.infoAnimation.id = "ui-ambiancer-infos-animation";
        this.domElement.appendChild(this.infoAnimation);

        this.infoContainer = document.createElement("div");
        this.infoContainer.id = "ui-ambiancer-infos-container";
        this.infoContainer.classList.add("hide");

        const close = new Button("<img width=24 src='public/img/close.svg'/>");
        close.domElement.id = "ui-ambiancer-infos-close";
        close.domElement.addEventListener(
            "click",
            this.closeInfos.bind(this),
            false
        );
        this.infoContainer.appendChild(close.domElement);

        const infoContent = document.createElement("div");
        infoContent.id = "ui-ambiancer-infos-content";
        infoContent.innerHTML = INFOS;
        this.infoContainer.appendChild(infoContent);
    }

    showInfos() {
        const that = this;

        this.viewer.userIsViewing = false;

        TweenLite.to(this.infoAnimation, 1, {
            css: { transform: "scale( 5 )" },
            ease: Power2.easeOut,
            onComplete() {
                that.domElement.appendChild(that.infoContainer);
                setTimeout(
                    () => that.infoContainer.classList.remove("hide"),
                    50
                );
            },
        });
    }

    closeInfos() {
        const that = this;

        this.infoContainer.classList.add("hide");
        setTimeout(() => {
            that.domElement.removeChild(that.infoContainer);
            TweenLite.to(that.infoAnimation, 1, {
                css: { transform: "scale( 0 )" },
                ease: Power4.easeOut,
                onComplete() {
                    that.viewer.userIsViewing = true;
                },
            });
        }, 1000);
    }

    playAudio() {
        this.audio.volume = 0;
        this.audio.play();
        TweenLite.to(this.audio, 4, {
            volume: 0.5,
        });
    }

    show() {
        this.container.appendChild(this.domElement);
    }
}

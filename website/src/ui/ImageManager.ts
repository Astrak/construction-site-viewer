import { Viewer } from "../app/Viewer";
import { HOTSPOTS } from "../constants/hotspots";
import { Button } from "./Button";
import "./ImageManager.css";

export class ImageManager {
    domElement = document.createElement("div");
    imageContainers: { [key: string]: HTMLDivElement } = {};
    overlay = document.createElement("div");
    close = new Button("<img width=24 src='public/img/close.svg'/>");
    constructor(public viewer: Viewer, public container: HTMLDivElement) {
        this.domElement.id = "ui-images-container";

        // tslint:disable-next-line: forin
        for (const location in HOTSPOTS) {
            const imageContainer = document.createElement("div");
            imageContainer.className = "ui-images-location-container";
            this.domElement.appendChild(imageContainer);

            this.imageContainers[location] = imageContainer;

            // tslint:disable-next-line: prefer-for-of
            for (
                let i = 0;
                i < (HOTSPOTS as any)[location].images.length;
                i++
            ) {
                const image = document.createElement("div");
                image.style.backgroundImage =
                    "url('" +
                    (HOTSPOTS as any)[location].images[i].fullImage +
                    "')";
                image.className = "ui-image";

                const thumbnail = document.createElement("div");
                thumbnail.style.backgroundImage =
                    "url('" +
                    (HOTSPOTS as any)[location].images[i].thumbnail +
                    "')";
                thumbnail.className = "ui-image-location";
                (thumbnail as any).image = image;
                thumbnail.addEventListener(
                    "click",
                    this.clickImage.bind(this),
                    false
                );
                imageContainer.appendChild(thumbnail);
            }
        }

        this.overlay.id = "ui-image-overlay";

        this.close.domElement.id = "ui-image-close";
        this.close.domElement.addEventListener(
            "click",
            this.hideOverlay.bind(this)
        );
        this.overlay.appendChild(this.close.domElement);

        viewer.spotPicker.on("navigation", this.switchImages.bind(this));
    }

    showOverlay(image: HTMLDivElement) {
        this.overlay.appendChild(image);
        this.container.appendChild(this.overlay);
    }

    hideOverlay() {
        this.container.removeChild(this.overlay);

        while (
            !(
                this.overlay.firstChild.nextSibling === undefined ||
                this.overlay.firstChild.nextSibling === null
            )
        ) {
            this.overlay.removeChild(this.overlay.firstChild.nextSibling);
        }

        this.viewer.userIsViewing = true;
    }

    clickImage(e: MouseEvent) {
        this.showOverlay((e.target as any).image);
        this.viewer.userIsViewing = false;
    }

    switchImages(location: string) {
        // tslint:disable-next-line: forin
        for (const loc in this.imageContainers) {
            this.imageContainers[loc].classList[
                loc !== location ? "remove" : "add"
            ]("ui-images-location-container-visible");
        }
    }

    show() {
        this.container.appendChild(this.domElement);
    }
}

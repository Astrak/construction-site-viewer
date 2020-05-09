import "./Button.css";

export class Button {
    domElement = document.createElement("button");
    selected: boolean = false;
    constructor(content: string, id = "") {
        this.domElement.id = id;
        this.domElement.className = "ui-button";
        this.domElement.innerHTML = content;
    }

    select() {
        this.selected = true;
        this.domElement.classList.add("ui-button-selected");
    }

    unselect() {
        this.selected = false;
        this.domElement.classList.remove("ui-button-selected");
    }
}

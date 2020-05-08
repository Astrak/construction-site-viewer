import "./Button.css";

export default class Button {
    constructor(content, id = "") {
        this.domElement = document.createElement("button");
        this.domElement.id = id;
        this.domElement.className = "ui-button";
        this.domElement.innerHTML = content;
        this.selected = false;
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

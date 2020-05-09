import { Viewer } from "./app/Viewer";
import { UI } from "./ui/UI";

const viewer = new Viewer();
const ui = new UI(viewer);

viewer.renderer.onUpdate = ui.zoomer.update.bind(ui.zoomer);

viewer.spotPicker.navigateTo("soult");

/* console.info(
    "App | models | textures | sound : https://interascope.com - 2018"
); */

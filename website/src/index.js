import Viewer from './app/Viewer.js';
import UI from './ui/UI';

const viewer = new Viewer();

const ui = new UI( viewer );

//app logic
viewer.city.on( 'asset-loaded', progress => {
  ui.splashScreen.updateProgress( progress ) 
});

viewer.city.on( 'assets-loaded', () => {
  ui.timeline.setSceneContentToDate();
  ui.splashScreen.allowRemoval();
});

ui.splashScreen.on( 'splash-screen-removed', () => {
  ui.showViewerUI();
});


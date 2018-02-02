import Viewer from './app/Viewer.js';
import UI from './ui/UI';

const viewer = new Viewer();

const ui = new UI( viewer );

//app logic
viewer.spotPicker.on( 'navigation', location => {
  ui.timeline.showConstructionSpan( location );
});

viewer.spotPicker.navigateTo( 'soult' );

viewer.loader.on( 'asset-loaded', progress => {
  ui.splashScreen.updateProgress( progress ) 
});

viewer.loader.on( 'assets-loaded', () => {
  ui.timeline.setSceneContentToDate();
  ui.splashScreen.allowRemoval();
});

//

console.info( 'App | models | textures : https://interascope.com - 2018' );
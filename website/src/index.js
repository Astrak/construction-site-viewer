import Viewer from './app/Viewer.js';
import UI from './ui/UI';

const viewer = new Viewer();

const ui = new UI( viewer );

//app logic
viewer.spotPicker.on( 'navigation', location => {
  ui.timeline.showConstructionSpan( location );
});

viewer.spotPicker.navigateTo( 'soult' );

viewer.city.on( 'asset-loaded', progress => {
  ui.splashScreen.updateProgress( progress ) 
});

viewer.city.on( 'assets-loaded', () => {
  ui.timeline.setSceneContentToDate();
  ui.splashScreen.allowRemoval();
});
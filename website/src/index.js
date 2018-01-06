import Viewer from './app/Viewer.js';
import UI from './ui/main';

const viewer = new Viewer();

const ui = new UI( viewer );

viewer.city.on( 'asset-loaded', progress => {
  console.log(progress)
});
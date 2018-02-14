import Ambiancer from './Ambiancer';
import Modes from './Modes';
import Zoomer from './Zoomer';
import Timeline from './Timeline';
import SplashScreen from './SplashScreen';

import './UI.css';

export default class UI {

  constructor ( viewer ) {

    const that = this;

    this.activeModes = [];

    this.wrapper = document.createElement( 'div' );
    this.wrapper.id = 'ui-wrapper';
    document.getElementById( 'app' ).appendChild( this.wrapper );

    this.container = document.createElement( 'div' );
    this.container.id = 'ui-container';
    this.wrapper.appendChild( this.container );

    this.verticalAligner = document.createElement( 'span' );
    this.verticalAligner.id = 'ui-container-vertical-aligner';
    this.container.appendChild( this.verticalAligner );

    //top : ambiancer (+ menu button)
    this.ambiancer = new Ambiancer( viewer, this.container );

    //bottom : timeline
    this.timeline = new Timeline( viewer, this.activeModes, this.container );

    //left : display modes
    this.modes = new Modes( viewer, this.timeline, this.activeModes, this.container );

    //right: zoomer
    this.zoomer = new Zoomer( viewer, this.container );

    this.splashScreen = new SplashScreen( this.container );
    this.splashScreen.startCallBack = () => {
      that.ambiancer.show();
      that.timeline.show();
      that.modes.show();
      that.zoomer.show();
    };
    this.splashScreen.playAudioSpecialCallBack = that.ambiancer.playAudio.bind( that.ambiancer );

  }

}
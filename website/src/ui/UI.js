import Ambiancer from './Ambiancer';
import Modes from './Modes';
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
    this.ambiancer = new Ambiancer( viewer.environment, this.container );

    //bottom : timeline
    this.timeline = new Timeline( viewer, this.activeModes, this.container );

    //right : display modes
    this.modes = new Modes( viewer, this.timeline, this.activeModes, this.container );

    this.splashScreen = new SplashScreen( this.container );
    this.splashScreen.startCallBack = () => {
      that.ambiancer.show();
      that.timeline.show();
      that.modes.show();
    };
    this.splashScreen.playAudioSpecialCallBack = that.ambiancer.playAudio.bind( that.ambiancer );

  }

}
import Ambiancer from './Ambiancer';
import Timeline from './Timeline';
import SplashScreen from './SplashScreen';

import './UI.css';

export default class UI {

  constructor ( viewer ) {

    const that = this;

    this.wrapper = document.createElement( 'div' );
    this.wrapper.id = 'ui-wrapper';
    document.getElementById( 'app' ).appendChild( this.wrapper );

    this.container = document.createElement( 'div' );
    this.container.id = 'ui-container';
    this.wrapper.appendChild( this.container );

    this.ambiancer = new Ambiancer( viewer.environment, this.container );

    this.timeline = new Timeline( viewer, this.container );

    this.splashScreen = new SplashScreen( this.container );
    this.splashScreen.startCallBack = () => {
      that.ambiancer.show();
      that.timeline.show();
    };
    this.splashScreen.playAudioSpecialCallBack = that.ambiancer.playAudio.bind( that.ambiancer );

  }

}
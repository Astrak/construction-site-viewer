import { DAYTIMES, defaultDayTime } from './../constants/dayTimes';
import { TweenLite } from 'gsap';
import Button from './Button';

import './Ambiancer.css';

export default class Ambiancer {

  constructor ( environment, container ) {

    const that = this;

    this.container = container;

    this.domElement = document.createElement( 'div' );
    this.domElement.id = 'ui-ambiancer';

    //day times
    const dayTimesButtons = [];
    for ( let dayTime in DAYTIMES ) {
      let content;
      switch ( dayTime ) {
        case 'Journée': content = "<img width=24 src='public/img/sun.svg'/>"; break;
        case 'Matin': content = "<img width=24 src='public/img/sunrise.svg'/>"; break;
        case 'Soirée': content = "<img width=24 src='public/img/sunset.svg'/>"; break;
      }
      const dayTimeButton = new Button( content );
      if ( defaultDayTime === dayTime ) dayTimeButton.select();
      dayTimeButton.domElement.addEventListener( 'click', e => {
        environment[ 'make' + dayTime ]();
        dayTimesButtons.forEach( button => button.unselect() );
        dayTimeButton.select();
      }, false );
      this.domElement.appendChild( dayTimeButton.domElement );
      dayTimesButtons.push( dayTimeButton );
    }
    console.info( 'Weather icons by Rami McMin http://www.ramimcm.in/' );

    //audio
    this.audio = new Audio();
    this.audio.src = 'public/sound/soult.mp3';
    this.audio.loop = true;
    const volumeButton = new Button( '<i class="material-icons">volume_up</i>' );
    volumeButton.domElement.style.position = 'absolute';
    volumeButton.domElement.style.right = '0';
    volumeButton.domElement.addEventListener( 'click', () => {
      that.muteAudio = ! that.muteAudio;
      that.muteAudio ? volumeButton.select() : volumeButton.unselect();
      TweenLite.to( that.audio, 2, { volume: that.muteAudio ? 0 : 0.5 } );
      volumeButton.domElement.innerHTML = that.muteAudio ? '<i class="material-icons">volume_off</i>' : '<i class="material-icons">volume_up</i>';
    }, false );
    this.domElement.appendChild( volumeButton.domElement );

  }

  playAudio () {

    this.audio.volume = 0;
    this.audio.play();
    TweenLite.to(
      this.audio, 
      4,
      {
        volume: 0.5
      }
    );

  }

  show () {

    this.container.appendChild( this.domElement );

  }

}
import { DAYTIMES, defaultDayTime } from './../constants/dayTimes';

import './DayTimer.css';

export default class DayTimer {

  constructor ( environment, container ) {

    this.container = container;

    this.domElement = document.createElement( 'div' );
    this.domElement.id = 'ui-day-timer';

    const buttons = [];

    for ( let dayTime in DAYTIMES ) {

      const button = document.createElement( 'button' );
      button.innerHTML = dayTime;
      button.classList.add( 'ui-day-timer-button' );
      if ( defaultDayTime === dayTime ) button.classList.add( 'ui-day-timer-button-selected' );
      button.addEventListener( 'click', e => {
        environment[ 'make' + dayTime ]();
        buttons.forEach( button => button.classList.remove( 'ui-day-timer-button-selected' ) );
        button.classList.add( 'ui-day-timer-button-selected' )
      }, false );
      this.domElement.appendChild( button );
      buttons.push( button );

    }

  }

  show () {

    this.container.appendChild( this.domElement );

  }

}
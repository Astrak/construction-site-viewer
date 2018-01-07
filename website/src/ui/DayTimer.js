import { DAYTIMES, defaultDayTime } from './../constants/dayTimes';
import Button from './Button';

import './DayTimer.css';

export default class DayTimer {

  constructor ( environment, container ) {

    this.container = container;

    this.domElement = document.createElement( 'div' );
    this.domElement.id = 'ui-day-timer';

    const buttons = [];

    for ( let dayTime in DAYTIMES ) {

      const button = new Button( dayTime );
      if ( defaultDayTime === dayTime ) button.select();
      button.domElement.addEventListener( 'click', e => {
        environment[ 'make' + dayTime ]();
        buttons.forEach( button => button.unselect() );
        button.select();
      }, false );

      this.domElement.appendChild( button.domElement );
      buttons.push( button );

    }

  }

  show () {

    this.container.appendChild( this.domElement );

  }

}
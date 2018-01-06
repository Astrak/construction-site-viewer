import DAYTIMES from './../constants/dayTimes';

import './DayTimer.css';

export default class DayTimer {

  constructor ( environment, container ) {

    this.domElement = document.createElement( 'div' );
    this.domElement.id = 'ui-day-timer';
    container.appendChild( this.domElement );

    for ( let DAYTIME in DAYTIMES ) {

      const button = document.createElement( 'button' );
      button.innerHTML = DAYTIME;
      button.addEventListener( 'click', e => {
        environment[ 'make' + DAYTIME ]()
      }, false );
      button.className = 'soult-daytime';
      this.domElement.appendChild( button );

    }

  }

}
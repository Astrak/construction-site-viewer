import DayTimer from './DayTimer';
import Timeline from './Timeline';

import './main.css';

export default class UI {

  constructor ( viewer ) {

    this.wrapper = document.createElement( 'div' );
    this.wrapper.id = 'ui-wrapper';
    document.getElementById( 'app' ).appendChild( this.wrapper );

    this.container = document.createElement( 'div' );
    this.container.id = 'ui-container';
    this.wrapper.appendChild( this.container );

    this.dayTime = new DayTimer( viewer.environment, this.container );

    this.timeline = new Timeline( viewer, this.container );

  }

}
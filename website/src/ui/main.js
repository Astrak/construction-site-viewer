import dayTime from './dayTime';

export default class UI {

  constructor ( demonstrator ) {

    this.wrapper = document.createElement( 'div' );
    this.wrapper.id = 'ui-wrapper';
    document.body.appendChild( this.wrapper );

    this.container = document.createElement( 'div' );
    this.container.id = 'ui-container';
    this.wrapper.appendChild( this.container );

    this.dayTime = new dayTime( demonstrator.environment, this.container );

  }

}
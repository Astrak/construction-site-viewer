import DAYTIMES from './../constants/dayTimes';

export default class dayTime {

  constructor ( environment, container ) {

    this.domElement = document.createElement( 'div' );
    this.domElement.id = 'ui-daytime';
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
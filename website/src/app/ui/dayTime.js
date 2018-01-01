import DAYTIMES from './../../constants/dayTimes';

export default class dayTime {

  constructor ( environment ) {

    for ( let DAYTIME in DAYTIMES ) {

      const button = document.createElement( 'button' );
      button.innerHTML = DAYTIME;
      button.addEventListener( 'click', e => {
        environment[ 'make' + DAYTIME ]()
      }, false );
      button.className = 'soult-daytime';
      document.body.appendChild( button );

    }

  }

}
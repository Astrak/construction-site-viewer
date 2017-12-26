
export default class Splashscreen {

  constructor () {

    const that = this;

    this.overlay = document.createElement( 'div' );
    this.overlay.id = 'overlay';
    document.getElementById( 'app' ).appendChild( this.overlay );

    const overlayContent = document.createElement( 'div' );
    overlayContent.id = 'overlay-content';
    this.overlay.appendChild( overlayContent );

    const startButton = document.createElement( 'button' );
    startButton.textContent = 'Démarrer';
    overlayContent.appendChild( startButton );
    startButton.addEventListener( 'click', () => {
      that.close()
    }, false );

  }

  close () {

    document.getElementById( 'app' ).removeChild( this.overlay );

  }
  
}
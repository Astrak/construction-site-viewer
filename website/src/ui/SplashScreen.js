import { TweenLite } from 'gsap';

import eventEmitter from 'events';

import SPLASH_SCREEN_CONTENT from '../constants/splashScreenContent';

import './SplashScreen.css';

export default class SplashScreen extends eventEmitter{

  constructor ( container ) {

    super();

    this.container = container;

    this.domElement = document.createElement( 'div' );
    this.domElement.id = 'ui-splash-screen';
    container.appendChild( this.domElement );

    const aligner = document.createElement( 'span' );
    aligner.className = 'valign';
    this.domElement.appendChild( aligner );

    this.contentElement = document.createElement( 'div' );
    this.contentElement.id = 'ui-splash-screen-content';
    this.contentElement.className = 'ui-splash-screen-content-show';
    this.domElement.appendChild( this.contentElement );

    for ( let i = 0 ; i < SPLASH_SCREEN_CONTENT.introduction.length ; i++ ) {

      const introducerParagraph = document.createElement( 'p' );
      introducerParagraph.innerHTML = SPLASH_SCREEN_CONTENT.introduction[ i ];
      this.contentElement.appendChild( introducerParagraph );

    }

    const progressContainer = document.createElement( 'div' );
    progressContainer.id = 'ui-splash-screen-progress-container';
    this.contentElement.appendChild( progressContainer );

    this.progress = document.createElement( 'span' );
    this.progress.id = 'ui-splash-screen-progress';
    progressContainer.appendChild( this.progress );

    this.startButton = document.createElement( 'button' );
    this.startButton.id = 'ui-splash-screen-start';
    this.startButton.className = 'ui-splash-screen-start-hidden';
    this.startButton.innerHTML = SPLASH_SCREEN_CONTENT.startText;
    this.startButton.addEventListener( 'click', this.remove.bind( this ), false );
    this.contentElement.appendChild( this.startButton );

  }

  updateProgress ( progress ) {

    this.progress.style.width = progress * 100 + '%';

  }

  allowRemoval () {

    this.startButton.classList.toggle( 'ui-splash-screen-start-hidden' );
    this.startButton.classList.toggle( 'ui-splash-screen-start-show' );

  }

  remove () {

    const that = this;

    this.startButton.classList.toggle( 'ui-splash-screen-start-hidden' );
    this.startButton.classList.toggle( 'ui-splash-screen-start-show' );

    this.contentElement.classList.toggle( 'ui-splash-screen-content-hidden' );
    this.contentElement.classList.toggle( 'ui-splash-screen-content-show' );

    TweenLite.to( 
      this.domElement, 
      1.5,
      {
        css: { top: '-100%' },
        ease: Power3.easeOut,
        delay: 1,
        onComplete () { 
          that.container.removeChild( that.domElement ); 
          that.emit( 'splash-screen-removed' );
        }
      }
    );

  }

}
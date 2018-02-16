import { TweenLite } from 'gsap';
import Button from './Button';
import HOTSPOTS from './../constants/hotspots';

import './ImageManager.css';

export default class ImageManager {

  constructor ( viewer, container ) {

    this.container = container;

    this.domElement = document.createElement( 'div' );
    this.domElement.id = 'ui-images-container';
    this.imageContainers = {};

    for ( let location in HOTSPOTS ) {

      const imageContainer = document.createElement( 'div' );
      imageContainer.className = 'ui-images-location-container';
      this.domElement.appendChild( imageContainer );

      this.imageContainers[ location ] = imageContainer;

      for ( let i = 0 ; i < HOTSPOTS[ location ].images.length ; i++ ) {

        const thumbnail = new Image();
        thumbnail.src = HOTSPOTS[ location ].images[ i ];
        thumbnail.className = 'ui-image-location';
        thumbnail.addEventListener( 'click', this.clickImage.bind( this ), false );
        imageContainer.appendChild( thumbnail );

      }

    }

    this.overlay = document.createElement( 'div' );
    this.overlay.id = 'ui-image-overlay';

    this.close = new Button( "<img width=24 src='public/img/close.svg'/>" );
    this.close.domElement.addEventListener( 'click', this.hideOverlay.bind( this ) );
    this.overlay.appendChild( this.close.domElement );

    viewer.spotPicker.on( 'navigation', this.switchImages.bind( this ) );

  }

  showOverlay () {

    this.container.appendChild( this.overlay );

  }

  hideOverlay () {

    this.container.removeChild( this.overlay );

  }

  clickImage ( e ) {

    const padding = 20;
    const margin = 5;
    const border = 2;

    this.showOverlay()

    //e.target.classList.add( 'ui-image-location-focus' );

    //add screen ratio code here

  }

  switchImages ( location ) {

    for ( let loc in this.imageContainers ) {

      if ( loc !== location ) {

        this.imageContainers[ loc ].classList.remove( 'ui-images-location-container-visible' );

      } else {

        this.imageContainers[ loc ].classList.add( 'ui-images-location-container-visible' );

      }

    }

  }

  show () {

    this.container.appendChild( this.domElement );

  }

}
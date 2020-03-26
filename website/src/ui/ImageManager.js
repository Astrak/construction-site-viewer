import { TweenLite } from 'gsap';
import Button from './Button';
import HOTSPOTS from './../constants/hotspots';

import './ImageManager.css';

export default class ImageManager {

  constructor ( viewer, container ) {

    this.container = container;
    this.viewer = viewer;

    this.domElement = document.createElement( 'div' );
    this.domElement.id = 'ui-images-container';
    this.imageContainers = {};

    for ( let location in HOTSPOTS ) {

      const imageContainer = document.createElement( 'div' );
      imageContainer.className = 'ui-images-location-container';
      this.domElement.appendChild( imageContainer );

      this.imageContainers[ location ] = imageContainer;

      for ( let i = 0 ; i < HOTSPOTS[ location ].images.length ; i++ ) {

        const image = document.createElement( 'div' );
        image.style.backgroundImage = "url('" + HOTSPOTS[ location ].images[ i ].fullImage + "')";
        image.className = 'ui-image';

        const thumbnail = document.createElement( 'div' );
        thumbnail.style.backgroundImage = "url('" + HOTSPOTS[ location ].images[ i ].thumbnail + "')";
        thumbnail.className = 'ui-image-location';
        thumbnail.image = image;
        thumbnail.addEventListener( 'click', this.clickImage.bind( this ), false );
        imageContainer.appendChild( thumbnail );

      }

    }

    this.overlay = document.createElement( 'div' );
    this.overlay.id = 'ui-image-overlay';

    this.close = new Button( "<img width=24 src='public/img/close.svg'/>" );
    this.close.domElement.id = 'ui-image-close';
    this.close.domElement.addEventListener( 'click', this.hideOverlay.bind( this ) );
    this.overlay.appendChild( this.close.domElement );

    viewer.spotPicker.on( 'navigation', this.switchImages.bind( this ) );

  }

  showOverlay ( image ) {

    this.overlay.appendChild( image );
    this.container.appendChild( this.overlay );

  }

  hideOverlay () {

    this.container.removeChild( this.overlay );

    while ( this.overlay.firstChild.nextSibling ) this.overlay.removeChild( this.overlay.firstChild.nextSibling );

    this.viewer.userIsViewing = true;

  }

  clickImage ( e ) {

    this.showOverlay( e.target.image );
    this.viewer.userIsViewing = false;

  }

  switchImages ( location ) {

    for ( let loc in this.imageContainers ) {

      this.imageContainers[ loc ].classList[ loc !== location ? 'remove' : 'add' ]( 'ui-images-location-container-visible' );

    }

  }

  show () {

    this.container.appendChild( this.domElement );

  }

}
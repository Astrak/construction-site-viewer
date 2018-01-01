import { TweenLite } from 'gsap';
import { Raycaster } from 'three'

export default class SpotPicker {

  constructor ( renderer, camera, controls, hotspotsContainer, hotspots ) {

    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    this.hotspotsContainer = hotspotsContainer;
    this.hotspots = hotspots;
    this.raycaster = new Raycaster();

    renderer.domElement.addEventListener( 'click', this.pick.bind( this ), false );

  }

  pick ( e ) {

    const mouse = {
      x: 2 * ( !! e.touches ? e.touches[ 0 ].pageX : e.pageX ) / innerWidth - 1,
      y: 1 - ( !! e.touches ? e.touches[ 0 ].pageY : e.pageY ) * 2 / innerHeight
    };

    this.raycaster.setFromCamera( mouse, this.camera );

    const intersections = this.raycaster.intersectObjects( this.hotspotsContainer.children );

    if ( intersections[ 0 ] ) this.navigateTo( intersections[ 0 ].object );

  }

  navigateTo ( sprite ) {

    const that = this;

    //maintain camera zoom during tween
    const cameraDistance = this.camera.position.clone().sub( this.controls.target ).length();
    this.controls.maxDistance = this.controls.minDistance = cameraDistance;

    //tween controls' target
    TweenLite.to( 
      this.controls.target,
      2,
      {
        x: sprite.position.x, 
        z: sprite.position.z,
        onUpdate () { 
          that.camera.update = true 
        }, 
        onComplete () { 
          //restore camera zooming limits
          that.controls.maxDistance = 23;
          that.controls.minDistance = 3.5 
        }
      }
    );

    //show/hide hotspots
    this.hotspots.forEach( hotspot => { hotspot.sprite === sprite ? hotspot.hide() : hotspot.show() });

  }

}
import { PerspectiveCamera, Scene, Group } from 'three';

import Renderer from './Renderer';
import Hotspot from './Hotspot';
import SpotPicker from './SpotPicker';
import City from './City';
import Environment from './Environment';

import OrbitControls from './../lib/OrbitControlsr87-with-damping';

import HOTSPOTS from './../constants/hotspots';

export default class Viewer {

  constructor () {

    this.renderer = new Renderer();

    this.scene = new Scene();

    this.camera = new PerspectiveCamera( 50, innerWidth / innerHeight, .1, 1200 );
    this.camera.position.set( 43, 4, 12 );

    const controls = new OrbitControls( this.camera, this.renderer.renderer.domElement );
    Object.assign( controls, {
      enableDamping: true,
      rotateDampingFactor: .05,
      rotateSpeed: .017,
      panSpeed: 0.02,
      enablePan: false,
      minDistance: 4,
      maxDistance: 23,
      zoomSpeed: 0.12,
    });
    controls.addEventListener( 'change', () => this.camera.update = true );
    controls.target.set(35,1,17);
    this.controls = controls;

    this.renderer.setRendering( this.scene, this.camera, this.controls );

    window.addEventListener( 'resize', this.resize.bind( this ) );

    this.buildScene();

    this.start();

  }

  buildScene () {

    this.city = new City( this.renderer.renderer, this.scene, this.camera );
    this.environment = new Environment( this.renderer.renderer, this.scene, this.camera, this.city );

    const hotspotsGroup = new Group();
    this.scene.add( hotspotsGroup );
    const hotspotsArray = []

    for ( let place in HOTSPOTS ) {

      hotspotsArray.push( 
        new Hotspot( 
          hotspotsGroup, 
          HOTSPOTS[ place ].center, 
          HOTSPOTS[ place ].camera, 
          place 
        ) 
      );

    }

    const spotPicker = new SpotPicker( 
      this.renderer.renderer, 
      this.camera, 
      this.controls, 
      hotspotsGroup, 
      hotspotsArray 
    );

    spotPicker.navigateTo( 'soult' );

  }

  resize () {

    this.renderer.resize();
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.camera.update = true;

  }

  start () {

    this.renderer.animate();

  }

}
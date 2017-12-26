import * as THREE from 'three';
import OrbitControls from './lib/OrbitControlsr89.js';

export default class Renderer {

  constructor () {

    //setup
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( innerWidth, innerHeight );
    document.getElementById( 'app' ).appendChild( this.renderer.domElement );

    this.scene = new THREE.Scene();

    this.cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial());
    this.scene.add( this.cube );

    //view
    this.camera = new THREE.PerspectiveCamera( 70, innerWidth / innerHeight, 1, 100 );
    this.camera.position.z = 5;
    this.camera.update = false;

    OrbitControls( THREE );

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.controls.addEventListener( 'change', () => this.camera.update = true );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = .05;
    this.controls.rotateSpeed = .07;

    const that = this;

    window.addEventListener( 'resize', function () {
      that.camera.aspect = innerWidth / innerHeight;
      that.camera.updateProjectionMatrix();
      that.renderer.setSize( innerWidth, innerHeight );
      that.camera.update = true;
    }, false );

    this.animate();

  }

  animate () {

    requestAnimationFrame( this.animate.bind( this ) );

    this.cube.rotation.y+=0.05;

    this.controls.update();

    //if ( camera.update ) {
      this.renderer.render( this.scene, this.camera );
      this.camera.update = false;
    //}

  }

}
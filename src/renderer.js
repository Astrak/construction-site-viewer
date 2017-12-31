import * as THREE from 'three';
import OrbitControls from './lib/OrbitControlsr89.js';
import PLYLoader from './lib/PLYLoaderr89.js';;
import Sky from './lib/Skyr89.js';

const CAMERAS = {
  main: {
    camera: [-21, 10, -16],
    target: [-24, 0,-11]
  },
  villegoudou: {
    camera: [-11,2.5,-10],
    target: [-13,0,-8.4]
  },
  gare: {
    camera: [-41,6.51,-17],
    target: [-33,0,-13]
  }
}

export default class Renderer {

  constructor () {

    const ASSETS = {
      routes: 'routes.ply',
      bats: 'batiments.ply'
    };

    //setup
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( innerWidth, innerHeight );
    this.renderer.shadowMap.enabled = true;
    document.getElementById( 'app' ).appendChild( this.renderer.domElement );

    this.scene = new THREE.Scene();

    window.scene = this.scene;

    //view
    this.camera = new THREE.PerspectiveCamera( 70, innerWidth / innerHeight, .1, 1200 );
    this.camera.position.set(-21,10,-16);
    this.camera.update = false;
    window.camera = this.camera;

    this.gui = new dat.GUI();

    OrbitControls( THREE );

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.controls.addEventListener( 'change', () => this.camera.update = true );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = .05;
    this.controls.rotateSpeed = .017;
    this.controls.panSpeed = 0.02;
    this.controls.minDistance = 7;
    this.controls.zoomSpeed = 0.09;
    this.controls.target.set(-24,0,-11);
    this.controls.minPolarAngle=this.controls.maxPolarAngle=0.9;
    window.controls=this.controls;

    const that = this;

    window.addEventListener( 'resize', function () {
      that.camera.aspect = innerWidth / innerHeight;
      that.camera.updateProjectionMatrix();
      that.renderer.setSize( innerWidth, innerHeight );
      that.camera.update = true;
    }, false );

    PLYLoader( THREE );
    this.loader = new THREE.PLYLoader();

    for ( let k in ASSETS ) {
      this.loader.load( 'public/geometries/' + ASSETS[ k ], g => {
        const mesh = new THREE.Mesh( g, new THREE.MeshLambertMaterial() );
        mesh.castShadow = mesh.receiveShadow = true;
        that.scene.add( mesh );
      });
    }

    this.setLighting();

    this.addSky();

    this.animate();

    var effectController  = {
      turbidity: 10,
      rayleigh: 2,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.8,
      luminance: 1,
      inclination: 0.49, // elevation / inclination
      azimuth: 0.25, // Facing front,
      sun: ! true,
      x: -12,
      y: 30,
      z: -45
    };

    function guiChanged() {
      var uniforms = that.sky.material.uniforms;
      uniforms.turbidity.value = effectController.turbidity;
      uniforms.rayleigh.value = effectController.rayleigh;
      uniforms.luminance.value = effectController.luminance;
      uniforms.mieCoefficient.value = effectController.mieCoefficient;
      uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
      var theta = Math.PI * ( effectController.inclination - 0.5 );
      var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
      var distance = 1;
      that.sky.sunSphere.position.x = distance * Math.cos( phi );
      that.sky.sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
      that.sky.sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
      that.sky.sunSphere.visible = effectController.sun;
      uniforms.sunPosition.value.copy( that.sky.sunSphere.position );
      that.sun.position.set( effectController.x, effectController.y, effectController.z );
      that.sun.target.position.set( -24,0,11);
    }

    this.gui.add( effectController, "turbidity", 1.0, 20.0, 0.1 ).onChange( guiChanged );
    this.gui.add( effectController, "rayleigh", 0.0, 4, 0.001 ).onChange( guiChanged );
    this.gui.add( effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange( guiChanged );
    this.gui.add( effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange( guiChanged );
    this.gui.add( effectController, "luminance", 0.0, 2 ).onChange( guiChanged );
    this.gui.add( effectController, "inclination", 0, 1, 0.0001 ).onChange( guiChanged );
    this.gui.add( effectController, "azimuth", 0, 1, 0.0001 ).onChange( guiChanged );
    this.gui.add( effectController, "sun" ).onChange( guiChanged );
    this.gui.add( effectController, "x", -100, 0 ).onChange( guiChanged );
    this.gui.add( effectController, "y", 0, 100 ).onChange( guiChanged );
    this.gui.add( effectController, "z", -100, 0 ).onChange( guiChanged );

  }

  addSky () {

    Sky( THREE );

    this.sky = new THREE.Sky();
    this.sky.material.side = THREE.DoubleSide;
    this.sky.scale.setScalar( 100 );
    this.scene.add( this.sky );
    this.sky.sunSphere = new THREE.Object3D();
    this.sky.sunSphere.position.set( 1,1,1 );

    window.sky = this.sky;

  }

  setLighting () {

    this.sun = new THREE.DirectionalLight( 0xffffff, 1 );
    this.sun.position.set( -12, 30, -45 );
    this.sun.target.position.set( -24,0,11);
    Object.assign( this.sun.shadow.camera, {
      top: 20,
      left: -20,
      right: 20,
      bottom: -20
    });
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048,2048);
    const helper = new THREE.CameraHelper( this.sun.shadow.camera );
    this.scene.add( this.sun, helper );
    window.sun = this.sun;

    this.ambient = new THREE.AmbientLight( 0xaaaacc );
    this.ambient.intensity = 0.5;
    this.scene.add( this.ambient );

  }

  animate () {

    requestAnimationFrame( this.animate.bind( this ) );

    this.controls.update();
    const cameraDistance = this.camera.position.clone().sub( this.controls.target ).length();
    this.controls.minPolarAngle = this.controls.maxPolarAngle = 0.9 + 0.4 * ( ( 15 - cameraDistance ) / 7 );

    //if ( camera.update ) {
      this.renderer.render( this.scene, this.camera );
      this.camera.update = false;
    //}

  }

}
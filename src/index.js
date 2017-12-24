import * as THREE from 'three';
import OrbitControls from './lib/OrbitControlsr89.js';

var scene, renderer, camera, controls, cube;

setScene();

function setScene () {

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( innerWidth, innerHeight );
  document.body.appendChild( renderer.domElement );

  scene = new THREE.Scene();

  cube = new THREE.Mesh(
    new THREE.BoxGeometry( 1, 1, 1 ),
    new THREE.MeshBasicMaterial()
  );
  scene.add( cube );

  setView();

  animate();

}

function setView () {

  camera = new THREE.PerspectiveCamera( 70, innerWidth / innerHeight, 1, 100 );
  camera.position.z = 5;
  camera.update = false;

  OrbitControls( THREE );

  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', function () { camera.update = true; }, false );
  controls.enableDamping = true;
  controls.dampingFactor = .05;
  controls.rotateSpeed = .07;

  window.addEventListener( 'resize', function () {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( innerWidth, innerHeight );
    camera.update = true;
  }, false );

}

function animate () {

  requestAnimationFrame( animate );

  cube.rotation.y += .005;

  controls.update();

  //if ( camera.update ) {
    renderer.render( scene, camera );
    camera.update = false;
  //}

}
import Sky from './../lib/Skyr89.js';
import { Object3D, DirectionalLight, AmbientLight, CameraHelper } from 'three';
import { TweenLite } from 'gsap';

import DAYTIMES from './../constants/dayTimes';

export default class Environment {

  constructor ( renderer, scene, camera ) {

    this.scene = scene;

    this.setLighting();

    this.setSky();

    const sun = this.sun;

    /* INTERACTION API */
    for ( let dayTime in DAYTIMES ) {

      this[ 'make' + dayTime ] = () => {

        TweenLite.to( sun.position, 2, {
          x: DAYTIMES[ dayTime ][ 0 ], 
          y: DAYTIMES[ dayTime ][ 1 ], 
          z: DAYTIMES[ dayTime ][ 2 ],
          onUpdate () {
            sky.material.uniforms.sunPosition.value.copy( sun.position );
            camera.update = true;
            renderer.shadowMap.needsUpdate = true;
          }
        });

      }

    }

  }

  setLighting () {

    this.sun = new DirectionalLight( 0xffffff, 1 );
    this.sun.position.set( 
      DAYTIMES.Afternoon[ 0 ], 
      DAYTIMES.Afternoon[ 1 ], 
      DAYTIMES.Afternoon[ 2 ]
    );
    Object.assign( this.sun.shadow.camera, {
      top: 30,
      left: -50,
      right: 30,
      bottom: -30,
      far: 200,
      near: 2
    });
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(4096,4096);
    const helper = new CameraHelper( this.sun.shadow.camera );

    this.ambient = new AmbientLight( 0xaaaacc );
    this.ambient.intensity = 0.5;

    this.scene.add( this.sun, this.ambient );

  }

  setSky () {

    const sky = new Sky();
    sky.scale.setScalar( 100 );

    sky.sunSphere = new Object3D();
    sky.sunSphere.position.set( 1, 1, 1 );
    sky.material.uniforms.sunPosition.value.copy( this.sun.position );

    this.scene.add( sky );

    this.sky = sky;

  }

}
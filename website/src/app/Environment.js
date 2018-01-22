import Sky from './../lib/Skyr89.js';
import { Object3D, DirectionalLight, AmbientLight, CameraHelper } from 'three';
import { TweenLite } from 'gsap';

import { DAYTIMES, defaultDayTime } from './../constants/dayTimes';

export default class Environment {

  constructor ( renderer, scene, camera, city ) {

    const that = this;

    this.scene = scene;

    this.setLighting();

    this.setSky();

    this.activeDayTime = 'Journée';
    this.targetDayTime = 'Journée';

    const sun = this.sun,
      sky = this.sky;

    /* INTERACTION API */
    for ( let dayTime in DAYTIMES ) {

      this[ 'make' + dayTime ] = () => {

        if ( that.targetDayTime === dayTime ) return;

        that.targetDayTime = dayTime;

        TweenLite.to( 
          sun.position, 
          2, 
          {
            x: DAYTIMES[ dayTime ][ 0 ], 
            y: DAYTIMES[ dayTime ][ 1 ], 
            z: DAYTIMES[ dayTime ][ 2 ],
            onUpdate () {
              sky.material.uniforms.sunPosition.value.copy( sun.position );
              camera.update = true;
              renderer.shadowMap.needsUpdate = true;
            }
          }
        );

        const treesColorTween = { value: 0 };

        TweenLite.to(
          treesColorTween,
          2,
          {
            value: 1,
            onUpdate () {
              let v;
              if ( dayTime === 'Journée' ) v = treesColorTween.value * 0.5 + 0.5;
              else if ( that.activeDayTime === 'Journée' ) v = ( 1 - treesColorTween.value ) * 0.5 + 0.5;
              else v = ( 1 - ( ( 2 * treesColorTween.value - 1 ) ** 2 ) ) * 0.5 + 0.5;
              city.setBasicMaterialsIntensity( v );
            },
            onComplete () {
              that.activeDayTime = dayTime;
            }
          }
        );

      }

    }

  }

  setLighting () {

    this.sun = new DirectionalLight( 0xffffff, 1 );
    this.sun.position.set( 
      DAYTIMES[ defaultDayTime ][ 0 ], 
      DAYTIMES[ defaultDayTime ][ 1 ], 
      DAYTIMES[ defaultDayTime ][ 2 ]
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
    const mapSize = window.devicePixelRatio > 1.1 ? 2048 : 4096;
    this.sun.shadow.mapSize.set( mapSize, mapSize );
    const helper = new CameraHelper( this.sun.shadow.camera );

    this.ambient = new AmbientLight( 0xaaaacc );
    this.ambient.intensity = 0.4;

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
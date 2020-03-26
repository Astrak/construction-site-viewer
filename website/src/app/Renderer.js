import { WebGLRenderer, CineonToneMapping } from 'three';
import { EffectComposer } from './../lib/EffectComposer';
//import CopyShader from './../lib/CopyShader';
import ShaderPass from './../lib/ShaderPass';
import RenderPass from './../lib/RenderPass';
import FXAAShader from './../lib/FXAAShader';
//import SAOPass from './../lib/SAOPass';

import './Renderer.css';

export default class Renderer {

  constructor ( viewer ) {

    this.viewer = viewer;

    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio( window.location.hash === 'low' ? 1 : window.devicePixelRatio );
    this.renderer.setSize( innerWidth, innerHeight );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.renderSingleSided = false;
    this.renderer.gammaInput = this.renderer.gammaOutput = true;
    this.renderer.toneMapping = CineonToneMapping;
    document.getElementById( 'app' ).appendChild( this.renderer.domElement );

    this.onUpdate = function () {};

    this.lastRenderTime = performance.now();

  }

  resize () {

    if ( this.isDevice ) {

      this.renderer.setSize( innerWidth, innerHeight );

    } else {

      this.renderer.setSize( innerWidth, innerHeight );
      this.composer.setSize( innerWidth, innerHeight );

      if ( this.fxaaPass ) {
        this.fxaaPass.uniforms.resolution.value.set(
          1 / innerWidth,
          1 / innerHeight
        );
      }

    }

  }

  setRendering ( scene, camera, controls ) {

    this.isDevice = window.devicePixelRatio > 1.1;//IE11 returns 1.001 i think.

    if ( ! this.isDevice ) {

      const saoParams  = {
        saoBias: 0.5,
        saoIntensity: 0.02,
        saoScale: 30,
        saoKernelRadius: 10,
        saoMinResolution: 0,
        saoBlur: true,
        saoBlurRadius: 8,
        saoBlurStdDev: 1.3,
        saoBlurDepthCutoff: 0.01,
      };

      this.composer = new EffectComposer( this.renderer );
      this.composer.addPass( new RenderPass( scene, camera ) );

      /*this.SAOPass = new SAOPass( scene, camera, false, true );   
      Object.assign( this.SAOPass.params, {
        saoBias: saoParams.saoBias,
        saoIntensity: saoParams.saoIntensity,
        saoScale: saoParams.saoScale,
        saoKernelRadius: saoParams.saoKernelRadius,
        saoMinResolution: saoParams.saoMinResolution,
        saoBlur: saoParams.saoBlur,
        saoBlurRadius: saoParams.saoBlurRadius,
        saoBlurStdDev: saoParams.saoBlurStdDev,
        saoBlurDepthCutoff: saoParams.saoBlurDepthCutoff
      }); 
      this.composer.addPass( this.SAOPass );*/

      this.fxaaPass = new ShaderPass( FXAAShader );
      this.fxaaPass.uniforms.resolution.value.set(
        1 / ( window.devicePixelRatio * innerWidth ),
        1 / ( window.devicePixelRatio * innerHeight )
      );
      this.composer.addPass( this.fxaaPass );
      this.fxaaPass.renderToScreen = true;

      //this.copyPass = new ShaderPass( CopyShader );
      //this.copyPass.renderToScreen = true;
      //this.composer.addPass( this.copyPass );

    }

    this.camera = camera;
    this.scene = scene;
    this.controls = controls;

  }

  animate () {

    requestAnimationFrame( this.animate.bind( this ) );

    //controls
    const cameraDistance = this.cameraDistance || this.camera.position.clone().sub( this.controls.target ).length();
    this.controls.minPolarAngle = this.controls.maxPolarAngle = 1 + 0.4 * ( ( 10 - cameraDistance ) / 5 );

    this.controls.update();

    //seasons and water (uniforms update)
    this.currentRenderTime = performance.now();
    const timeDiff = this.currentRenderTime - this.lastRenderTime;
    this.lastRenderTime = this.currentRenderTime;

    let yearTime;
    this.viewer.objectsList.forEach( object => {
      if ( object.material && object.material.yearTime ) {
        if ( ! yearTime ) {
          yearTime = object.material.yearTime.value;
          yearTime = ( yearTime + timeDiff / 32 / 1000 ) % 1
        }
        object.material.yearTime.value = yearTime;
      }
    });

    if ( this.water ) this.water.material.uniforms.time.value += timeDiff / 1000;

    //render rules
    if ( this.camera.update || this.viewer.userIsViewing ) {

      if ( this.isDevice ) {//better benefit pixelratio than fxaa, if pr > 1 (?)
        this.renderer.render( this.scene, this.camera );
      } else {
        this.composer.render( 0.016 );
      }

      this.camera.update = false;

      this.onUpdate();

    }

  }

}
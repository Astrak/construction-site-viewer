import { WebGLRenderer, CineonToneMapping } from 'three';
import { EffectComposer } from './../lib/EffectComposer';
import CopyShader from './../lib/CopyShader';
import ShaderPass from './../lib/ShaderPass';
import RenderPass from './../lib/RenderPass';
import FXAAShader from './../lib/FXAAShader';
import SAOPass from './../lib/SAOPass';

export default class Renderer {

  constructor () {

    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio( Math.min( 1, window.devicePixelRatio ) );
    this.renderer.setSize( innerWidth, innerHeight );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.gammaInput = this.renderer.gammaOutput = true;
    this.renderer.toneMapping = CineonToneMapping;
    document.getElementById( 'app' ).appendChild( this.renderer.domElement );

  }

  resize () {

    this.renderer.setSize( innerWidth, innerHeight );

    if ( this.fxaaPass ) {
      this.fxaaPass.uniforms.resolution.value.set(
        1 / ( window.devicePixelRatio * innerWidth ),
        1 / ( window.devicePixelRatio * innerHeight )
      );
    }

  }

  setRendering ( scene, camera, controls ) {

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

    this.SAOPass = new SAOPass( scene, camera, false, true );   
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
    this.composer.addPass( this.SAOPass );

    this.fxaaPass = new ShaderPass( FXAAShader );
    this.fxaaPass.uniforms.resolution.value.set(
      1 / ( window.devicePixelRatio * innerWidth ),
      1 / ( window.devicePixelRatio * innerHeight )
    );
    this.composer.addPass( this.fxaaPass );

    this.copyPass = new ShaderPass( CopyShader );
    this.copyPass.renderToScreen = true;
    this.composer.addPass( this.copyPass );

    this.camera = camera;
    this.scene = scene;
    this.controls = controls;

  }

  animate () {

    requestAnimationFrame( this.animate.bind( this ) );

    const cameraDistance = this.camera.position.clone().sub( this.controls.target ).length();
    this.controls.minPolarAngle = this.controls.maxPolarAngle = 1 + 0.4 * ( ( 10 - cameraDistance ) / 5 );

    this.controls.update();

    if ( this.camera.update ) {
      this.composer.render( 0.016 );
      this.camera.update = false;
    }

  }

}
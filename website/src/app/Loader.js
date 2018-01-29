import { Group, Mesh, MeshLambertMaterial, LinearFilter, MeshBasicMaterial, ShaderMaterial, DoubleSide, FrontSide, TextureLoader } from 'three';
import PLYLoader from './../lib/PLYLoaderr89.js';

import EventEmitter from 'events';

import ASSETS from './../constants/assets';

export default class Loader extends EventEmitter {

  constructor ( renderer, camera, rootObject, objectsList, tweenedColorObjects ) {

    super();

    this.loader = new PLYLoader();
    this.tLoader = new TextureLoader();

    this.renderer = renderer;
    this.camera = camera;
    this.rootObject = rootObject;
    this.objectsList = objectsList;
    this.tweenedColorObjects = tweenedColorObjects;

  }

  start () {

    this.loadTextures();

  }

  loadTextures () {

    const that = this;

    this.textures = {};
    for ( let k in ASSETS ) {
      const fileName = ASSETS[ k ].map;
      if ( fileName && ! this.textures[ fileName ] ) this.textures[ fileName ] = ASSETS[ k ].minFilter === 'linear';
    }

    const texturesArray = Object.keys( this.textures ),
      texturesLength = texturesArray.length;

    this.loadCount = 0;
    this.totalAssetsNumber = Object.keys( ASSETS ).length + texturesLength;

    for ( let fileName in this.textures ) {
      this.tLoader.load( 'public/img/' + fileName, t => {
        t.anisotropy = 4;
        if ( that.textures[ fileName ] ) t.minFilter = LinearFilter;
        that.textures[ fileName ] = t;
        that.loadCount ++;
        that.emit( 'asset-loaded', that.loadCount / that.totalAssetsNumber );
        if ( that.loadCount === texturesLength ) that.loadGeometries();
      });
    }

  }

  loadGeometries () {

    const that = this;

    for ( let k in ASSETS ) {

      this.loader.load( 'public/geometries/' + ASSETS[ k ].file, g => {

        const ASSET = ASSETS[ k ];

        //geometry
        if ( ASSET.useUv2 ) g.addAttribute( 'uv2', g.attributes.uv );

        //material
        let material;
        const matOptions = {
          map: this.textures[ ASSET.map ] || null,
          color: ASSET.color === undefined ? 0xffffff : ASSET.color,
          side: ASSET.side === 'double' ? DoubleSide : FrontSide,
          alphaTest: ASSET.alphaTest || 0,
          transparent: ASSET.transparent === true
        };
        switch ( ASSET.material ) {
          case 'basic': 
            material = new MeshBasicMaterial( matOptions ); 
            break;
          case 'lambert': 
          default:
            material = new MeshLambertMaterial( matOptions ); 
            break;
        }

        //mesh
        const mesh = new Mesh( g, material );
        mesh.name = k;
        mesh.castShadow = true;
        mesh.receiveShadow = ASSET.receiveShadow !== false;
        mesh.matrixAutoUpdate = false;
        that.rootObject.add( mesh );
        that.objectsList.push( mesh );
        if ( ASSET.tweenColorWithDayLight ) that.tweenedColorObjects.push( mesh );
        Object.assign( mesh.userData, { begin: ASSET.begin, end: ASSET.end } );
        if ( ASSET.useCustomDepthMaterial ) mesh.customDepthMaterial = that.getCustomDepthMaterial( material.map );
          
        that.camera.update = true;

        that.loadCount ++;
        that.emit( 'asset-loaded', that.loadCount / that.totalAssetsNumber );
        if ( that.loadCount === that.totalAssetsNumber ) that.emit( 'assets-loaded' );

      });
      
    }

  }

  getCustomDepthMaterial ( map ) {

    return new ShaderMaterial({
      uniforms : { texture :  { value : map } },
      vertexShader : `
        varying vec2 vUV;
        void main() {
         vUV = 0.75 * uv;
         vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
         gl_Position = projectionMatrix * mvPosition;
        }`,
      fragmentShader : `
        #include <packing>
        uniform sampler2D texture;
        varying vec2 vUV;
        void main() {
         vec4 pixel = texture2D( texture, vUV );
         if ( pixel.a < 0.7 ) discard;
         gl_FragData[ 0 ] = packDepthToRGBA( gl_FragCoord.z );
        }`,
      side: DoubleSide
    });

  }

}
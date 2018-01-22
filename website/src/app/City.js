import { Group, Mesh, MeshLambertMaterial, LinearFilter, MeshBasicMaterial, ShaderMaterial, DoubleSide, TextureLoader } from 'three';
import PLYLoader from './../lib/PLYLoaderr89.js';

import EventEmitter from 'events';

import ASSETS from './../constants/assets';

export default class City extends EventEmitter {

  constructor ( renderer, scene, camera ) {

    super();

    this.loader = new PLYLoader();
    this.tLoader = new TextureLoader();

    this.objectsList = [];

    const city = new Group();
    city.position.set( 50, 0, 25 );
    scene.add( city );
    this.group = city;

    const that = this;

    this.basicMaterialsObjects = [];

    const totalAssetsNumber = Object.keys( ASSETS ).length;

    let loadedAssetsCount = 0;

    for ( let k in ASSETS ) {

      this.loader.load( 'public/geometries/' + ASSETS[ k ].file, g => {

        if ( k === 'bats' ) g.addAttribute( 'uv2', g.attributes.uv );

        const material = ( ASSETS[ k ].file.indexOf( 'arbres' ) > -1 ) ? 
          new MeshBasicMaterial()
          : new MeshLambertMaterial({
            color: ASSETS[ k ].tempColor ? ASSETS[ k ].tempColor : 0xffffff
          });

        if ( ASSETS[ k ].file.indexOf( 'arbres' ) > -1 ) {
          material.side = DoubleSide,
          material.map = that.tLoader.load( ASSETS[ k ].file.indexOf( 'nouveau' ) > -1 ? 'public/img/erable.png' : 'public/img/platane.png', () => renderer.shadowMap.needsUpdate = true ),
          material.alphaTest = 0.7,
          material.transparent = true
        }

        if ( ASSETS[ k ].file.indexOf( 'vehicules' ) > -1 ) {
          material.transparent = true;
        }

        if ( ASSETS[ k ].tex ) material.map = this.tLoader.load( 'public/img/' + ASSETS[ k ].tex, t => t.anisotropy = 4 );

        const mesh = new Mesh( g, material );

        mesh.name = k;

        mesh.castShadow = mesh.receiveShadow = true;
        renderer.shadowMap.needsUpdate = true;

        mesh.matrixAutoUpdate = false;

        if ( ASSETS[ k ].file.indexOf( 'arbres' ) > -1 || ASSETS[ k ].file.indexOf( 'vehicules' ) > -1 ) {

          that.basicMaterialsObjects.push( mesh );

          material.map.minFilter = LinearFilter;

          mesh.customDepthMaterial = new ShaderMaterial({
            uniforms : { texture :  { value : material.map } },
            vertexShader : [
              'varying vec2 vUV;',
              'void main() {',
              ' vUV = 0.75 * uv;',
              ' vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
              ' gl_Position = projectionMatrix * mvPosition;',
              '}'
            ].join( '\n' ),
            fragmentShader : [
              '#include <packing>',
              'uniform sampler2D texture;',
              'varying vec2 vUV;',
              'void main() {',
              ' vec4 pixel = texture2D( texture, vUV );',
              ' if ( pixel.a < 0.7 ) discard;',
              ' gl_FragData[ 0 ] = packDepthToRGBA( gl_FragCoord.z );',
              '}'
            ].join( '\n' ),
            side: DoubleSide
          });

          mesh.receiveShadow = false;

        }

        city.add( mesh );

        Object.assign( 
          mesh.userData, 
          {
            begin: ASSETS[ k ].begin,
            end: ASSETS[ k ].end
          }
        );

        that.objectsList.push( mesh );

        camera.update = true;

        loadedAssetsCount++;

        that.emit( 'asset-loaded', loadedAssetsCount / totalAssetsNumber );

        if ( loadedAssetsCount === totalAssetsNumber ) that.emit( 'assets-loaded' );

      });
      
    }

  }

  setBasicMaterialsIntensity ( v ) {

    this.basicMaterialsObjects.forEach( object => object.material.color.setRGB( v, v, v ) );

  }

}
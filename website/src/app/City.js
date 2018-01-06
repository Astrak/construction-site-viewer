import { Group, Mesh, MeshLambertMaterial, TextureLoader } from 'three';
import PLYLoader from './../lib/PLYLoaderr89.js';

import eventEmitter from 'events';

import ASSETS from './../constants/assets';

export default class City extends eventEmitter {

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

    const totalAssetsNumber = Object.keys( ASSETS ).length;

    let loadedAssetsCount = 0;

    for ( let k in ASSETS ) {

      this.loader.load( 'public/geometries/' + ASSETS[ k ].file, g => {

        if ( k === 'bats' ) g.addAttribute( 'uv2', g.attributes.uv );

        const mesh = new Mesh( 
          g, 
          new MeshLambertMaterial({
            color: k.indexOf( 'route' ) > -1 || k.indexOf( 'villegoudou' ) > -1 ? 0x222222 : k === 'bats' ? 0xaa8866 : k.indexOf( 'trottoir' ) > -1 ? 0x444444 : 0xffffff,
            aoMap: k === 'bats' ? that.tLoader.load( 'public/img/bats_ao.png' ) : null,
            aoMapIntensity: 1.2
          }) 
        );

        mesh.name = k;

        mesh.castShadow = mesh.receiveShadow = true;
        renderer.shadowMap.needsUpdate = true;

        mesh.matrixAutoUpdate = false;

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

}
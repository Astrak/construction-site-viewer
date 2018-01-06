import { Group, Mesh, MeshLambertMaterial, TextureLoader } from 'three';
import PLYLoader from './../lib/PLYLoaderr89.js';

import ASSETS from './../constants/assets';

export default class City {

  constructor ( renderer, scene, camera ) {

    this.loader = new PLYLoader();
    this.tLoader = new TextureLoader();

    const city = new Group();
    city.position.set( 50, 0, 25 );
    scene.add( city );
    this.group = city;

    const that = this;

    for ( let k in ASSETS ) {
      this.loader.load( 'public/geometries/' + ASSETS[ k ].file, g => {
        if ( k === 'bats' ) g.addAttribute( 'uv2', g.attributes.uv );
        const mesh = new Mesh( 
          g, 
          new MeshLambertMaterial({
            color: k === 'routes' ? 0x222222 : k === 'bats' ? 0xaa8866 : k === 'trottoirs' ? 0xaaaaaa : 0xffffff,
            aoMap: k === 'bats' ? that.tLoader.load( 'public/img/bats_ao.png' ) : null,
            aoMapIntensity: 1.2
          }) 
        );
        mesh.castShadow = mesh.receiveShadow = true;
        mesh.matrixAutoUpdate = false;
        city.add( mesh );
        renderer.shadowMap.needsUpdate = true;
        camera.update = true;
      });
    }

  }

}
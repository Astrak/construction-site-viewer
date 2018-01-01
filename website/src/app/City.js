import { Group, Mesh, MeshLambertMaterial } from 'three';
import PLYLoader from './../lib/PLYLoaderr89.js';

import ASSETS from './../constants/assets';

export default class City {

  constructor ( renderer, scene, camera ) {

    this.loader = new PLYLoader();

    const city = new Group();
    city.position.set( 50, 0, 25 );
    scene.add( city );
    this.group = city;

    for ( let k in ASSETS ) {
      this.loader.load( 'public/geometries/' + ASSETS[ k ], g => {
        const mesh = new Mesh( 
          g, 
          new MeshLambertMaterial({
            color: k === 'routes' ? 0x222222 : k === 'bats' ? 0xaa8866 : k === 'trottoirs' ? 0xaaaaaa : 0xffffff
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
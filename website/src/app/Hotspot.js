import TweenLite from 'gsap';
import { Sprite, SpriteMaterial, TextureLoader } from 'three'

export default class Hotspot {
  
  constructor ( parent, crds, name ) {

    const that = this;
    const tLoader = new TextureLoader();

    this.sprite = new Sprite( 
      new SpriteMaterial({
        transparent: true,
        opacity: 1,
        depthTest: false,
        depthWrite: false,
        map: tLoader.load( 'public/img/hotspot.png' )
      })
    );
    this.sprite.name = name;
    //this.sprite.matrixAutoUpdate = false;
    this.sprite.scale.multiplyScalar( 0.7 );
    this.sprite.position.set( crds[ 0 ], 1, crds[ 2 ] );
    this.sprite.matrixNeedsUpdate = true;
    parent.add( this.sprite );

    this.hiding = false;

  }

  show () {

    if ( ! this.hiding ) return;

    const that = this;

    const sprite = this.sprite;
    sprite.visible = true;
    sprite.material.opacity = 0;
    TweenLite.to( 
      sprite.material, 
      1, 
      { 
        opacity: 1,
        onComplete () {
          that.hiding = false;
        }
      }
    );

  }

  hide () {

    const sprite = this.sprite;
    sprite.visible = true;
    sprite.material.opacity = 1;
    TweenLite.to( 
      sprite.material, 
      1, 
      { 
        opacity: 0, 
        onComplete () { 
          sprite.visible = false; 
        } 
      }
    );

    this.hiding = true;
    
  }

}
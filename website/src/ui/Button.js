import './Button.css';

export default class Button {

  constructor ( content, id = '' ) {

    this.domElement = document.createElement( 'button' );
    this.domElement.id = id;
    this.domElement.className = 'ui-button';
    this.domElement.innerHTML = content;

  }

  select () {

    this.domElement.classList.add( 'ui-button-selected' );

  }

  unselect () {

    this.domElement.classList.remove( 'ui-button-selected' );

  }

}
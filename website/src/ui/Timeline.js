import ASSETS from './../constants/assets';

import './Timeline.css';

const NSString = "http://www.w3.org/2000/svg";

export default class Timeline {

  constructor ( viewer, container ) {

    const userDate = new Date();

    this.beginningDate = { year: 2017, month: 10 };

    this.endDate = { year: 2020, month: 1 };

    this.currentDate = {
      year: userDate.getFullYear(),
      month: userDate.getMonth(),
      day: userDate.getDay()
    };

    this.activeDate = {
      year: userDate.getFullYear(),
      month: userDate.getMonth()
    };

    this.viewer = viewer;
    this.viewer.city.on( 'assets-loaded', this.setSceneContentToDate.bind( this ) );

    /* UI Elements */
    //container
    this.domElement = document.createElement( 'div' );
    this.domElement.id = 'ui-timeline';
    container.appendChild( this.domElement );

    //svg container for dates and months
    this.captionElement = document.createElementNS( NSString, 'svg' );
    this.captionElement.setAttribute( 'viewBox', '0 0 100 10' );
    this.captionElement.style.opacity = 0.5;
    this.captionElement.id = 'ui-timeline-caption';
    this.fillCaption( this.captionElement );
    this.domElement.appendChild( this.captionElement );

    //current date element
    this.currentDateElement = document.createElement( 'span' );
    this.currentDateElement.id = 'ui-timeline-current-date';
    this.currentDateElement.style.left = this.getPositionFromDate( this.currentDate ) + '%';
    this.domElement.appendChild( this.currentDateElement );

    //active date element
    this.activeDateElement = document.createElement( 'span' );
    this.activeDateElement.id = 'ui-timeline-selector';
    this.activeDateElement.style.left = this.getPositionFromDate( this.activeDate ) + '%';
    this.domElement.appendChild( this.activeDateElement );

    /* LISTENERS */
    this.pickTime = this.pickTime.bind( this );
    this.onMouseDown = this.onMouseDown.bind( this );
    this.onMouseUp = this.onMouseUp.bind( this );
    this.domElement.addEventListener( 'mousedown', this.onMouseDown, false );
    this.domElement.addEventListener( 'touchstart', this.onMouseDown, false );
    window.addEventListener( 'mousemove', this.pickTime, false );
    window.addEventListener( 'touchmove', this.pickTime, false );
    window.addEventListener( 'mouseup', this.onMouseUp, false );
    window.addEventListener( 'touchend', this.onMouseUp, false );

  }

  fillCaption ( captionElement ) {

    const date = JSON.parse( JSON.stringify( this.beginningDate ) );

    while ( ! ( date.month === ( this.endDate.month ) && date.year === this.endDate.year ) ) {

      date.month ++;

      const monthRect = document.createElementNS( NSString, 'rect' );
      monthRect.setAttribute( 'fill', '#000' );
      monthRect.setAttribute( 'x', this.getPositionFromDate( date ) );
      monthRect.setAttribute( 'y', '4' );
      monthRect.setAttribute( 'width', '0.2' );
      monthRect.setAttribute( 'height', '1' );
      captionElement.appendChild( monthRect );

      if ( date.month === 12 ) {

        date.month = 0;
        date.year ++;

        const yearText = document.createElementNS( NSString, 'text' );
        yearText.setAttribute( 'stroke', '#000' );
        yearText.setAttribute( 'stroke-width', '0.1' );
        yearText.setAttribute( 'text-anchor', 'middle' );
        yearText.setAttribute( 'font-size', '2' );
        yearText.setAttribute( 'x', this.getPositionFromDate( date ) );
        yearText.setAttribute( 'y', '3' );
        yearText.innerHTML = date.year;
        captionElement.appendChild( yearText );

      }

    }

  }

  onMouseDown ( e ) {

    this.mouseDown = true;

    this.pickTime( e );

  }

  onMouseUp () {

    this.mouseDown = false;

  }

  pickTime ( e ) {

    e.preventDefault();
    e.stopPropagation();

    if ( ! this.mouseDown ) return;

    const offsetWidth = e.target.offsetWidth;

    const x = e.touches && e.touches.length && e.touches[ 0 ] ? 
      ( e.touches[ 0 ].pageX - e.target.offsetLeft ) / offsetWidth : 
      ( e.pageX - e.target.offsetLeft ) / offsetWidth;

    const relativePosition = Math.min( 0.999, Math.max( 0.001, x ) ) * 100;

    this.activeDateElement.style.left = relativePosition + '%';

    const date = this.getDateFromPosition( relativePosition );

    this.setSceneContentToDate( date );

  }

  getDateFromPosition ( relativePosition ) {

    const totalMonthsSpan = ( this.endDate.year * 12 + this.endDate.month ) - ( this.beginningDate.year * 12 + this.beginningDate.month );
    const relativeMonth = Math.floor( relativePosition / 100 * totalMonthsSpan );
    const date = { year: this.beginningDate.year, month: this.beginningDate.month + relativeMonth };

    while ( date.month > 11 ) {
      date.month -= 12;
      date.year ++;
    }

    return date;

  }

  getPositionFromDate ( date ) {

    const totalMonthsSpan = ( this.endDate.year * 12 + this.endDate.month ) - ( this.beginningDate.year * 12 + this.beginningDate.month );
    const currentMonthDuration = Math.min( totalMonthsSpan, Math.max( 0, ( date.year * 12 + date.month + ( date.day ? date.day / 31 : 0 ) ) - ( this.beginningDate.year * 12 + this.beginningDate.month ) ) );

    return 100 * currentMonthDuration / totalMonthsSpan;

  }

  setSceneContentToDate ( date = this.currentDate ) {

    const that = this;

    const relativeDate = this.getPositionFromDate( date );

    this.viewer.city.objectsList.forEach( object => {

      const data = object.userData;

      const beginDate = data.begin ? data.begin : that.beginningDate;
      const objectRelativeBeginDate = that.getPositionFromDate( beginDate ); 

      const endDate = data.end ? data.end : that.endDate;
      const objectRelativeEndDate = that.getPositionFromDate( endDate )

      object.visible = relativeDate >= objectRelativeBeginDate 
                    && relativeDate < objectRelativeEndDate;

    });

    this.viewer.renderer.renderer.shadowMap.needsUpdate = true;
    this.viewer.camera.update = true;

  }

}
import ASSETS from './../constants/assets';
import HOTSPOTS from './../constants/hotspots';

import './Timeline.css';

const NSString = "http://www.w3.org/2000/svg";

export default class Timeline {

  constructor ( viewer, activeModes, container ) {

    const userDate = new Date();

    this.beginningDate = { year: 2017, month: 10 };

    this.endDate = { year: 2020, month: 2 };

    this.currentDate = {
      year: userDate.getFullYear(),
      month: userDate.getMonth(),
      day: userDate.getDate()
    };

    this.activeDate = {
      year: this.currentDate.year,
      month: this.currentDate.month
    };

    this.viewer = viewer;

    this.activeModes = activeModes;

    /* UI Elements */
    this.container = container;
    //domElement
    this.domElement = document.createElement( 'div' );
    this.domElement.id = 'ui-timeline';

    //svg container for dates and months
    this.captionElement = document.createElementNS( NSString, 'svg' );
    this.captionElement.id = 'ui-timeline-caption';
    this.captionBottomValue = '7';
    this.captionTweenUnderBottomValue = parseFloat( this.captionBottomValue ) + 3;
    this.captionElement.setAttribute( 'viewBox', '0 0 100 ' + this.captionBottomValue );
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
    this.activeDateElement.style.left = this.getPositionFromDate( this.beginningDate ) + '%';
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

  show () {

    //1. re-render in case there is uncompiled materials that could break the animation
    this.viewer.renderer.renderer.shadowMap.needsUpdate = true;
    this.viewer.camera.update = true;

    const that = this;

    const tween = { value: 3, lastSceneUpdate: 3 };

    //2. animate appearance
    this.container.appendChild( this.domElement );

    //3. and tween the construction
    let animation;
    animation = TweenLite.to(
      tween,
      5,
      {
        value: 97,
        delay: 1,
        ease: Power0.easeNone,
        onUpdate () {
          if ( that.wantsPickTime ) return animation.kill();
          that.activeDateElement.style.left = tween.value + '%';
          that.activeDate = that.getDateFromPosition( parseFloat( that.activeDateElement.style.left ) );
          if ( ( tween.value - tween.lastSceneUpdate ) > 5 ) {
            that.setSceneContentToDate( that.activeDate );
            tween.lastSceneUpdate = tween.value;
          }
        }
      }
    );

  }

  fillCaption ( captionElement ) {

    //1. construction spans in the background
    this.constructionsSpans = {};
    for ( let k in HOTSPOTS ) {
      const constructionSpan = document.createElementNS( NSString, 'rect' );
      const startPosition = this.getPositionFromDate( HOTSPOTS[ k ].begin ),
        endPosition = this.getPositionFromDate( HOTSPOTS[ k ].end );
      constructionSpan.setAttribute( 'x', startPosition );
      constructionSpan.setAttribute( 'y', this.captionTweenUnderBottomValue );
      constructionSpan.setAttribute( 'width', endPosition - startPosition );
      constructionSpan.setAttribute( 'height', '0.5' );
      captionElement.appendChild( constructionSpan );
      this.constructionsSpans[ k ] = constructionSpan;
    }

    //2. caption rects and year text
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

    this.wantsPickTime = true;

    const offsetWidth = e.target.offsetWidth;

    const x = e.touches && e.touches.length && e.touches[ 0 ] ? 
      ( e.touches[ 0 ].pageX - e.target.offsetLeft ) / offsetWidth : 
      ( e.pageX - e.target.offsetLeft ) / offsetWidth;

    const relativePosition = Math.min( 0.999, Math.max( 0.03, x ) ) * 100;

    const date = this.getDateFromPosition( relativePosition );

    this.setDate( date );

  }

  setDate ( date ) {

    this.activeDate = date;

    this.activeDateElement.style.left = this.getPositionFromDate( date ) + '%';

    this.setSceneContentToDate( date );

  }

  getDateFromPosition ( relativePosition ) {

    const totalMonthsSpan = ( this.endDate.year * 12 + this.endDate.month ) - ( this.beginningDate.year * 12 + this.beginningDate.month );
    const totalDaysSpan = totalMonthsSpan * 30;
    const relativeDay = Math.floor( relativePosition / 100 * totalDaysSpan );
    const date = { year: this.beginningDate.year, month: this.beginningDate.month, day: ( this.beginningDate.day || 0 ) + relativeDay };

    while ( date.day > 30 ) {
      date.day -= 30;
      date.month ++;
    }
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

  setSceneContentToDate ( date = this.activeDate ) {

    const that = this;

    const relativeDate = this.getPositionFromDate( date );

    this.viewer.objectsList.forEach( object => {

      const data = object.userData;

      const beginDate = data.begin ? data.begin : that.beginningDate;
      const objectRelativeBeginDate = that.getPositionFromDate( beginDate ); 

      const endDate = data.end ? data.end : that.endDate;
      const objectRelativeEndDate = that.getPositionFromDate( endDate )

      object.visible = relativeDate > objectRelativeBeginDate 
                    && relativeDate < objectRelativeEndDate
                    && ( ! object.userData.mode || that.activeModes.indexOf( object.userData.mode ) > -1 );


    });

    this.viewer.renderer.renderer.shadowMap.needsUpdate = true;
    this.viewer.camera.update = true;

  }

  showConstructionSpan ( location ) {

    const that = this;

    if ( this.activeLocation ) this.hideConstructionSpan( this.activeLocation );

    const tween = { value: this.captionTweenUnderBottomValue };
    
    TweenLite.to(
      tween,
      1,
      {
        value: 4.5,
        onUpdate () { that.constructionsSpans[ location ].setAttribute( 'y', tween.value ); },
        onComplete () { that.activeLocation = location; }
      }
    );

  }

  hideConstructionSpan ( location ) {

    const that = this;

    const tween = { value: this.constructionsSpans[ location ].getAttribute( 'y' ) };

    TweenLite.to(
      tween,
      0.5,
      {
        value: this.captionTweenUnderBottomValue,
        onUpdate () {
          that.constructionsSpans[ location ].setAttribute( 'y', tween.value );
        }
      }
    );

  }

}
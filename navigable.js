var nav = function(){

    var _n = {};

    var l1, l2, l3, l4;

    var checkInit = function() { // select one _nect if none is selected
        if( _n.current.el === null){
          refreshListOfSelectableElements();
          var rnd = Math.floor(Math.random() * _n.listOfElements.length ) + 0;
          doNewSelection( rnd );
        };
    };

    var refreshListOfSelectableElements = function() {

      _n.listOfElements = document.getElementsByClassName('selectable');
    };

    var doNewSelection = function( num ) {

        if( num < 0) return

        //_n.listOfElements = document.getElementsByClassName('selectable');

        console.log( _n.listOfElements.length +" selectable elements.");

        if ( _n.listOfElements.length > 0){

          // paint numbers inside

          for (var i = 0; i < _n.listOfElements.length; i++) {
            _n.listOfElements[i].innerHTML = i;
          }

          // select one
          _n.current.el = _n.listOfElements[ num ];
          _n.current.domRect = _n.current.el.getBoundingClientRect();
          _n.current.c = _n.current.domRect.right - _n.current.domRect.left;
          _n.current.c = _n.current.domRect.bottom - _n.current.domRect.top;
          _n.current.w = _n.current.domRect.right - _n.current.domRect.left;
          _n.current.h = _n.current.domRect.bottom - _n.current.domRect.top;
          _n.current.cx = _n.current.domRect.left + _n.current.w/2;
          _n.current.cy = _n.current.domRect.top + _n.current.h/2;

          //$( _n.current.el ).addClass("is-selected");
          $(".selectable").removeClass("is-selected");
          $( _n.current.el ).addClass("is-selected");

          /*

          console.log("selected is: ", num );

          //draw lines
          if (l1 != undefined ) l1.remove();
          if (l2 != undefined ) l2.remove();
          if (l3 != undefined ) l3.remove();
          if (l4 != undefined ) l4.remove();

          l1 = dljs.line(_n.current.cx, _n.current.cy, _n.current.cx+100, _n.current.cy-100,"#ff0000" );
          l2 = dljs.line(_n.current.cx, _n.current.cy, _n.current.cx-100, _n.current.cy-100,"#ff0000" );
          l3 = dljs.line(_n.current.cx, _n.current.cy, _n.current.cx-100, _n.current.cy+100,"#ff0000" );
          l4 = dljs.line(_n.current.cx, _n.current.cy, _n.current.cx+100, _n.current.cy+100,"#ff0000" );

          // select one

          */

        } else {

          console.log("No selectable elements");
        }

    };

    var substract = function (a,b){
      var result = 0;
      if ( a === b ) return 0;
      if ( a > b ) return (a - b)
      return (b - a)
    };

    var calculateAllDistances = function() {

      var cdr = _n.current.domRect;
      this.listOfDistances = []; // clear
      for (var i = 0; i < _n.listOfElements.length; i++) {
          // calculate
          var el = _n.listOfElements[i];
          var domRect = el.getBoundingClientRect();
          var p = {};
          p.id = i;
          p.x1 = domRect.left;
          p.y1 = domRect.top;
          p.x2 = domRect.right;
          p.y2 = domRect.bottom;
          p.w = domRect.right - domRect.left;
          p.h = domRect.bottom - domRect.top;
          p.cx = domRect.left + p.w/2;
          p.cy = domRect.top + p.h/2;
          p.distance = getDistance();
          p.angle = getAngle();
          p.distance_axis_x = substract( p.cx, _n.current.cx );
          p.distance_axis_y = substract( p.cy, _n.current.cy );
          p.slope = null;
          this.listOfDistances.push( p );
      }

      console.log( "this.listOfDistances:", this.listOfDistances );
    };

    function takeADecision(direction) { // direction [1,2,3 or 4]
        // We´ve got:
        // 1) this.listOfDistances
        // 2) _n.current
        // so ...

        console.log(".");
        console.log("Take a decision...");
        console.log("this.listOfDistances", this.listOfDistances );
        console.log("_n.current", _n.current );
        console.log(".");

        var decisionIndex = -1; //-1

        var target = [];
        console.log(".a After filter 1, target: ", target );

        // FILTER 1

        // Remove some elements
        for (var i = 0; i < this.listOfDistances.length; i++) {

          if (  direction === 1 ) { // up

            if ( this.listOfDistances[i].cy < _n.current.cy ) target.push( this.listOfDistances[i] );
          }

          if (  direction === 2 ) { // right
            //console.log("i:", i );
            //console.log("this.listOfDistances[i]:", this.listOfDistances[i] );
            //console.log("this.listOfDistances[i].cx:", this.listOfDistances[i].cx );
            //console.log("_n.current.cx:", _n.current.cx );
            if ( this.listOfDistances[i].cx > _n.current.cx ) target.push( this.listOfDistances[i] );
          }

          if (  direction === 3 ) { // down

            if ( this.listOfDistances[i].cy > _n.current.cy ) target.push( this.listOfDistances[i] );
          }

          if (  direction === 4 ) { // left

            if ( this.listOfDistances[i].cx < _n.current.cx ) target.push( this.listOfDistances[i] );
          }
          
      }

      console.log(".b After filter 1, target: ", target );

      // Get the closest to the axis, menor dy
      var selectedObj = null;
      var minY = null;

      for (var i = 0; i < target.length; i++) {
          if (i === 0){
            selectedObj = target[0]; //.distance_axis_y;
            minY = target[0].distance_axis_y;
          } else {
            if( target[i].distance_axis_y < minY ){
              selectedObj = target[i]; //.distance_axis_y;
              minY = target[i].distance_axis_y;
            }
          }

        
      }

      decisionIndex = selectedObj.id;

      return decisionIndex;
    }

    function getDistance(){
      return 99.9
    };

    function getAngle(){
      return 45
    };

    // ------------------------------------
    // public
    // ------------------------------------


    _n.previousEl = null;

    //Selected element
    _n.current = {};
    _n.current.el = {};
    _n.current.domRect = null;
    _n.current.cx = null;
    _n.current.cy = null;
    _n.w = null;
    _n.h = null;
    _n.cx = null;
    _n.cy = null; 

    _n.listOfElements = [];
    _n.listOfDistances = [];

    _n.init = function(){
      checkInit();
      calculateAllDistances();
    };
    _n.moveUp = function() {
      checkInit();
      calculateAllDistances();
      var selectedIndex = takeADecision(1);
      doNewSelection( selectedIndex );
    };
    _n.moveDown = function() {
      checkInit();
      calculateAllDistances();
      var selectedIndex = takeADecision(3);
      doNewSelection( selectedIndex );
    };
    _n.moveRight = function() {
      checkInit();
      calculateAllDistances();
      var selectedIndex = takeADecision(2);
      doNewSelection( selectedIndex );
    };
    _n.moveLeft = function() {
      checkInit();
      calculateAllDistances();
      var selectedIndex = takeADecision(4);
      doNewSelection( selectedIndex );
    };
    _n.reset = function() {

      _n.current.el = null;

      checkInit();
      calculateAllDistances();
    };

    return _n
}

nav = nav();

$( document ).ready(function() {
    console.log( "ready!" );
    nav.reset();
});


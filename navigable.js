// 'use strict';

var appWindow = {};

appWindow.resize = function(){
    console.log("resize()!");
    var height = document.body.clientHeight;
    var width = document.body.clientWidth;

    /*
    if ( (width/height) < (1200/800) ){
        $("body").css("background-size","auto 100%");
    } else {
        $("body").css("background-size","100% auto");
    }
    */

    nav.setTotalWidth( width );
    nav.setTotalHeight( height );

}

//window.onload = appWindow.resize();

window.addEventListener("resize", appWindow.resize);

var nav = function(){

    var bodyw = 0; //document.body.clientWidth;
    var bodyh = 0; //document.body.clientHeight;

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

    var getBrowserWidth = function() {
        return document.documentElement.clientWidth;
    };

    var getBrowserHeight = function() {
        return document.documentElement.clientHeight;
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


          console.log("selected is: ", num );
          console.log("w:", bodyw );
          console.log("h:", bodyh );

          // Clear all previous guides
          dljs.clear();

          //dljs.linex(null,0  ,0  ,50 ,50 , 1, "#ff0000",0.8, true, 5, "#ff00ff");
          l1 = dljs.linex( null, _n.current.cx, _n.current.cy, _n.current.cx+2000, _n.current.cy-2000, 1, "#ff0000",0.8, true, 5, "#ff00ff");
          l2 = dljs.linex( null, _n.current.cx, _n.current.cy, _n.current.cx-2000, _n.current.cy-2000, 1, "#ff0000",0.8, true, 5, "#ff00ff");
          l3 = dljs.linex( null, _n.current.cx, _n.current.cy, _n.current.cx-2000, _n.current.cy+2000, 1, "#ff0000",0.8, true, 5, "#ff00ff");
          l4 = dljs.linex( null, _n.current.cx, _n.current.cy, _n.current.cx+2000, _n.current.cy+2000, 1, "#ff0000",0.8, true, 5, "#ff00ff");

          l6 = dljs.linex( null, 0, _n.current.cy, bodyw, _n.current.cy, 1, "#00ff00",0.5, true, 5, "#ff00ff"); // x axis
          l7 = dljs.linex( null, _n.current.cx, 0, _n.current.cx, bodyh, 1, "#00ff00",0.5, true, 5, "#ff00ff"); // y axis

          // select one

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

    function takeADecision( direction ) { // direction [1,2,3 or 4]
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
    _n.setTotalWidth = function( val ) {
      bodyw = val;
    };
    _n.setTotalHeight = function( val ){
      bodyh = val;
    }

    return _n
}

nav = nav();

$( document ).ready(function() {
    console.log( "ready!" );
    nav.reset();
    appWindow.resize();
});


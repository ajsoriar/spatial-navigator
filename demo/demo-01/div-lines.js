/**
 * div-lines
 * Small and simple utility library to draw lines just using javascript and HTML Document Object Model. No JQuery needed.
 * @version v1.2.0 - 2017-11-18
 * @link https://github.com/ajsoriar/div-lines
 * @author Andres J. Soria R. <ajsoriar@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
 
(function() {

    "use strict";

    window.dljs = {
      "el": null,
      "boards":[],
      "pointer":{
        x:0,
        y:0
      }
    };

  /*

  dljs.previous = {
    x1: null,
    y1: null,
    x2: null,
    y2: null,
    weight: null,
    color: null,
    opacity: null,
    roundBorder: null,
    longSombra: null, 
    colSombra: null
  };
  
  dljs.stickyLine = function() {
    
  };

  */

  dljs.init = function ( el ) {

    console.log("dljs.init()");

    if (!el){

      // create

      /*
      var strId = "dljs-"+ Date.now();
      this.el = document.createElement('ul');
      this.el.setAttribute("id", strId );
      this.el.setAttribute("style", "position: absolute; top: 0; left: 0; width: 0; height: 0; background-color: transparent; display: inline-block; margin: 0; padding: 0; list-style: none;");
      document.body.appendChild(this.el);
      */

      this.createBoard();

    } else {

      this.el = document.getElementById( el );
    }

    return this
  };

  dljs.line = function (x1,y1,x2,y2,thickness,color) {
    if (!this.el) this.init();
    if (color === "RANDOM") color = this.utils.getRandomColor();
    if (color === null) color = "#000";
    if (thickness === null) thickness = 2;
    var new_content = dljs.getLineString(null,x1,y1,x2,y2, thickness, color, 1, false, 0, null);
    this.draw( new_content );
    this.goTo(x2,y2);
    return this.el.lastElementChild
  };

  dljs.linex = function (idString,x1,y1,x2,y2,weight,color,opacity, roundBorder, longSombra, colSombra){ // extended functionality
    if (!this.el) this.init();
    if (color === "RANDOM") color = this.utils.getRandomColor();
    if (color === null) color = "#000";
    var new_content = dljs.getLineString(idString,x1,y1,x2,y2,weight,color,opacity, roundBorder, longSombra, colSombra);
    this.draw( new_content );
    this.goTo(x2,y2);
    return this.el.lastElementChild
  };

  dljs.rndLine = function(){
    var u = this.utils;
    this.line( u.rndX(), u.rndY(), u.rndX(), u.rndY(), 1,  u.rndColor() );
    return this.el.lastElementChild
  };

  dljs.draw = function(html){ // Draw html content
    this.el.innerHTML = this.el.innerHTML + html; //previous_html_lines + new_content;
  };

  dljs.goTo = function(x,y){
    this.pointer.x = x;
    this.pointer.y = y;
  };

  dljs.lineTo = function(x2,y2,thickness,color) {
    var x1 = this.pointer.x;
    var y1 = this.pointer.y;
    this.line(x1,y1,x2,y2,thickness,color);
  };

  dljs.clear = function(){ // Removes all lines
    if (this.el) this.el.innerHTML = '';
  };

  dljs.rmLine = function(lineID){ // Remove line

  };

  dljs.updateLine = function(id, propsArr ){

  };

  dljs.trace = function(arr){

  };

    /* ------ */
    /* Boards */
    /* ------ */

    dljs.createBoard = function( boardID, targetEl, objOptions ) { // A board is the place ( <ul> element ) where the lines ( <li> elements ) are created.

        // (1) name of the new board
        if ( boardID === undefined || boardID === null ) boardID = "dljs-"+ Date.now();

        // (2) set board properties

        if ( objOptions != null ) {

            // Overwrite default board values

        } else {

            var brd = document.createElement('ul');
            brd.setAttribute("id", boardID );

            // Create a board setting default values
            brd.setAttribute("style", "position: absolute; top: 0; left: 0; width: 0; height: 0; background-color: transparent; display: inline-block; margin: 0; padding: 0; list-style: none;");
        }

        // (3) add board to arr of boards
        dljs.boards.push( brd );

        // (4) Atach board to DOM
        if ( targetEl != null ){
            
            var el = document.getElementById( targetEl )
            el .appendChild( brd );

        } else {

            document.body.appendChild( brd );
        }
        
        // (5) Set this new board as the active one
        //this.el = [ dljs.boards[ dljs.boards.length -1 ] ];
        this.el = brd;

        return brd
    };

    dljs.getBoards = function() {
        return dljs.boards
    };

    dljs.setBoard = function( boardID ) {
        if ( boardID === undefined || boardID === null ) {
            this.el = dljs.boards[0];
            return this.el
        } else {

            if( isNaN( boardID ) ){

                for (var i=0; i < dljs.boards.length; i++ ) {
                    if ( boardID === dljs.boards[i].id ) {
                        this.el = dljs.boards[i];
                    } 
                }
                return this.el

            } else {

                if ( boardID > dljs.boards.length -1 ) return false
                this.el = dljs.boards[ boardID ];
                return this.el
            }
        }

        return false
    };

    dljs.rmBoard = function( boardID ) {

        var selectedID = null;
        var index = null;

        // Find the element that should be removed

        if( isNaN( boardID ) ){
            // search board name
            for (var i=0; i < dljs.boards.length; i++ ) {
              
                if ( boardID === dljs.boards[i].id ) {
                    selectedID = dljs.boards[i].id;
                    index = i;
                } 
            }

        } else {

            if ( boardID > dljs.boards.length -1 ) return false
            selectedID = dljs.boards[ boardID ].id;
            index = boardID;
        }

        // Remove element from html and references in variables 

        if ( selectedID != null ) {

            var node = document.getElementById( selectedID );
            if (node.parentNode) {
                
                // remove html
                node.parentNode.removeChild(node);

                // remove from the array of boards or the element will remain in memory
                dljs.boards.splice( index, 1 )
                
                // remove from dljs.el or the element will remain in memory
                if ( dljs.boards.length != 0 ){
                    dljs.el = dljs.boards[0];
                } else {
                    dljs.el = null;
                }
            }
        }
        
    };

  /* ----- */
  /* Utils */
  /* ----- */

  dljs.utils = {};

  dljs.utils.getDistance = function(x1,y1,x2,y2){
    return Math.sqrt( Math.pow( x2 - x1, 2 ) + Math.pow( y2 - y1, 2 ) )
  };

  dljs.utils.getSlope = function(x1,y1,x2,y2){
    return (y2-y1)/(x2-x1)
  };

  dljs.utils.getRandomNum = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  dljs.utils.rndColor = function() {
      var r = this.getRandomNum(0, 255);
      var g = this.getRandomNum(0, 255);
      var b = this.getRandomNum(0, 255);
      var a = 1;
      return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  };

  dljs.utils.rndX = function() {
      return this.getRandomNum(1, window.innerWidth );
  };

  dljs.utils.rndY = function() {
      return this.getRandomNum(1, window.innerHeight );
  };

    dljs.utils.getAngle = function (originX, originY, destinyX, destinyY) {
        return 45
    }

  /* -------------- */
  /* Core functions */
  /* -------------- */

  dljs.CONST_180_BY_PI = 180 / Math.PI;

  // This function returns an html string
  dljs.getLineString = function (idString,x1,y1,x2,y2,weight,color,opacity, roundBorder, longSombra, colSombra){

      if (x2 < x1){ var aux = x1; x1 = x2; x2 = aux; aux = y1; y1 = y2; y2 = aux; }

      if ( idString === null ) idString = "line-"+ Date.now();
      var cathetus1 = x2-x1;
      var cathetus2 = y2-y1;
      var hypotenuse = Math.sqrt(cathetus1*cathetus1+cathetus2*cathetus2);
      var w=hypotenuse + weight;
      var angRadians = Math.asin(cathetus2/hypotenuse);
      var ang = angRadians * 180 / Math.PI;

      //var string = '<div id="'+ idString +'" class="line" style="top:'+y1+'px;left:'+x1+'px; width:'+w+'px; height:'+weight+'px; transform: rotateZ('+ang+'deg) translateX(-'+weight/2+'px) translateY(-'+weight/2+'px); background-color: '+color+'; opacity:'+opacity+'; border-radius: '+weight+'px; box-shadow: 0 0 '+ longSombra +'px '+ colSombra +'; transform-origin: 0 0;position: absolute;"></div>';
      var string = '<li id="'+ idString +'" class="line" style="top:'+y1+'px;left:'+x1+'px; width:'+w+'px; height:'+weight+'px; transform: rotateZ('+ang+'deg) translateX(-'+weight/2+'px) translateY(-'+weight/2+'px); background-color: '+color+'; opacity:'+opacity+'; border-radius: '+weight+'px; box-shadow: 0 0 '+ longSombra +'px '+ colSombra +'; transform-origin: 0 0;position: absolute;"></li>';

      return string;
  };

  dljs.getFastLineString = function (x1,y1,x2,y2,weight,color){

      if (x2 < x1){ var aux = x1; x1 = x2; x2 = aux; aux = y1; y1 = y2; y2 = aux; }

      var cathetus1 = x2-x1
          cathetus2 = y2-y1,
          hypotenuse = Math.sqrt(cathetus1*cathetus1+cathetus2*cathetus2),
          w = hypotenuse + weight,
          angRadians = Math.asin(cathetus2/hypotenuse),
          ang = angRadians * dljs.CONST_180_BY_PI;

      //var string = '<div id="'+ idString +'" class="line" style="top:'+y1+'px;left:'+x1+'px; width:'+w+'px; height:'+weight+'px; transform: rotateZ('+ang+'deg) translateX(-'+weight/2+'px) translateY(-'+weight/2+'px); background-color: '+color+'; opacity:'+opacity+'; border-radius: '+weight+'px; box-shadow: 0 0 '+ longSombra +'px '+ colSombra +'; transform-origin: 0 0;position: absolute;"></div>';
      var string = '<li class="line" style="top:'+y1+'px;left:'+x1+'px; width:'+w+'px; height:'+weight+'px; transform: rotateZ('+ang+'deg) translateX(-'+weight/2+'px) translateY(-'+weight/2+'px); background-color: '+color+';"></li>';

      return string;
  };

})();

// 'use strict';

var nav = function(){
    
    //'use strict';

    var bodyw = 0; //document.body.clientWidth;
    var bodyh = 0; //document.body.clientHeight;
    var autopreviewAfterMove = false;
    var l1, l2, l3, l4;
    this.decissionFunction = null;

    var checkInit = function() { // select one _nect if none is selected
        if( _n.current.el === null){
            refreshListOfSelectableElements();
            var rnd = Math.floor(Math.random() * _n.listOfElements.length ) + 0;
            doNewSelection( rnd );
        }
    };

    var refreshListOfSelectableElements = function( cssLabel ) {

        if ( !cssLabel ) cssLabel = 'selectable';

        _n.listOfElements = document.getElementsByClassName( cssLabel );

        // attach an id if navigable elements do not have one
        for (var i = 0; i < _n.listOfElements.length; i++){
            //_n.listOfElements[i].innerHTML = i;
            if ( _n.listOfElements[i].id == ""){
                _n.listOfElements[i].id = Date.now() + i;
            }
        } 
    };

    var utils = {

        // Add Class Cross-browser solution: The classList property is not supported in Internet Explorer 9. The following code will work in all browsers:

        addClass: function ( domEl, styleName ) {
            if ( domEl === null || styleName === null ) return -1;
            var element = domEl, name, arr;
            arr = element.className.split(" ");
            if (arr.indexOf(styleName) == -1) {
                element.className += " " + styleName;
            }
        },

        // Remove Class Cross-browser solution: The classList property is not supported in Internet Explorer 9. The following code will work in all browsers:

        removeClass: function ( domEl, styleName ) {
            if ( domEl === null || styleName === null ) return -1;
            var element = domEl;
            element.className = element.className.replace("/\b"+ styleName +"\b/g", "");
        }

    };

    // var getBrowserWidth = function() {
    //     return document.documentElement.clientWidth;
    // };

    // var getBrowserHeight = function() {
    //     return document.documentElement.clientHeight;
    // };

    var doNewSelection = function( num ) {

        if ( num < 0) return;

        console.log( _n.listOfElements.length +" selectable elements.");

        if ( _n.listOfElements.length > 0){

            // 1. Paint numbers inside navigble elements

                for (var i = 0; i < _n.listOfElements.length; i++) _n.listOfElements[i].innerHTML = i;

            // 2. Calculate stuff to draw visual guides

                _n.current.el = _n.listOfElements[ num ];
                _n.current.domRect = _n.current.el.getBoundingClientRect();
                _n.current.c = _n.current.domRect.right - _n.current.domRect.left;
                _n.current.c = _n.current.domRect.bottom - _n.current.domRect.top;
                _n.current.w = _n.current.domRect.right - _n.current.domRect.left;
                _n.current.h = _n.current.domRect.bottom - _n.current.domRect.top;
                _n.current.cx = _n.current.domRect.left + _n.current.w/2;
                _n.current.cy = _n.current.domRect.top + _n.current.h/2;
                
                //
                _n.current.x1 = _n.current.domRect.left;
                _n.current.x2 = _n.current.domRect.right;
                _n.current.y1 = _n.current.domRect.top;
                _n.current.y2 = _n.current.domRect.bottom;

            // 3. Do the selection

                $(".selectable").removeClass("is-selected");
                $( _n.current.el ).addClass("is-selected");

                console.log("selected is: ", num );

            // 4. Draw visual guide depending on the choosen filter filter

                // dljs.clear(); // Clear all previous guides

                // //dljs.linex(null,0  ,0  ,50 ,50 , 1, "#ff0000",0.8, true, 5, "#ff00ff");
                // l1 = dljs.linex( null, _n.current.cx, _n.current.cy, _n.current.cx+2000, _n.current.cy-2000, 1, "#ff0000",0.8, true, 5, "#ff00ff");
                // l2 = dljs.linex( null, _n.current.cx, _n.current.cy, _n.current.cx-2000, _n.current.cy-2000, 1, "#ff0000",0.8, true, 5, "#ff00ff");
                // l3 = dljs.linex( null, _n.current.cx, _n.current.cy, _n.current.cx-2000, _n.current.cy+2000, 1, "#ff0000",0.8, true, 5, "#ff00ff");
                // l4 = dljs.linex( null, _n.current.cx, _n.current.cy, _n.current.cx+2000, _n.current.cy+2000, 1, "#ff0000",0.8, true, 5, "#ff00ff");

                // l6 = dljs.linex( null, 0, _n.current.cy, bodyw, _n.current.cy, 1, "#00ff00",0.5, true, 5, "#ff00ff"); // x axis
                // l7 = dljs.linex( null, _n.current.cx, 0, _n.current.cx, bodyh, 1, "#00ff00",0.5, true, 5, "#ff00ff"); // y axis

            // end

        } else {

          console.log("No selectable elements");
        }

    };

    var substract = function (a,b){
        var result = 0;
        if ( a === b ) return 0;
        if ( a > b ) return (a - b);
        return (b - a)
    };

    var calculateAllDistances = function() {

        this.targetsData = calculateDistances( _n.listOfElements, _n.current );

        console.log( "this.targetsData:", this.targetsData );
        console.log( "_n.listOfElements:", _n.listOfElements);
    };

    var calculateDistances = function( arrOfElements, currentEl ) {

        //var cdr = currentEl.domRect;
        //this.targetsData = []; // clear

        var resultsArr = [];
        for (var i = 0; i < arrOfElements.length; i++) {
            // calculate
            var el = arrOfElements[i];
            var domRect = el.getBoundingClientRect();
            var p = {};
            p.id = el.id;
            p.x1 = domRect.left;
            p.y1 = domRect.top;
            p.x2 = domRect.right;
            p.y2 = domRect.bottom;
            p.w = domRect.right - domRect.left;
            p.h = domRect.bottom - domRect.top;
            p.cx = domRect.left + p.w/2;
            p.cy = domRect.top + p.h/2;
            p.distance = getDistance( currentEl.cx, currentEl.cy, p.cx, p.cy );

            if ( p.distance === 0) continue; //return;

            p.angle = getAngle();
            p.distance_axis_x = substract( p.cx, currentEl.cx );
            p.distance_axis_y = substract( p.cy, currentEl.cy );
            p.slope = null;
            p.group = null;
            resultsArr.push( p );

        }

        return resultsArr;
    };

    function takeADecision( direction ) { // direction [1,2,3 or 4]
        // We´ve got:
        // 1) this.targetsData
        // 2) _n.current
        // so ...

        if ( this.decissionFunction != null ) {

            return this.decissionFunction( );

        } else {

            console.log("decission function is null");
        }

        var FILTERS_GROUP = 1; //1;

        // -----------------------
        // --- FILTERS GROUP 1 ---
        // -----------------------
        
        if ( FILTERS_GROUP === 1) {    

            console.log(".");
            console.log("Take a decision...");
            console.log("this.targetsData, all elements:", this.targetsData );
            console.log("_n.current", _n.current );
            console.log(".");

            var decisionIndex = -1; //-1

            var target = [];
            console.log(".a Before filter 1, target: ", target );

            // FILTER 1: Half / Half
            for (var i = 0; i < this.targetsData.length; i++) {

                if (  direction === 1 ) { // up

                    if ( this.targetsData[i].cy < _n.current.cy ) target.push( this.targetsData[i] );
                }

                if (  direction === 2 ) { // right

                    if ( this.targetsData[i].cx > _n.current.cx ) target.push( this.targetsData[i] );
                }

                if (  direction === 3 ) { // down

                    if ( this.targetsData[i].cy > _n.current.cy ) target.push( this.targetsData[i] );
                }

                if (  direction === 4 ) { // left

                    if ( this.targetsData[i].cx < _n.current.cx ) target.push( this.targetsData[i] );
                }
                
            }


            console.log(".b After filter 1, target: ", target );

            // FILTER 2: Get the closest to the axis x or Y

            // var selectedObj = null;
            // var minY = null;

            // for (var i = 0; i < target.length; i++) {
            //     if (i === 0){
            //         selectedObj = target[0]; //.distance_axis_y;
            //         minY = target[0].distance_axis_y;
            //     } else {
            //         if( target[i].distance_axis_y < minY ){
            //             selectedObj = target[i]; //.distance_axis_y;
            //             minY = target[i].distance_axis_y;
            //         }
            //     }
         
            // }

            // console.log(".c After filter 2, decision was taken: ", selectedObj );



            // FILTER 3:  Get the ones whose center is in a range, constraint to boundaries

            console.log("this.targetsData: ", this.targetsData );

            for (var i = 0; i < this.targetsData.length; i++) {

                console.log("i: ", i );
                
                if (  direction === 1 || direction === 3  ) { // up

                    if ( this.targetsData[i].cx > _n.current.x1 && this.targetsData[i].cx < _n.current.x2 ) { 
                        target.push( this.targetsData[i] );
                    }
                }

                if (  direction === 2 || direction === 4 ) { // right

                    if ( this.targetsData[i].cy > _n.current.y1 && this.targetsData[i].cy < _n.current.y2 ) { 
                        target.push( this.targetsData[i] );
                    }
                }
            }

            console.log("target: ", target );

            // SELECTOR 4: Get the lower distance value

            var selectedObj = null;
            var minDistance = null;

            for (var i = 0; i < target.length; i++) {
                if (i === 0){
                    selectedObj = target[0];
                    minDistance = target[0].distance;
                } else {
                    if( target[i].distance < minDistance && target[i].distance != 0 ){
                        selectedObj = target[i];
                        minDistance = target[i].distance;
                    }
                }
            }

            // SELECTOR 5: Random

            // ... var rnd = Math.floor(Math.random() * _n.listOfElements.length ) + 0;


            console.log(".c After filter 2, decision was taken: ", selectedObj );

            decisionIndex = selectedObj.id;

            console.log(".");

            return decisionIndex; // Returns an element
        }

        // -----------------------
        // --- FILTERS GROUP 2 ---
        // -----------------------

        console.log("this.targetsData:", this.targetsData );

        if ( FILTERS_GROUP === 2) {

            var selectedObj = null;
            var min_distance = null;
            
            for (var i = 0; i < this.targetsData.length; i++) {

                if (i === 0){
                    selectedObj = targetsData[0];
                    min_distance = targetsData[0].distance;
                } else {

                    if( targetsData[i].distance < min_distance && targetsData[i].distance != 0 ){
                      selectedObj = targetsData[i];
                      min_distance = targetsData[i].distance;
                    }

                }                
            }

            decisionIndex = selectedObj.id;

            return decisionIndex; // Returns an element

        }

    }

    function getDistance(x1,y1,x2,y2){
        //return dljs.utils.getDistance(x1,y1,x2,y2);
    }

    function getAngle(originX, originY, destinyX, destinyY){
        //return dljs.utils.getAngle(originX, originY, destinyX, destinyY)
    }

    var doAction = function() {

    };

    var previewAndShow = function( where) {
        console.log("preview :", where );
    };

    var clearPreview = function( where) {
        console.log("clear preview!");
    };

    // --------------------------

    var automaticallyGetNextElement = function( arrOfElements, currentElement, movDirection, filterNameOrID ) {

        console.log("automaticallyGetNextElement(), arrOfElements:", arrOfElements);
        console.log("automaticallyGetNextElement(), currentElement:", currentElement);
        console.log("automaticallyGetNextElement(), movDirection:", movDirection);
        console.log("automaticallyGetNextElement(), filterNameOrID:", filterNameOrID);

        if ( !currentElement ) return null;

        var workArr = calculateDistances( arrOfElements, currentElement ); //  arrOfElements;

        // FILTER 1: Half / Half
        function filter_half_half( arrOfElements, currentElement ){
            var lon = arrOfElements.length;
            var filteredElements = [];
            for (var i = 0; i < arrOfElements.length; i++) {
                if (  direction == 1 || direction == "UP" )    if ( arrOfElements[i].cy < currentElement.cy ) filteredElements.push( arrOfElements[i] );
                if (  direction == 2 || direction == "RIGHT" ) if ( arrOfElements[i].cx > currentElement.cx ) filteredElements.push( arrOfElements[i] );
                if (  direction == 3 || direction == "DOWN" )  if ( arrOfElements[i].cy > currentElement.cy ) filteredElements.push( arrOfElements[i] );
                if (  direction == 4 || direction == "LEFT" )  if ( arrOfElements[i].cx < currentElement.cx ) filteredElements.push( arrOfElements[i] );
            }
            return filteredElements;
        }

        workArr = filter_half_half( workArr, currentElement );

        // Range filter
        function filter_range( arrOfElements, currentElement ){
            var lon = arrOfElements.length;
            var filteredElements = [];
            for (var i = 0; i < arrOfElements.length; i++) {
                if (  direction === 1 || direction === 3 || direction == "UP" || direction == "DOWN" ) 
                    if ( arrOfElements[i].cx > _n.current.x1 && arrOfElements[i].cx < _n.current.x2 )
                        filteredElements.push( arrOfElements[i] );
    
                if (  direction === 2 || direction === 4 || direction == "RIGHT" || direction == "LEFT"  ) 
                    if ( arrOfElements[i].cy > _n.current.y1 && arrOfElements[i].cy < _n.current.y2 )
                        filteredElements.push( arrOfElements[i] );
            }
            return filteredElements;
        }

        workArr = filter_range( workArr, currentElement );
        
        // Distances filter
        function filter_nearest( arrOfElements, currentElement ){
            var lon = arrOfElements.length;
            var filteredElements = [];
            for (var i = 0; i < workArr.length; i++) {
                if (i === 0){
                    selectedObj = arrOfElements[0];
                    minDistance = arrOfElements[0].distance;
                } else 
                    if( arrOfElements[i].distance < minDistance && arrOfElements[i].distance != 0 ){
                        selectedObj = arrOfElements[i];
                        minDistance = arrOfElements[i].distance;
                    }
            }
            return filteredElements;
        }

        workArr = filter_nearest( workArr, currentElement );

        return workArr; // filteredElements
    };
    
    // ------------------------------------
    // public
    // ------------------------------------

    var _n = {};

    _n.previousEl = null;

    //Selected element
    _n.current = {};
    _n.current.el = null;
    _n.current.domRect = null;
    _n.current.cx = null;
    _n.current.cy = null;
    _n.w = null;
    _n.h = null;
    _n.cx = null;
    _n.cy = null; 

    _n.listOfElements = [];
    _n.targetsData = [];

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
    };

    _n.setDecissionFunction = function( _func ){
        this.decissionFunction = _func;
    };

    _n.calculateDecissionPreviewAndShow = function( where ){
        previewAndShow( where);
    };

    _n.clearPreview = function(  ){
        clearPreview( );
    };

    _n.recalculateContainers = function() {
        console.log("recalculateContainers()");
    };

    _n.applyRandomDecision = function() {
        console.log("applyRandomDecision()");
    };

    _n.getNextElement = function( arrOfElements, currentElement, movDirection, filterNameOrID ) {

        console.log("getNextElement(), arrOfElements:", arrOfElements);
        console.log("getNextElement(), currentElement:", currentElement);
        console.log("getNextElement(), movDirection:", movDirection);
        console.log("getNextElement(), filterNameOrID:", filterNameOrID);

    

        if ( arrOfElements === null ) return undefined;
        if ( currentElement === undefined || currentElement === null ) { 
            nav.doSelection( arrOfElements[0] ); 
            return; 
        }
        
        //currentElement = arrOfElements[0]; //undefined; //nav.applyFilters( arrOfElements, 'EXCLUDE-CURRENT', ["RANDOM"])
        //return undefined; //nav.filter( arrOfElements, ["RANDOM"])
        if ( filterNameOrID === null ) filterNameOrID = "RANDOM";
        if ( movDirection === null ) filterNameOrID = "RANDOM"; 

        return automaticallyGetNextElement( arrOfElements, currentElement, movDirection, filterNameOrID );
     /*       */

        return -1;
    };

    _n.doSelection = function( domElement ) {
        if ( domElement === undefined || domElement === null ) return -1;
        if ( _n.current.el != null ) utils.removeClass( _n.current.el, "selected");
        _n.current.el = domElement; //.removeClass("selected");
        utils.addClass( _n.current.el, "selected");
    };

    return _n;
};

nav = nav();

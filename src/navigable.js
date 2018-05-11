/**
 * navigable
 * Simple javascript navigation lib.
 * @version v1.0.1 - 2018-04-03
 * @link https://github.com/ajsoriar/navigable
 * @author Andres J. Soria R. <ajsoriar@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function () { // An immediately invoked function will wrap our code

    "use strict"

    var checkInit = function() { // select one focusable item if none is selected
        if (nav.current.el === null) {
            refreshListOfFocusableItems();
            var rnd = Math.floor(Math.random() * nav.listOfFocusableElements.length) + 0; // TODO: Select the first one! or look for a default item...
            focusItem(rnd);
        }
    };

    var refreshListOfFocusableItems = function(cssLabel) { // Updates nav.listOfFocusableElements 

        if (!cssLabel) cssLabel = 'focusable';

        nav.listOfFocusableElements = document.getElementsByClassName(cssLabel);

        // attach an id if navigable elements do not have one
        for (var i = 0; i < nav.listOfFocusableElements.length; i++) {
            if (nav.listOfFocusableElements[i].id == "") {
                nav.listOfFocusableElements[i].id = Date.now() + i;
            }
        }
    };

    var Utils = {

        // Add Class Cross-browser solution: The classList property is not supported in Internet Explorer 9. The following code will work in all browsers:

        addClass: function(domEl, styleName) {
            if (domEl === null || styleName === null) return -1;
            var element = domEl,
                name, arr;
            arr = element.className.split(" ");
            if (arr.indexOf(styleName) == -1) {
                element.className += " " + styleName;
            }
        },

        // Remove Class Cross-browser solution: The classList property is not supported in Internet Explorer 9. The following code will work in all browsers:

        removeClass: function(domEl, styleName) {
            if (domEl === null || styleName === null) return -1;
            var element = domEl;
            //element.className = element.className.replace("/\b" + styleName + "\b/g", "");
            element.classList.remove(styleName);
        },

        removeClassFromElements: function(arrOfElements, styleName) {
            for (var i = 0; i < arrOfElements.length; i++) {
                this.removeClass(arrOfElements[i], styleName);
            }
        },

        getRandomNum: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        substract: function(a, b) {
            if (a === b) return 0;
            if (a > b) return (a - b);
            return (b - a)
        }

    };

    var focusItem = function(num) {

        console.log( "--- focusItem: --- ", num );

        if ( num === null || num < 0) {

            console.error("'num' needed!");
            return
        }

        console.log(nav.listOfFocusableElements.length + " focusable elements.");
        console.log("nav.listOfFocusableElements: ", nav.listOfFocusableElements);

        if (nav.listOfFocusableElements.length > 0) {

            // 1. Paint numbers inside navigble elements

            //for (var i = 0; i < nav.listOfFocusableElements.length; i++) nav.listOfFocusableElements[i].innerHTML = i;

            // 2. Calculate stuff to draw visual guides

            nav.current.el = nav.listOfFocusableElements[num];
            nav.current.domRect = nav.current.el.getBoundingClientRect();
            nav.current.c = nav.current.domRect.right - nav.current.domRect.left;
            nav.current.c = nav.current.domRect.bottom - nav.current.domRect.top;
            nav.current.w = nav.current.domRect.right - nav.current.domRect.left;
            nav.current.h = nav.current.domRect.bottom - nav.current.domRect.top;
            nav.current.cx = nav.current.domRect.left + nav.current.w / 2;
            nav.current.cy = nav.current.domRect.top + nav.current.h / 2;

            nav.current.x1 = nav.current.domRect.left;
            nav.current.x2 = nav.current.domRect.right;
            nav.current.y1 = nav.current.domRect.top;
            nav.current.y2 = nav.current.domRect.bottom;

            // 3. Do the selection

            /*
                $(".focusable").removeClass("focused");
                $( nav.current.el ).addClass("focused");
                //nav.applySelectionStyle( nav.current.el );
            */

            removeFocusedClassFromAllElements();
            Utils.addClass(nav.current.el, "focused");

            console.log("selected is: ", num);

        } else {

            console.log("No focusable elements");
        }
    };

    var removeFocusedClassFromAllElements = function() {
        Utils.removeClassFromElements(document.getElementsByClassName("focusable"), "focused");
    };

    //var focusableTargets = null;

    function calculateAllDistances() {

        console.log(" --- calculateAllDistances()");

        var elmts = nav.listOfFocusableElements;
        var current = nav.current

        nav.focusableTargets = calculateDistances( elmts, current );
    }

    var calculateDistances = function(arrOfElements, currentEl) {

        console.log(" --- calculateDistances()");
        console.log(" currentEl: ", currentEl );
        console.log(" arrOfElements: ", arrOfElements );

        var resultsArr = [];
        for (var i = 0; i < arrOfElements.length; i++) {
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
            p.cx = domRect.left + p.w / 2;
            p.cy = domRect.top + p.h / 2;
            p.distance = getDistance(currentEl.cx, currentEl.cy, p.cx, p.cy);

            if (p.distance === 0) continue; //return;

            p.angle = getAngle();
            p.distance_axis_x = Utils.substract(p.cx, currentEl.cx);
            p.distance_axis_y = Utils.substract(p.cy, currentEl.cy);
            p.slope = null;
            p.group = null;
            resultsArr.push(p);
        }

        return resultsArr;
    };

    function takeADecision(direction) { // direction [1,2,3 or 4]

        var FILTERS_GROUP = 1;

        // -----------------------
        // --- FILTERS GROUP 1 ---
        // -----------------------

        if (FILTERS_GROUP === 1) {

            console.log("Take a decision...");
            console.log("nav.focusableTargets: ", nav.focusableTargets);
            console.log("current: ", nav.current);

            var decisionIndex = -1;
            var target = [];

            console.info(".a Before filter 1 (Half / Half]), target: ", target);

            // -----------------------------------------
            // Half / Half
            // -----------------------------------------

            // FILTER 1:
            for (var i = 0; i < nav.focusableTargets.length; i++) {

                if (direction === 1) { // up
                    console.log("UP");
                    if (nav.focusableTargets[i].cy < nav.current.cy) target.push(nav.focusableTargets[i]);
                }

                if (direction === 2) { // right
                    console.log("RIGHT");
                    if (nav.focusableTargets[i].cx > nav.current.cx) target.push(nav.focusableTargets[i]);
                }

                if (direction === 3) { // down
                    console.log("DOWN");
                    if (nav.focusableTargets[i].cy > nav.current.cy) target.push(nav.focusableTargets[i]);
                }

                if (direction === 4) { // left
                    console.log("LEFT");
                    if (nav.focusableTargets[i].cx < nav.current.cx) target.push(nav.focusableTargets[i]);
                }
            }

            console.info(".b After filter 1, target: ", target);


            // -----------------------------------------
            // Closest to the axis x or Y
            // -----------------------------------------

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

            console.log("nav.focusableTargets: ", nav.focusableTargets);

            for (var i = 0; i < nav.focusableTargets.length; i++) {

                //console.log("i: ", i);

                if (direction === 1 || direction === 3) { // up

                    if (nav.focusableTargets[i].cx > nav.current.x1 && nav.focusableTargets[i].cx < nav.current.x2) {
                        target.push(nav.focusableTargets[i]);
                    }
                }

                if (direction === 2 || direction === 4) { // right

                    if (nav.focusableTargets[i].cy > nav.current.y1 && nav.focusableTargets[i].cy < nav.current.y2) {
                        target.push(nav.focusableTargets[i]);
                    }
                }
            }

            console.log("target: ", target);

            // SELECTOR 4: Get the lower distance value

            var selectedObj = null;
            var minDistance = null;

            for (var i = 0; i < target.length; i++) {
                if (i === 0) {
                    selectedObj = target[0];
                    minDistance = target[0].distance;
                } else {
                    if (target[i].distance < minDistance && target[i].distance != 0) {
                        selectedObj = target[i];
                        minDistance = target[i].distance;
                    }
                }
            }

            // SELECTOR 5: Random

            // ... var rnd = Math.floor(Math.random() * nav.listOfFocusableElements.length ) + 0;


            console.log(".c After filter 2, decision was taken: ", selectedObj);

            decisionIndex = selectedObj? selectedObj.id: null;

            return decisionIndex; // Returns an element
        }

        // -----------------------
        // --- FILTERS GROUP 2 ---
        // -----------------------

        console.log("nav.focusableTargets:", nav.focusableTargets);

        if (FILTERS_GROUP === 2) {

            var selectedObj = null;
            var min_distance = null;

            for (var i = 0; i < nav.focusableTargets.length; i++) {

                if (i === 0) {
                    selectedObj = focusableTargets[0];
                    min_distance = focusableTargets[0].distance;
                } else {

                    if (focusableTargets[i].distance < min_distance && focusableTargets[i].distance != 0) {
                        selectedObj = focusableTargets[i];
                        min_distance = focusableTargets[i].distance;
                    }

                }
            }

            decisionIndex = selectedObj.id;

            return decisionIndex; // Returns an element

        }

    }

    function getDistance(x1, y1, x2, y2) {
        //return dljs.Utils.getDistance(x1,y1,x2,y2);
    }

    function getAngle(originX, originY, destinyX, destinyY) {
        //return dljs.Utils.getAngle(originX, originY, destinyX, destinyY)
    }

    var doAction = function() {

    };

    var automaticallyGetNextElement = function(arrOfElements, currentElement, movDirection, filterNameOrID) {

        console.log("automaticallyGetNextElement(), arrOfElements:", arrOfElements);
        console.log("automaticallyGetNextElement(), currentElement:", currentElement);
        console.log("automaticallyGetNextElement(), movDirection:", movDirection);
        console.log("automaticallyGetNextElement(), filterNameOrID:", filterNameOrID);

        if (!currentElement) return null;

        var workArr = calculateDistances(arrOfElements, currentElement); //  arrOfElements;

        // FILTER 1: Half / Half
        function filter_half_half(arrOfElements, currentElement) {
            var lon = arrOfElements.length;
            var filteredElements = [];
            for (var i = 0; i < arrOfElements.length; i++) {
                if (direction == 1 || direction == "UP")
                    if (arrOfElements[i].cy < currentElement.cy) filteredElements.push(arrOfElements[i]);
                if (direction == 2 || direction == "RIGHT")
                    if (arrOfElements[i].cx > currentElement.cx) filteredElements.push(arrOfElements[i]);
                if (direction == 3 || direction == "DOWN")
                    if (arrOfElements[i].cy > currentElement.cy) filteredElements.push(arrOfElements[i]);
                if (direction == 4 || direction == "LEFT")
                    if (arrOfElements[i].cx < currentElement.cx) filteredElements.push(arrOfElements[i]);
            }
            return filteredElements;
        }

        workArr = filter_half_half(workArr, currentElement);

        // ------------
        // Range filter
	// ------------
	
        function filter_range(arrOfElements, currentElement) {
            var lon = arrOfElements.length;
            var filteredElements = [];
            for (var i = 0; i < arrOfElements.length; i++) {
                if (direction === 1 || direction === 3 || direction == "UP" || direction == "DOWN")
                    if (arrOfElements[i].cx > nav.current.x1 && arrOfElements[i].cx < nav.current.x2)
                        filteredElements.push(arrOfElements[i]);

                if (direction === 2 || direction === 4 || direction == "RIGHT" || direction == "LEFT")
                    if (arrOfElements[i].cy > nav.current.y1 && arrOfElements[i].cy < nav.current.y2)
                        filteredElements.push(arrOfElements[i]);
            }
            return filteredElements;
        }

        workArr = filter_range(workArr, currentElement);

        // ----------------
        // Distances filter
	// ----------------
	
        function filter_nearest(arrOfElements, currentElement) {
            var lon = arrOfElements.length;
            var filteredElements = [];
            for (var i = 0; i < workArr.length; i++) {
                if (i === 0) {
                    selectedObj = arrOfElements[0];
                    minDistance = arrOfElements[0].distance;
                } else
                if (arrOfElements[i].distance < minDistance && arrOfElements[i].distance != 0) {
                    selectedObj = arrOfElements[i];
                    minDistance = arrOfElements[i].distance;
                }
            }
            return filteredElements;
        }

        workArr = filter_nearest(workArr, currentElement);

        return workArr; // filteredElements
    };

    var focusById = function( targetID ) {

        refreshListOfFocusableItems();
        removeFocusedClassFromAllElements();
        var num = null;
    
        // attach an id if navigable elements do not have one
        for (var i = 0; i < nav.listOfFocusableElements.length; i++) {
            if (nav.listOfFocusableElements[i].id == targetID) {
                num = i;
            }
        }
        focusItem(num);
    };

    window.nav = {
        current : {
            el: null,
        }, 
        previousSelectedElement : null,
        selectedElement : null,
        w : null,
        h : null,
        cx : null,
        cy : null,
        listOfFocusableElements : [],
        focusableTargets : [],
        init : function() {
            checkInit();
            calculateAllDistances();
        },
        move : {
            up: function() {
                //this.beforeMove();
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision(1);
                focusItem(selectedIndex);
                //this.afterMove();
                return nav.selectedElement;
            },
            down: function() {
                //this.beforeMove();
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision(3);
                focusItem(selectedIndex);
                //this.afterMove();
                return nav.selectedElement;
            },
            right: function() {
                //this.beforeMove();
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision(2);
                focusItem(selectedIndex);
                //this.afterMove();
                return nav.selectedElement;
            },
            left: function() {
                //this.beforeMove();
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision(4);
                focusItem(selectedIndex);
                //this.afterMove();
                return nav.selectedElement;
            },
            rnd: function() {

            },
            to: function() { // id or class

            }
        },
        reset: function() {
            this.current.el = null;
            checkInit();
            calculateAllDistances();
        },
        action: function() {
            
            // if (this.current.el === null) {
            //     console.error("No item");
            //     return
            // }

            console.log("this.current: ", this.current );

            var atributo = this.current.el.getAttribute("data-link");
            console.log("data-link: ", atributo  );

            //eval("window."+ atributo);
            window.router.goTo( atributo );

            //var dl =  this.current.dataset.link;
            //console.log("data-link: ", dl );
        },
        recalculateContainers: function() {
            console.log("recalculateContainers()");
        },
        applyRandomDecision: function() {
            console.log("applyRandomDecision()");
        },
        getNextElement: function(arrOfElements, currentElement, movDirection, filterNameOrID) {

            console.log("getNextElement(), arrOfElements:", arrOfElements);
            console.log("getNextElement(), currentElement:", currentElement);
            console.log("getNextElement(), movDirection:", movDirection);
            console.log("getNextElement(), filterNameOrID:", filterNameOrID);

            if (arrOfElements === null) return undefined;
            if (currentElement === undefined || currentElement === null) {
                this.applySelectionStyle(arrOfElements[Utils.getRandomNum(0, arrOfElements.length - 1)]);
                return;
            }

            //currentElement = arrOfElements[0]; //undefined; //nav.applyFilters( arrOfElements, 'EXCLUDE-CURRENT', ["RANDOM"])
            //return undefined; //nav.filter( arrOfElements, ["RANDOM"])
            if (filterNameOrID === null) filterNameOrID = "RANDOM";
            if (movDirection === null) filterNameOrID = "RANDOM";

            return automaticallyGetNextElement(arrOfElements, currentElement, movDirection, filterNameOrID);

            return -1;
        },
        applySelectionStyle: function(domElement) {
            if (domElement === undefined || domElement === null) return -1;
            if (nav.current.el != null) Utils.removeClass(nav.current.el, "focused");
            nav.current.el = domElement;
            Utils.addClass(nav.current.el, "focused");
        },
        focusById: focusById
    };
}());

document.addEventListener('keydown', (e) => {

    console.log("keydown e.which:", e);

    switch (e.which) {

        case 37: // left
            nav.move.left();
            break;

        case 38:
            nav.move.up();
            break;

        case 39:
            nav.move.right();
            break;

        case 40:
            nav.move.down();
            break;

        case 13:
            nav.action();
            break;

        case 8:
            // var x = history.length;
            // ajsrConsole.log(x);
            // window.history.back();
            App.exit();
            break;
        
        case 96: // 0
            nav.reset();
            break;

    }

});


/**
 * spatial-navigator
 * JS spatial navigation library.
 * @version 0.1.1 - 2018-05-13
 * @link https://github.com/ajsoriar/spatial-navigator
 * @author Andres J. Soria R. <ajsoriar@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function () { 

    "use strict"

    var checkInit = function() { 
        if (nav.current.el === null) {
            refreshListOfFocusableItems();
            var rnd = Math.floor(Math.random() * nav.listOfFocusableElements.length) + 0; 
            focusItem(rnd);
        }
    };

    var refreshListOfFocusableItems = function(cssLabel) { 

        if (!cssLabel) cssLabel = 'focusable';

        nav.listOfFocusableElements = document.getElementsByClassName(cssLabel);
        for (var i = 0; i < nav.listOfFocusableElements.length; i++) {
            if (nav.listOfFocusableElements[i].id == "") {
                nav.listOfFocusableElements[i].id = i;
                nav.listOfFocusableElements[i].innerHTML = i;
            }
        }
    };

    var Utils = {

        addClass: function(domEl, styleName) {
            if (domEl === null || styleName === null) return -1;
            var element = domEl,
                name, arr;
            arr = element.className.split(" ");
            if (arr.indexOf(styleName) == -1) {
                element.className += " " + styleName;
            }
        },

        removeClass: function(domEl, styleName) {
            if (domEl === null || styleName === null) return -1;
            var element = domEl;
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
        },

        getDistance: function(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        },
    
        getAngle: function(originX, originY, destinyX, destinyY) {

        },

        getRandomNum: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
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
            p.distance = Utils.getDistance(currentEl.cx, currentEl.cy, p.cx, p.cy);

            if (p.distance === 0) continue; 

            p.angle = Utils.getAngle();
            p.distance_axis_x = Utils.substract(p.cx, currentEl.cx);
            p.distance_axis_y = Utils.substract(p.cy, currentEl.cy);
            p.slope = null;
            p.group = null;
            resultsArr.push(p);
        }

        return resultsArr;
    };

    function takeADecision(direction) { 

        var FILTERS_GROUP = 1;

        if (FILTERS_GROUP === 1) {

            console.log("Take a decision...");
            console.log("nav.focusableTargets: ", nav.focusableTargets);
            console.log("current: ", nav.current);

            var decisionIndex = -1;
            var target = [];

            console.info(".a Before filter 1 (Half / Half]), target: ", target);
            for (var i = 0; i < nav.focusableTargets.length; i++) {

                if (direction === 1) { 
                    console.log("UP");
                    if (nav.focusableTargets[i].cy < nav.current.cy) target.push(nav.focusableTargets[i]);
                }

                if (direction === 2) { 
                    console.log("RIGHT");
                    if (nav.focusableTargets[i].cx > nav.current.cx) target.push(nav.focusableTargets[i]);
                }

                if (direction === 3) { 
                    console.log("DOWN");
                    if (nav.focusableTargets[i].cy > nav.current.cy) target.push(nav.focusableTargets[i]);
                }

                if (direction === 4) { 
                    console.log("LEFT");
                    if (nav.focusableTargets[i].cx < nav.current.cx) target.push(nav.focusableTargets[i]);
                }
            }

            console.info(".b After filter 1, target: ", target);

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

            decisionIndex = selectedObj? selectedObj.id: null;

            return decisionIndex; 
        }

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

            return decisionIndex; 

        }

    }



    var doAction = function() {

    };

    var automaticallyGetNextElement = function(arrOfElements, currentElement, movDirection, filterNameOrID) {

        console.log("automaticallyGetNextElement(), arrOfElements:", arrOfElements);
        console.log("automaticallyGetNextElement(), currentElement:", currentElement);
        console.log("automaticallyGetNextElement(), movDirection:", movDirection);
        console.log("automaticallyGetNextElement(), filterNameOrID:", filterNameOrID);

        if (!currentElement) return null;

        var workArr = calculateDistances(arrOfElements, currentElement); 
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

        return workArr; 
    };

    var focusById = function( targetID ) {

        refreshListOfFocusableItems();
        removeFocusedClassFromAllElements();
        var num = null;
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
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision(1);
                focusItem(selectedIndex);
                return nav.selectedElement;
            },
            down: function() {
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision(3);
                focusItem(selectedIndex);
                return nav.selectedElement;
            },
            right: function() {
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision(2);
                focusItem(selectedIndex);
                return nav.selectedElement;
            },
            left: function() {
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision(4);
                focusItem(selectedIndex);
                return nav.selectedElement;
            },
            rnd: function() {

            },
            to: function() { 

            }
        },
        reset: function() {
            this.current.el = null;
            checkInit();
            calculateAllDistances();
        },
        action: function() {
            console.log("this.current: ", this.current );
            var atributo = this.current.el.getAttribute("data-link");
            console.log("data-link: ", atributo  );
            window.router.goTo( atributo );
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
            if (filterNameOrID === null) filterNameOrID = "RANDOM";
            if (movDirection === null) filterNameOrID = "RANDOM";

            return automaticallyGetNextElement(arrOfElements, currentElement, movDirection, filterNameOrID);
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
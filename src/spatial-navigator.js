(function() { // An immediately invoked function will wrap our code

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
                //nav.listOfFocusableElements[i].id = i;
                //nav.listOfFocusableElements[i].innerHTML = i;
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
        },

        getDistance: function(x1, y1, x2, y2) {
            //return dljs.Utils.getDistance(x1,y1,x2,y2);
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        },

        getAngle: function(originX, originY, destinyX, destinyY) {
            //return dljs.Utils.getAngle(originX, originY, destinyX, destinyY)

        },

        getRandomNum: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

    };

    var focusItem = function(num) {

        console.log("focusItem() num: " + num);

        if (num === null || num === undefined || num < 0) {

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

        nav.focusableTargets = calculateDistances(elmts, current);
    }

    var calculateDistances = function(arrOfElements, currentEl) {

        console.log(" --- calculateDistances()");
        console.log(" currentEl: ", currentEl);
        console.log(" arrOfElements: ", arrOfElements);

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

        console.log("takeADecision() direction:" + direction);
        console.log("Take a decision...");
        console.log("nav.focusableTargets: ", nav.focusableTargets);
        console.log("current: ", nav.current);

        var decisionIndex = -1;
        var target = [];
        var tempTargets = [];

        console.info(".a Before filter 1 (Half / Half]), target: ", target);

        // -----------------------------------------
        // FILTER 1: Half / Half
        // -----------------------------------------

        function fliter_1(focusabletargets, focusedEl, direction) {

            var arr = [];

            if (focusabletargets.length > 1) {

                for (var i = 0; i < focusabletargets.length; i++) {

                    if (direction === 'UP') {
                        if (focusabletargets[i].cy < focusedEl.cy) arr.push(focusabletargets[i]);
                    }

                    if (direction === 'RIGHT') {
                        if (focusabletargets[i].cx > focusedEl.cx) arr.push(focusabletargets[i]);
                    }

                    if (direction === 'DOWN') {
                        if (focusabletargets[i].cy > focusedEl.cy) arr.push(focusabletargets[i]);
                    }

                    if (direction === 'LEFT') {
                        if (focusabletargets[i].cx < focusedEl.cx) arr.push(focusabletargets[i]);
                    }
                }

            } else {

                return focusabletargets
            }

            return arr;
        }

        tempTargets = fliter_1(nav.focusableTargets, nav.current, direction);

        // -----------------------------------------
        // FILTER 2: Closest to the axis x or Y
        // -----------------------------------------

        /*
        function fliter_1(focusabletargets, focusedEl, direction) {

            if (nav.focusableTargets.length > 1) {

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

            }
        }
        */

        // ----------------------------------------------------------------------------------
        // FILTER 3:  Get the ones whose center is in a range, constraint to boundaries
        // ----------------------------------------------------------------------------------

        function fliter_3(focusabletargets, focusedEl, direction) {

            var arr = [];

            if (focusabletargets.length > 1) {

                for (var i = 0; i < focusabletargets.length; i++) {

                    if (direction === 'UP' || direction === 'DOWN') { // Vertical filter

                        if (focusabletargets[i].cx > focusedEl.x1 && focusabletargets[i].cx < focusedEl.x2) {
                            arr.push(focusabletargets[i]);
                        }
                    }

                    if (direction === 'RIGHT' || direction === 'LEFT') { // Horizontal filter

                        if (focusabletargets[i].cy > focusedEl.y1 && focusabletargets[i].cy < focusedEl.y2) {
                            arr.push(focusabletargets[i]);
                        }
                    }
                }

            } else {

                return focusabletargets
            }

            if (arr.length === 0) return focusabletargets; // if this filter does not find elements return the elements from the previous filter.

            return arr;
        }

        // ----------------------------------------------------------------------------------
        // FILTER 3_1:  Get the ones that cross a constraint to boundaries
        // ----------------------------------------------------------------------------------

        var tempTargets_1 = fliter_3(tempTargets, nav.current, direction);
        //var tempTargets_2 = fliter_3_1(tempTargets, nav.current, direction);
        tempTargets = tempTargets_1; // + tempTargets_2

        // -----------------------------------------
        // FILTER 4: Get the lower distance value
        // -----------------------------------------

        function fliter_4(focusabletargets) {

            var el = null;
            var min = null;

            if (focusabletargets.length > 1) {

                for (var i = 0; i < focusabletargets.length; i++) {
                    if (i === 0) {
                        el = focusabletargets[0];
                        min = focusabletargets[0].distance;
                    } else {
                        if (focusabletargets[i].distance < min && focusabletargets[i].distance != 0) {
                            el = focusabletargets[i];
                            min = focusabletargets[i].distance;
                        }
                    }
                }

                return el

            } else if (focusabletargets.length === 1) {

                return focusabletargets[0]

            }

            return -1
        }

        tempTargets = fliter_4(tempTargets, nav.current, direction);

        // -----------------------------------------
        // FILTER 5: Horizontal, 1st from left to right.
        // -----------------------------------------

        // -----------------------------------------
        // FILTER 6: Vertical, 1st from top to bottom.
        // -----------------------------------------

        // -----------------------------------------
        // FILTER 7: Random.
        // -----------------------------------------

        //debugger

        // ... var rnd = Math.floor(Math.random() * nav.listOfFocusableElements.length ) + 0;


        //console.log(".c After filter 2, decision was taken: ", selectedObj);

        decisionIndex = tempTargets ? tempTargets.id : null;

        return decisionIndex; // Returns an element
    }

    var doAction = function() {
        console.log("Default action!");

        //look for href
    };

    var focusById = function(targetID) {

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
        current: {
            el: null,
        },
        previousSelectedElement: null,
        selectedElement: null,
        w: null,
        h: null,
        cx: null,
        cy: null,
        listOfFocusableElements: [],
        focusableTargets: [],
        // init: function() {
        //     checkInit();
        //     calculateAllDistances();
        // },
        actionFunction: function(e) {
            console.log(e);

            if (e.att_href != null) {

                // Search javascript string. If found exec the function

            }

            if (e.att_f_link != null) {

                window.location = e.att_f_link;

            }

            if (e.att_f_func != null) {

                eval(e.att_f_func);

            }
        },
        move: {
            up: function() {
                //this.beforeMove();
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision('UP');
                focusItem(selectedIndex);
                //this.afterMove();
                return nav.selectedElement;
            },
            down: function() {
                //this.beforeMove();
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision('DOWN');
                focusItem(selectedIndex);
                //this.afterMove();
                return nav.selectedElement;
            },
            right: function() {
                //this.beforeMove();
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision('RIGHT');
                focusItem(selectedIndex);
                //this.afterMove();
                return nav.selectedElement;
            },
            left: function() {
                //this.beforeMove();
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision('LEFT');
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
            console.log("this.current: ", this.current);
            var att_href = this.current.el.getAttribute("href");
            var att_f_link = this.current.el.getAttribute("data-focused-link");
            var att_f_func = this.current.el.getAttribute("data-focused-function");
            console.log("att_href: ", att_href);
            console.log("att_f_link: ", att_f_link);
            console.log("att_f_func: ", att_f_func);
            var e = {
                "el": this.current,
                "att_href": att_href,
                "att_f_link": att_f_link,
                "att_f_func": att_f_func
            }
            this.actionFunction(e);
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
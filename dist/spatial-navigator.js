/**
 * spatial-navigator
 * JS spatial navigation library.
 * @version 1.1.3 - 2021-06-18
 * @link https://github.com/ajsoriar/spatial-navigator
 * @author Andres J. Soria R. <ajsoriar@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function () {

    'use strict';

    var checkInit = function () {
        if (nav.current.el != null) return;
        refreshFocusableMap();
        var rnd = Math.floor(Math.random() * nav.listOfFocusableElements.length) + 0; 
        focusItem(rnd);
    };

    var refreshFocusableMap = function () {
        refreshListOfFocusableItems();
        refreshListOfFocusableGroups();
    };

    var refreshListOfFocusableItems = function (className) {

        nav.listOfFocusableElements = getListOffocusableItems();
        for (var i = 0; i < nav.listOfFocusableElements.length; i++) {
            if (nav.listOfFocusableElements[i].id === '') {
                nav.listOfFocusableElements[i].id = Date.now() + i;
            }
        }
    };

    var refreshListOfFocusableGroups = function (className) {

        nav.listOfFocusableGroups = getListOffocusableGroups();
        for (var i = 0; i < nav.listOfFocusableGroups.length; i++) {
            if (nav.listOfFocusableGroups[i].id === '') {
                nav.listOfFocusableGroups[i].id = Date.now() + i;
            }
        }
    };

    var getListOffocusableItems = function (domEl, className) {
        if (!className) className = 'focusable';
        if (!domEl) domEl = document;
        return domEl.getElementsByClassName(className);
    };

    var getListOffocusableGroups = function (domEl, className) {
        if (!className) className = 'focusable-group';
        if (!domEl) domEl = document;
        return domEl.getElementsByClassName(className);
    };

    var Utils = {

        addClass: function (domEl, styleName) {
            if (domEl === null || styleName === null) return -1;
            var element = domEl,
                name,
                arr;
            arr = element.className.split(' ');
            if (arr.indexOf(styleName) == -1) {
                element.className += ' ' + styleName;
            }
        },

        removeClass: function (domEl, styleName) {
            if (domEl === null || styleName === null) return -1;
            var element = domEl;
            element.classList.remove(styleName);
        },

        removeClassFromElements: function (arrOfElements, styleName) {
            for (var i = 0; i < arrOfElements.length; i++) {
                this.removeClass(arrOfElements[i], styleName);
            }
        },

        getRandomNum: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        substract: function (a, b) {
            if (a === b) return 0;
            if (a > b) return a - b;
            return b - a;
        },

        getDistance: function (x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        },

        getAngle: function (originX, originY, destinyX, destinyY) {
        }
    };

    var Filters = {
        filter_targets_in_area_by_max_min: function (x1, y1, x2, y2, targets) {
            console.log('fom: ', x1, ', ', y1);
            console.log('to: ', x2, ', ', y2);
            var arr = [],
                lon = targets.length;

            for (var i = 0; i < lon; i++) {
                if (targets[i].x1 >= x1 && targets[i].x2 <= x2) {
                    if (targets[i].y1 >= y1 && targets[i].y2 <= y2) {
                        arr.push(targets[i]);
                    }
                }
            }

            return arr;
        },
        filter_targets_in_area_by_center_xy: function (x1, y1, x2, y2, targets) {
            var arr = [];
            for (var i = 0; i < targets.length; i++) {
                if (targets[i].cx >= x1 && targets[i].cx <= x2) {
                    if (targets[i].cy >= y1 && targets[i].cy <= y2) {
                        arr.push(targets[i]);
                    }
                }
            }
            return arr;
        },
        filter_targets_nearest_to_xy: function (x, y, targets) {
            var current = null,
                i = 0,
                lon = targets.length,
                ld = null,
                d = null;

            for (i; i < lon; i++) {
                if (i === 0) {
                    current = targets[0];
                    ld = Utils.getDistance(targets[0].cx, targets[0].cy, x, y);
                } else {
                    d = Utils.getDistance(targets[i].cx, targets[i].cy, x, y);
                    if (d < ld) {
                        current = targets[i];
                        ld = d;
                    }
                }
            }

            return current;
        }
    };

    var focusArea = function (areaId, v, h) {

        if (areaId === undefined || areaId === null) {
            console.error('div layer id needed!');
            return -1;
        }

        if (!v) v = 'top';

        if (!h) h = 'left';

        var el = document.getElementById(areaId);
        if (el === null) return -1;

        var domRect = el.getBoundingClientRect();
        var p = {};
        p.x1 = domRect.left;
        p.y1 = domRect.top;
        p.x2 = domRect.right;
        p.y2 = domRect.bottom;
        var corner = {};

        if (v === 'top') {
            if (h === 'left') {
                console.log('top left');
                corner.x = p.x1;
                corner.y = p.y1;
            } else {
                console.log('top right');
                corner.x = p.x2;
                corner.y = p.y1;
            }
        } else {
            if (h === 'left') {
                console.log('bottom left');
                corner.x = p.x1;
                corner.y = p.y2;
            } else {
                console.log('bottom right');
                corner.x = p.x2;
                corner.y = p.y2;
            }
        }
        refreshFocusableMap();
        var targets = calculateAllDistances();
        targets = Filters.filter_targets_in_area_by_max_min(p.x1, p.y1, p.x2, p.y2, targets);
        var targetElement = Filters.filter_targets_nearest_to_xy(corner.x, corner.y, targets);

        console.log(targetElement);

        nav.focusById(targetElement.id);

        return targetElement;
    };

    var focusItem = function (num) {
        console.log('focusItem() num: ' + num);

        if (num === undefined || num === null || num < 0) {
            console.error("'num' needed!");
            return -1;
        }

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
            Utils.addClass(nav.current.el, 'focused');

            console.log('selected is: ', num);
        } else {
            console.log('No focusable elements');
        }
    };

    var removeFocusedClassFromAllElements = function () {
        Utils.removeClassFromElements(document.getElementsByClassName('focusable'), 'focused');
    };

    function calculateAllDistances() {
        console.log(' --- calculateAllDistances()');

        var elmts = nav.listOfFocusableElements;
        var current = nav.current;

        nav.focusableTargets = calculateDistances(elmts, current);

        return nav.focusableTargets;
    }

    var calculateDistances = function (arrOfElements, currentEl) {
        console.log(' calculateDistances()');
        console.log(' currentEl: ', currentEl);

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
            p.area = null;
            resultsArr.push(p);
        }

        console.log(' resultsArr: ', resultsArr);

        return resultsArr;
    };

    var getFocusableGroupName = function () {};

    function takeADecision(direction) {

        console.log('takeADecision() direction:' + direction);
        console.log('Take a decision...');
        console.log('nav.focusableTargets: ', nav.focusableTargets);
        console.log('current: ', nav.current);

        var decisionIndex = -1;
        var target = [];
        var tempTargets = [];

        console.info('.a Before filter 0 (by group), target: ', target);

        function fliter_0(focusabletargets, focusedEl, direction, focusableGroups, focusableGroupName) {
            if (focusableGroupName === null) return focusabletargets;

            var lon = focusableGroups.length;
            var i = 0;
            for (i; i < lon; i++) {
                var att_f_group_name = focusableGroups[i].getAttribute('data-focus-group-name');
                if (focusableGroupName === att_f_group_name) {
                    break;
                }
            }

            var arr = getListOffocusableItems(focusableGroups[i]);

            return arr;
        }

        tempTargets = fliter_0(nav.focusableTargets, nav.current, direction, nav.listOfFocusableGroups, nav.curretGroup);

        console.info('.a Before filter 1 (Half / Half), target: ', target);

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
                return focusabletargets;
            }

            return arr;
        }

        tempTargets = fliter_1(nav.focusableTargets, nav.current, direction);

        function fliter_3_0(focusabletargets, focusedEl, direction) {
            var arr = [];

            if (focusabletargets.length > 1) {
                for (var i = 0; i < focusabletargets.length; i++) {
                    if (direction === 'UP' || direction === 'DOWN') {

                        if (focusabletargets[i].cx > focusedEl.x1 && focusabletargets[i].cx < focusedEl.x2) {
                            arr.push(focusabletargets[i]);
                        }
                    }

                    if (direction === 'RIGHT' || direction === 'LEFT') {

                        if (focusabletargets[i].cy > focusedEl.y1 && focusabletargets[i].cy < focusedEl.y2) {
                            arr.push(focusabletargets[i]);
                        }
                    }
                }
            } else {
                return focusabletargets;
            }

            if (arr.length === 0) return focusabletargets; 

            return arr;
        }

        function fliter_3_1(focusabletargets, focusedEl, direction) {
            var arr = [];

            if (focusabletargets.length > 1) {
                for (var i = 0; i < focusabletargets.length; i++) {
                    if (direction === 'UP' || direction === 'DOWN') {

                        if (focusabletargets[i].x2 > focusedEl.x1 && focusabletargets[i].x1 < focusedEl.x2) {
                            arr.push(focusabletargets[i]);
                        }
                    }

                    if (direction === 'RIGHT' || direction === 'LEFT') {

                        if (focusabletargets[i].y2 > focusedEl.y1 && focusabletargets[i].y1 < focusedEl.y2) {
                            arr.push(focusabletargets[i]);
                        }
                    }
                }
            } else {
                return focusabletargets;
            }

            if (arr.length === 0) return focusabletargets; 

            return arr;
        }
        var tempTargets_2 = fliter_3_1(tempTargets, nav.current, direction);

        tempTargets = tempTargets_2; 

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

                return el;
            } else if (focusabletargets.length === 1) {
                return focusabletargets[0];
            }

            return -1;
        }

        tempTargets = fliter_4(tempTargets, nav.current, direction);

        decisionIndex = tempTargets ? tempTargets.id : null;

        return decisionIndex; 
    }

    var doAction = function () {
        console.log('Default action!');
    };

    var focusById = function (targetID) {
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
        current: {
            el: null
        },
        init: function () {
        },
        reset: function () {
            this.current.el = null;
            checkInit();
            calculateAllDistances();
        },
        curretGroup: null,
        previousSelectedElement: null,
        w: null,
        h: null,
        cx: null,
        cy: null,
        listOfFocusableElements: [],
        focusableTargets: [],
        getFocusableGroupName: null,
        actionFunction: function (e) {
            console.log(e);

            if (e.att_href != null) {
            }

            if (e.att_f_link != null) {
                window.location = e.att_f_link;
            }

            if (e.att_f_func != null) {
                eval(e.att_f_func);
            }
        },
        move: {
            up: function () {
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision('UP');
                focusItem(selectedIndex);
                return nav.current.el;
            },
            down: function () {
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision('DOWN');
                focusItem(selectedIndex);
                return nav.current.el;
            },
            right: function () {
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision('RIGHT');
                focusItem(selectedIndex);
                return nav.current.el;
            },
            left: function () {
                checkInit();
                calculateAllDistances();
                var selectedIndex = takeADecision('LEFT');
                focusItem(selectedIndex);
                return nav.current.el;
            },
            rnd: function () {},
            to: function () {
            }
        },
        groupBy: function (groupName) {
            this.curretGroup = groupName;
        },
        ungroup: function () {
            this.curretGroup = null;
        },
        action: function () {
            console.log('this.current: ', this.current);
            var att_href = this.current.el.getAttribute('href');
            var att_f_link = this.current.el.getAttribute('data-focus-action-link');
            var att_f_func = this.current.el.getAttribute('data-focus-action-function');
            console.log('att_href: ', att_href);
            console.log('att_f_link: ', att_f_link);
            console.log('att_f_func: ', att_f_func);
            var e = {
                el: this.current,
                att_href: att_href,
                att_f_link: att_f_link,
                att_f_func: att_f_func
            };
            this.actionFunction(e);
        },
        getNextElement: function (arrOfElements, currentElement, movDirection, filterNameOrID) {
            console.log('getNextElement(), arrOfElements:', arrOfElements);
            console.log('getNextElement(), currentElement:', currentElement);
            console.log('getNextElement(), movDirection:', movDirection);
            console.log('getNextElement(), filterNameOrID:', filterNameOrID);

            if (arrOfElements === null) return undefined;
            if (currentElement === undefined || currentElement === null) {
                this.applySelectionStyle(arrOfElements[Utils.getRandomNum(0, arrOfElements.length - 1)]);
                return;
            }
            if (filterNameOrID === null) filterNameOrID = 'RANDOM';
            if (movDirection === null) filterNameOrID = 'RANDOM';

            return automaticallyGetNextElement(arrOfElements, currentElement, movDirection, filterNameOrID);
        },
        applySelectionStyle: function (domElement) {
            if (domElement === undefined || domElement === null) return -1;
            if (nav.current.el != null) Utils.removeClass(nav.current.el, 'focused');
            nav.current.el = domElement;
            Utils.addClass(nav.current.el, 'focused');
        },
        focusById: focusById,
        focusArea: focusArea, 
        map: {
            draw: function () {
                var arr = nav.focusableTargets, 
                    lon = arr.length,
                    i = 0,
                    el = document.getElementById('map-el'),
                    str = '',
                    scale = 0.3;

                if (el === null) {
                    el = document.createElement('div');
                    el.id = 'map-el';
                    el.style.cssText = '' + 'position:absolute;' + 'top:0;left:0;' + 'width:100%;' + 'height:100%;' + 'opacity:1;' + 'z-index:1000;' + 'background:red;' + 'transform: scale(' + scale + ');' + 'transform-origin: 0 0;';

                    document.body.appendChild(el);
                }

                for (i; i < lon; i++) {
                    console.log(arr[i]);
                    var d = arr[i];
                    str += '<div style="position:absolute; top:' + d.y1 + 'px;left:' + d.x1 + 'px; width:' + d.w + 'px;height:' + d.h + 'px; background-color: cyan; outline: 1px solid blue;">' + i + '</div>';
                }

                el.innerHTML = str;
            },
            clear: function () {
                var el = document.getElementById('map-el');
                if (el === null) return;
                document.body.removeChild(el);
            }
        }
    };
})();

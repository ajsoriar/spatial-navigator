(function(){

    window.MinKekyboard = function(){

        'use-strict'

        var drawKeys = function() {
            var str =''
            +'<div style="position:absolute; bottom: 0px; width: 50%; left:50%;">'
            +'<div style="position: absolute;'
            +'top: -100px;'
            +'width: 150px;'
            +'left: -75px;'
            +'height: 100px;'
            +'background-color: coral;">'
            +'    <div id="btn-up" class="btn-demo" onclick="nav.move.up();">TOP</div>'
            +'    <div id="btn-down" class="btn-demo" onclick="nav.move.down();">BOTTOM</div>'
            +'    <div id="btn-left" class="btn-demo" onclick="nav.move.left();">LEFT</div>'
            +'    <div id="btn-right" class="btn-demo" onclick="nav.move.right();">RIGHT</div>'
            +'</div>'
            +'</div>';
            return str
        };

        var createDomEl = function(){
            el = document.createElement('div');
            el.setAttribute("id", "ee-key");
            document.body.appendChild(el);
            el.innerHTML = drawKeys();
        };

        var init = function(){
            console.log('MinKekyboard.init()');
            createDomEl();
            attachEvents();
        };

        var attachEvents = function() {

            console.log( "ready!" );
            nav.reset();
            appWindow.resize();
            App.doStuff();

            // atach events to demo buttons
            $( "#btn-up" ).mouseenter(function() {
                nav.calculateDecissionPreviewAndShow( 1);
            });
            $( "#btn-down" ).mouseenter(function() {
                nav.calculateDecissionPreviewAndShow( 3);
            });
            $( "#btn-left" ).mouseenter(function() {
                nav.calculateDecissionPreviewAndShow( 2);
            });
            $( "#btn-right" ).mouseenter(function() {
                nav.calculateDecissionPreviewAndShow( 4);
            });

            $( "#btn-up" ).mouseleave(function() {
                nav.clearPreview( 1);
            });
            $( "#btn-down" ).mouseleave(function() {
                nav.clearPreview( 3);
            });
            $( "#btn-left" ).mouseleave(function() {
                nav.clearPreview( 2);
            });
            $( "#btn-right" ).mouseleave(function() {
                nav.clearPreview( 4);
            });

            // more
            
            $( "#btn-random" ).mouseleave(function() {
                //nav.clearPreview();
                nav.applyRandomDecision();
            });

        };

        //init();

        if(window.onload) {
            var currentOnLoad = window.onload;
            var newOnLoad = function(ev) {
                currentOnLoad(ev);
                init(ev);
            };
            window.onload = newOnLoad;
        } else {
            window.onload = init;
        }
    }

    window.MinKekyboard();

}());

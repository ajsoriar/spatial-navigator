// --------------------------
// Resize
// --------------------------

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
    nav.recalculateContainers();
};

window.addEventListener("resize", appWindow.resize);

App = {};

App.doStuff = function(){

    nav.setDecissionFunction = function( that ){

        console.log("- my decission function, that:", that );
    }
};

// --------------------------
// Document ready
// --------------------------

$( document ).ready(function() {

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

});





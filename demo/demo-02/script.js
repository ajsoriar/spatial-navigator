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

//App = {};


// --------------------------
// Resize
// --------------------------

window.addEventListener("resize", function(){
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

    // nav.setTotalWidth( width );
    // nav.setTotalHeight( height );
    // nav.recalculateContainers();
});

// --------------------------
// Keydown
// --------------------------

document.addEventListener('keydown', function (e) {

    console.log("keydown e.which:", e);

    switch (e.which) {

        case 37:
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
            break;
            
        default:
            // do nothing!
    }

});

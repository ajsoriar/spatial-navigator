$(document).keydown(function(e) {

      console.log("keydown e.which:", e.which );
      //$("#txtKeydown").val(e.which);
      switch(e.which) {
          case 37: // left
          
            nav.moveLeft();
            break;
  
          case 38: // up
            nav.moveUp();
            break;
  
          case 39: // right
            nav.moveRight();
            break;
  
          case 40: // down
            nav.moveDown();
            break;
          case 82: // r
            // clear selection
            break;
  
          default: return; // exit this handler for other keys
      }

});



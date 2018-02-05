document.addEventListener('keydown', function(e) {

    console.log('Key code : ' + e.keyCode);

    switch(e.keyCode) {
      
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
          
        case 82: // r
            // clear selection
            break;
    
        default: 
            return;
    }

});
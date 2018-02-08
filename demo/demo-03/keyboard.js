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
      
      case 13: // r
          // clear selection

          pressIntro();
          break;

      default: 
          return;
  }

});

var pressIntro = function(){

    var el = document.getElementsByClassName("is-selected")[0];
    if ( !el ) return;

    simulateClick( el );

};

/**
 * Simulate a click event.
 * @public
 * @param {Element} elem  the element to simulate a click on
 */
var simulateClick = function (elem) {
	// Create our event (with options)
	var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	// If cancelled, don't dispatch our event
	var canceled = !elem.dispatchEvent(evt);
};
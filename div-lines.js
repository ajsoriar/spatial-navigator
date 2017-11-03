(function() {

  window.dljs = {
    "el": null
  };

  dljs.init = function ( el ) {

    console.log("dljs.init()");

    if (!el){

      // create
      var strId = "dljs-"+ Date.now();
      this.el = document.createElement('ul');
      this.el.setAttribute("id", strId );
      this.el.setAttribute("style", "position: absolute; top: 0; left: 0; width: 0; height: 0; background-color: transparent; display: inline-block; margin: 0; padding: 0;"  );
      document.body.appendChild(this.el);

    } else {

      this.el = document.getElementById( el );
    }

    return this
  };

  dljs.line = function (x1,y1,x2,y2,color) {
    if (!this.el) this.init();
    if (color === "RANDOM") color = this.utils.getRandomColor();
    if (color === null) color = "#000";
    var new_content = dljs.getLineString(null,x1,y1,x2,y2, 2, color, 1, false, 0, null);
    this.draw( new_content );
    return this.el.lastElementChild
  };

  dljs.rndLine = function(){
    var u = this.utils;
    this.line( u.rndX(), u.rndY(), u.rndX(), u.rndY(), u.rndColor() );
    return this.el.lastElementChild
  };

  dljs.draw = function(html){ // Draw html content
    this.el.innerHTML = this.el.innerHTML + html; //previous_html_lines + new_content;
  };

  dljs.utils = {};

  dljs.utils.getDistance = function(x1,y1,x2,y2){
    return 0
  };

  dljs.utils.getSlope = function(x1,y1,x2,y2){
    return (y2-y1)/(x2-x1)
  };

  dljs.rm = function(lineID){ // Remove line

  };

  dljs.update = function(id, propsArr ){

  };

  dljs.trace = function(arr){

  };

  dljs.createContext = function() {

  };

  dljs.utils.getRandomNum = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  dljs.utils.rndColor = function() {
      var r = this.getRandomNum(0, 255);
      var g = this.getRandomNum(0, 255);
      var b = this.getRandomNum(0, 255);
      var a = 1;
      return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  };

  dljs.utils.rndX = function() {
      return this.getRandomNum(1, window.innerWidth );
  };

  dljs.utils.rndY = function() {
      return this.getRandomNum(1, window.innerHeight );
  };

  // This function returns an html string
  dljs.getLineString = function (idString,x1,y1,x2,y2,weight,color,opacity, roundBorder, longSombra, colSombra){

      if (x2 < x1){
          var aux_x = x1; x1 = x2; x2 = aux_x;
          var aux_y = y1; y1 = y2; y2 = aux_y;
      }

      if ( idString === null ) idString = "line-"+ Date.now();
      var cathetus1 = x2-x1
      var cathetus2 = y2-y1;
      var hypotenuse = Math.sqrt(cathetus1*cathetus1+cathetus2*cathetus2);
      var w=hypotenuse + weight;
      var angRadians = Math.asin(cathetus2/hypotenuse);
      var ang = angRadians * 180 / Math.PI;

      //var string = '<div id="'+ idString +'" class="line" style="top:'+y1+'px;left:'+x1+'px; width:'+w+'px; height:'+weight+'px; transform: rotateZ('+ang+'deg) translateX(-'+weight/2+'px) translateY(-'+weight/2+'px); background-color: '+color+'; opacity:'+opacity+'; border-radius: '+weight+'px; box-shadow: 0 0 '+ longSombra +'px '+ colSombra +'; transform-origin: 0 0;position: absolute;"></div>';
      var string = '<li id="'+ idString +'" class="line" style="top:'+y1+'px;left:'+x1+'px; width:'+w+'px; height:'+weight+'px; transform: rotateZ('+ang+'deg) translateX(-'+weight/2+'px) translateY(-'+weight/2+'px); background-color: '+color+'; opacity:'+opacity+'; border-radius: '+weight+'px; box-shadow: 0 0 '+ longSombra +'px '+ colSombra +'; transform-origin: 0 0;position: absolute;"></li>';

      return string;
  };

})();

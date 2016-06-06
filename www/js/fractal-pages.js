// @author github.com/croolsby
define('fractal-pages', ["bspline"], function (bspline) {
  'use strict';
  
  var fp = function () {
    // ensure bspline is loaded
    if (typeof bspline == 'undefined') {
      alert("bspline.js not loaded.");
      // return;
    }

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var colors = {
      gray1: 'rgb(15, 15, 15)',
      gray2: 'rgb(42, 42, 42)',
      gray3: 'rgb(102, 102, 102)',
    };

    function update() {
      frameCount++;
      // console.log("frameCount: " + frameCount);
    }

    function draw() {
      ctx.fillStyle = colors.gray1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.fillText("frameCount: " + frameCount, 10, 10);
    }

    var exitTimeCurrentFPS = 0;
    function currentFPS() {
      
      exitTimeCurrentFPS = performance.now();
    }
    
    function setFillColor(r, g, b, a) {
      // console.log("(r, g, b, a): (" + r + ", " + g + ", " + b + ', ' + a + ')');
      ctx.fillStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    }
    
    function setFillColorNormal(r, g, b, a) {
      setFillColor(r * 255.0, g * 255.0, b * 255.0, a * 255.0);
    }
    
    // set mouse event listener and handler
    canvas.addEventListener("mousedown", function () {

    });

    canvas.addEventListener("mouseup", function () {

    });

    canvas.addEventListener("mousemove", function () {

    });
    
    // make canvas resize when browser window is resized
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      update();
      draw();
    }
    resizeCanvas();
    
    // start update loop
    var FPS = 30;
    var frameCount = -1; // use performance.now() to get realtime in milliseconds since startup.
    setInterval(function () {
      update();
      draw();
    }, 1000 / FPS);
  };
  
  return fp;
});

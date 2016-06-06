function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

require(["bspline"], function (BSpline) {
  'use strict'

  var s = Snap("#svg");

  var colors = {
    gray1: '#0f0f0f',
    gray2: '#2a2a2a',
    gray3: '#666666',
  };

  // declare svg elements
  var background;
  var onTop;

  background = s.rect(0, 0, window.innerWidth, window.innerHeight);
  background.attr({
    fill: colors.gray1,
  });

  onTop = s.rect(100, 100, window.innerWidth - 200, window.innerHeight - 200);
  onTop.attr({
    fill: colors.gray2,
  });

  // set the position of all the svg elements
  // call this function in future to reset
  function defineElements() {
    
  }
  defineElements();

  var bspline = new BSpline();
  bspline.appendPoint(100, 100);
  bspline.appendPoint(200, 200);
  bspline.appendPoint(300, 100);

  var bsplineControlLines = s.polyline(bspline.pointsToArray());
  bsplineControlLines.attr({
    stroke: '#aaa',
    strokeWidth: 1,
    strokeLinecap: 'round',
    fillOpacity: 0,
  });

  var bsplinePath = s.polyline(bspline.pathToArray());
  bsplinePath.attr({
    stroke: '#eee',
    strokeWidth: 2,
    strokeLinecap: 'round',
    fillOpacity: 0,
  });

  // var circle_1 = s.circle(300, 200, 140);
  // var circle_2 = s.circle(250, 200, 140);

  // // Group circles together

  // var circles = s.group(circle_1, circle_2);

  // var ellipse = s.ellipse(275, 220, 170, 90);

  // // Add fill color and opacity to circle and apply
  // // the mask
  // circles.attr({
  //   fill: 'coral',
  //   fillOpacity: .6,
  //   mask: ellipse
  // });

  // ellipse.attr({
  //   fill: '#fff',
  //   opacity: .8
  // });

  // // Create a blink effect by modifying the rx value
  // // for ellipse from 90px to 1px and backwards

  // function blink() {
  //   ellipse.animate({ ry: 1 }, 220, function () {
  //     ellipse.animate({ ry: 90 }, 300);
  //   });
  // };

  // set mouse event listener and handler
  // var svg = document.getElementById('svg');
  // svg.addEventListener("mousedown", function () {

  // });

  // svg.addEventListener("mouseup", function () {

  // });

  // svg.addEventListener("mousemove", function () {

  // });

  // make canvas resize when browser window is resized
  window.addEventListener('resize', resizeCanvas, false);
  function resizeCanvas() {
    // adjust attributes that depend on resize
    background.attr({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    onTop.attr({
      width: window.innerWidth - 200,
      height: window.innerHeight - 200,
    });
  }

  // setInterval(blink, 3000);
  // start update loop
  // var FPS = 30;
  // var frameCount = -1; // use performance.now() to get realtime in milliseconds since startup.
  // setInterval(function () {
  //   update();
  //   draw();
  // }, 1000 / FPS);
});
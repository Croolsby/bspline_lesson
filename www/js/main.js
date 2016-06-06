function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

require(["bspline"], function (BSpline) {
  var s = Snap("#svg");

  var colors = {
    gray1: '#0f0f0f',
    gray2: '#2a2a2a',
    gray3: '#666666',
  };

  // declare svg elements
  var background;
  var onTop;

  // set the position of all the svg elements
  // call this function in future to reset
  function defineElements() {
    background = s.rect(0, 0, window.innerWidth, window.innerHeight);
    background.attr({
      fill: colors.gray1,
    });

    onTop = s.rect(100, 100, window.innerWidth - 200, window.innerHeight - 200);
    onTop.attr({
      fill: colors.gray2,
    });
  }
  defineElements();



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
  canvas.addEventListener("mousedown", function () {

  });

  canvas.addEventListener("mouseup", function () {

  });

  canvas.addEventListener("mousemove", function () {

  });

  // make canvas resize when browser window is resized
  window.addEventListener('resize', resizeCanvas, false);
  function resizeCanvas() {
    defineElements();
  }
  resizeCanvas();

  // setInterval(blink, 3000);
  // start update loop
  // var FPS = 30;
  // var frameCount = -1; // use performance.now() to get realtime in milliseconds since startup.
  // setInterval(function () {
  //   update();
  //   draw();
  // }, 1000 / FPS);
});
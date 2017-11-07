// declaring these two functions to use them in console. 
// Warning: these global methods are being called in bspline-model.js
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function randomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function randomHex() {
  return rgbToHex(randomInt(255), randomInt(255), randomInt(255));
}

function lerpColor(a, b, amount) {

  var ah = parseInt(a.replace(/#/g, ''), 16),
    ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
    bh = parseInt(b.replace(/#/g, ''), 16),
    br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);

  return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

require(['bspline'], function (BSpline) {
  'use strict'

  var s = Snap('#svg');

  var colors = {
    gray1: '#0f0f0f',
    gray2: '#2a2a2a',
    gray3: '#666666',
  };

  // declare svg elements
  var background = s.rect(0, 0, window.innerWidth, window.innerHeight);
  background.attr({
    fill: colors.gray1,
  });

  var onTop = s.rect(100, 100, window.innerWidth - 200, window.innerHeight - 200);
  onTop.attr({
    fill: colors.gray2,
  });

  var fpsText = s.text(10, 15, "test");
  fpsText.attr({
    fill: "white",
  });

  console.log(fpsText);

  var wipText = s.text(300, 15, "Work In Progress");
  wipText.attr({
    fill: 'white',
  });
  wipText.attr('xlink:href', 'https://github.com/croolsby/bspline_lesson');

  // var fpsText2 = s.text(10, 20, "test");
  // fpsText2.attr({
  //   fill: "white",
  // });

  var bspline = new BSpline(s, document.getElementById('svg'));
  bspline.appendPoint(180, 320);
  bspline.appendPoint(300, 160);
  bspline.appendPoint(480, 170);
  bspline.appendPoint(600, 300);
  bspline.appendPoint(750, 200);

  function updateSVG() {
    bspline.update();

    fpsText.attr({
      text: 'fps: ' + fpsCounter.avgfps,
    });

    // fpsText2.attr({
    //   text: 'rawfps: ' + fpsCounter.rawfps,
    // });
    fpsCounter.update();

    requestAnimationFrame(updateSVG);
  }

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

  // prevent default event behavior
  // this fixes firefox dragging image problem,
  // however, now text isn't selectable....
  var defaultPreventer = function (ev) {
    ev.preventDefault();
  }
  window.addEventListener('mousedown', defaultPreventer);
  window.addEventListener('mouseup', defaultPreventer);
  window.addEventListener('mousemove', defaultPreventer);

  // declare an FPSCounter object
  function FPSCounter() {
    this.avgfps = 0;
    this.rawfps = 0;
    this.qty = 0;
    this.exitTime = 0;
  }
  FPSCounter.prototype = {
    update: function () {
      var deltaTime = performance.now() - this.exitTime;
      this.rawfps = 1000 / deltaTime;

      this.qty++;

      if (performance.now() > 2000) {
        // do not average first 2 seconds of data because initial loading is heavier than usual.
        this.avgfps += (this.rawfps - this.avgfps) / this.qty;
      } else {
        this.avgfps = this.rawfps;
      }

      this.exitTime = performance.now();
    }
  };

  // instantiate an FPSCounter object
  var fpsCounter = new FPSCounter();

  // start update loop
  // use performance.now() to get realtime in milliseconds since startup.
  // var FPS = 100;
  // var frameCount = -1;
  // setInterval(function () {
  //   frameCount++;
  //   fpsCounter.update();
  //   updateSVG();
  // }, 1000 / FPS);

  requestAnimationFrame(updateSVG);
});
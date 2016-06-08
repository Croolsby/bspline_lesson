// @author github.com/croolsby
define('knot-controller', ['vector'], function (Vector) {
  'use strict';

  function Controller(parent, domElement) {
    if (parent == null) {
      console.error('A parent must be specified.');
    }
    if (domElement == null) {
      console.error('A DOM element to subcribe event listeners to must be specified.');
    }

    this.parent = parent;
    this.domElement = domElement; // reference used for destruction

    this.selectedKnot = null;
    this.selectedKnotIndex = -1;
    this.hovering = true;

    this.lastMouse = [0, 0];

    // 'this' inside of the anonymous function given to addEventListener is not that same as 'this' inside 'function Controller() {}'.
    // these helper functions need to be named for destruction
    this.mousedownHelper = function (ev) {
      ev.preventDefault();
      Controller.mousedownHandeler(parent, ev);
    };
    this.mouseupHelper = function (ev) {
      ev.preventDefault();
      Controller.mouseupHandeler(parent, ev);
    };
    this.mousemoveHelper = function (ev) {
      ev.preventDefault();
      Controller.mousemoveHandeler(parent, ev);
    };
    this.domElement.addEventListener('mousedown', this.mousedownHelper);
    this.domElement.addEventListener('mouseup', this.mouseupHelper);
    this.domElement.addEventListener('mousemove', this.mousemoveHelper);
  }

  Controller.prototype = {
    destruct: function () {
      this.domElement.removeEventListener('mousedown', this.mousedownHelper);
      this.domElement.removeEventListener('mouseup', this.mouseupHelper);
      this.domElement.removeEventListener('mousemove', this.mousemoveHelper);
    },
  };

  Controller.mousedownHandeler = function (bspline, ev) {
    // detect if any control point is being clicked on.
    var thisController = bspline.knotController;
    var hitResult = Controller.findHit(bspline, ev.clientX, ev.clientY);
    if (hitResult != null) {
      var hit = hitResult[0];
      thisController.selectedKnot = hit;
      thisController.selectedKnotIndex = hitResult[1];
      // console.log(hitResult);
    }
    thisController.hovering = false;
  };

  Controller.mouseupHandeler = function (bspline, ev) {
    // deselectPoint
    var thisController = bspline.knotController;
    thisController.selectedPoint = null;
    thisController.selectedPointIndex = -1;
    thisController.hovering = true;
  };

  Controller.mousemoveHandeler = function (bspline, ev) {
    // note that mousemove is always called after mouseup
    var thisController = bspline.knotController;

    if (thisController.selectedKnot == null || thisController.hovering) {
      // draw something to indicate that the knot can be clicked on.
      // the view refers to the controllers state to do this
      var hitResult = Controller.findHit(bspline, ev.clientX, ev.clientY);
      if (hitResult != null) {
        var hit = hitResult[0];
        thisController.selectedKnot = hit;
        thisController.selectedKnotIndex = hitResult[1];
      } else {
        thisController.selectedKnot = null;
        thisController.selectedKnotIndex = -1;
      }

    } else {
      if (!thisController.hovering) {
        // drag the selected knot
        // knots cannot crossover each other.
        var knotLineLength = bspline.knotView.knotLineLength;
        
        // var delta = ev.clientX - thisController.lastMouse[0];
        // delta /= knotLineLength; 
        var x0 = bspline.knotView.x0;
        var x = (ev.clientX - x0) / knotLineLength;

        var index = thisController.selectedKnotIndex;

        // bspline.model.setKnot(index, bspline.model.knots[index] + delta);
        bspline.model.setKnot(index, x);
      }
    }

    // save the mouse coordinates to compute a delta
    thisController.lastMouse = [ev.clientX, ev.clientY];
  };

  Controller.findHit = function (bspline, x, y) {
    var knots = bspline.knotView.knots;
    try {
      var raw = knots[0].node.attributes[0].value.substring(4).split(',');
    } catch(err) {
      // this happens because the event is triggered before any knots have been made.
      return null;
    }
    
    // triangle defined in object coordinates
    var triangleObject = new Array(3);
    triangleObject[0] = new Vector(Number(raw[0]), Number(raw[1]));
    triangleObject[1] = new Vector(Number(raw[2]), Number(raw[3]));
    triangleObject[2] = new Vector(Number(raw[4]), Number(raw[5]));

    var p = new Vector(x, y);
    var hitResult = null;
    var x0 = bspline.knotView.x0;
    var lineLength = bspline.knotView.knotLineLength;

    for (var i = 0; i < knots.length; i++) {
      var translation = new Vector(knots[i].matrix.e, knots[i].matrix.f);
      // console.log(translation);
      var p0 = triangleObject[0].add(translation); // top right
      var p1 = triangleObject[1].add(translation); // top left
      var p2 = triangleObject[2].add(translation); // bottom center

      // approximate triangle hit by bounding box
      if (p1.x <= p.x && p.x <= p0.x) {
        if (p0.y <= p.y && p.y <= p2.y) {
          hitResult = [bspline.model.knots[i], i];
          // break;
          var percentOfLine = (p2.x - x0) / lineLength;
          if (percentOfLine > 0.5) {
            break;
          }
        }
      }
    }
    return hitResult;
  };

  // Controller.isPointInTriangle = function (p, p0, p1, p2) {
  //   // point is p
  //   // triangle is p0, p1, p2
  //   // all points are of type Vector from vector.js
  //   var area = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
  //   area = -area; // order of vertices
  //   var s = 1/(2 * area) * (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y);
  //   var t = 1/(2 * area) * (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x + p0.x) * p.y);

  //   // console.log(area);
  //   // console.log(s);
  //   // console.log(t);
  //   // console.log(1-s-t);

  //   if (s > 0 && t > 0 && 1-s-t > 0) {
  //     return true;
  //   }
  //   return false;
  // };

  return Controller;
});
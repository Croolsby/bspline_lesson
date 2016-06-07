// @author github.com/croolsby
define('bspline-controller', [], function () {
  'use strict'

  function Controller(parent, domElement) {
    if (parent == null) {
      console.error('A parent must be specified.');
    }
    if (domElement == null) {
      console.error('A DOM element to subcribe event listeners to must be specified.');
    }

    this.parent = parent;
    this.selectRadius = 10; // distance mouse has to be to select a point.
    this.selectedPoint = null;
    this.selectedPointIndex = -1;
    this.hovering = true;

    this.domElement = domElement; // reference used for destruction

    // 'this' inside of the anonymous function given to addEventListener is not that same as 'this' inside 'function Controller() {}'.
    // these helper functions need to be named for destruction
    this.mousedownHelper = function (ev) {
      Controller.mousedownHandeler(parent, ev);
    };
    this.mouseupHelper = function (ev) {
      Controller.mouseupHandeler(parent, ev);
    };
    this.mousemoveHelper = function (ev) {
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
    var hitResult = Controller.findHit(bspline, ev.clientX, ev.clientY);
    if (hitResult != null) {
      var hit = hitResult[0];
      bspline.controller.selectedPoint = hit;
      bspline.controller.selectedPointIndex = hitResult[1];
    }
    bspline.controller.hovering = false;
  };

  Controller.mouseupHandeler = function (bspline, ev) {
    // deselectPoint
    bspline.controller.selectedPoint = null;
    bspline.controller.selectedPointIndex = -1;
    bspline.controller.hovering = true;
  };

  Controller.mousemoveHandeler = function (bspline, ev) {
    // note that mousemove is always called after mouseup
    if (bspline.controller.selectedPoint == null || bspline.controller.hovering) {
      // draw a circle around a point that can be clicked on.
      var hitResult = Controller.findHit(bspline, ev.clientX, ev.clientY);
      if (hitResult != null) {
        var hit = hitResult[0];
        bspline.controller.selectedPoint = hit;
        bspline.controller.selectedPointIndex = hitResult[1];
      } else {
        bspline.controller.selectedPoint = null;
        bspline.controller.selectedPointIndex = -1;
      }

    } else {
      if (!bspline.controller.hovering) {
        // drag the selected point
        bspline.model.points[bspline.controller.selectedPointIndex].x = ev.clientX;
        bspline.model.points[bspline.controller.selectedPointIndex].y = ev.clientY;
        bspline.model.dirty = true;
      }
    }
  };

  Controller.findHit = function (bspline, x, y) {
    var points = bspline.model.points;
    var selectRadius = bspline.controller.selectRadius;
    for (var i = 0; i < points.length; i++) {
      var dx = points[i].x - x;
      var dy = points[i].y - y;
      var distSqr = dx * dx + dy * dy;

      if (distSqr <= selectRadius * selectRadius) {
        return [points[i], i];
      }
    }

    return null;
  }

  return Controller;
});
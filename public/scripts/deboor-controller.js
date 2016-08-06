// @author github.com/croolsby
define('deboor-controller', ['deboor-view'], function (View) {
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

    this.selected = false;
    this.mousedown = true;
    this.t = 0;

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
    var thisController = bspline.deboorController;
    thisController.selected = Controller.findHit(bspline, ev.clientX, ev.clientY);
    thisController.mousedown = true;
  };

  Controller.mouseupHandeler = function (bspline, ev) {
    // deselectPoint
    var thisController = bspline.deboorController;
    thisController.selected = false;
    thisController.mousedown = false;
  };

  Controller.mousemoveHandeler = function (bspline, ev) {
    // note that mousemove is always called after mouseup
    var thisController = bspline.deboorController;

    if (!thisController.mousedown && !thisController.selected) {
      // check if the mouse has moved on top of the knob.
      thisController.selected = Controller.findHit(bspline, ev.clientX, ev.clientY);
    }
    
    if (!thisController.mousedown && thisController.selected) {
      // the mouse is hovering over the knob.
    }

    if (thisController.mousedown && thisController.selected) {
      // the knob is begin dragged
      var tLineStyle = bspline.deboorView.tLineStyle;
      var length = tLineStyle.x2 - tLineStyle.x1;
      var upToMouse = ev.clientX - tLineStyle.x1;

      var p = upToMouse / length;
      if (p < 0) {
        p = 0;
      }
      if (p > 1) {
        p = 1;
      }
      bspline.model.calc(p);
    }
  };

  Controller.findHit = function (bspline, x, y) {
    var controlDotStyle = bspline.deboorView.controlDotStyle;
    var dx = x - controlDotStyle.cx;
    var dy = y - controlDotStyle.cy;
    var dsqr = dx * dx + dy * dy;
    if (dsqr <= controlDotStyle.r * controlDotStyle.r) {
      return true;
    } else {
      return false;
    }
  };

  return Controller;
});
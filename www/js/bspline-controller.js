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

    this.domElement = domElement; // reference used for destruction

    // 'this' inside of the anonymous function given to addEventListener is not that same as 'this' inside 'function Controller() {}'.
    var self = this;
    // these helper functions need to be named for destruction
    this.mousedownHelper = function (ev) {
      Controller.mousedownHandeler(self, ev);
    };
    this.mouseupHelper = function (ev) {
      Controller.mouseupHandeler(self, ev);
    };
    this.mousemoveHelper = function (ev) {
      Controller.mousemoveHandeler(self, ev);
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
 
  Controller.mousedownHandeler = function (controller, ev) {
    console.log('mousedown');
  };

  Controller.mouseupHandeler = function (controller, ev) {
    console.log('mouseup');
  };

  Controller.mousemoveHandeler = function (controller, ev) {
    // note that mousemove is always called after mouseup
    console.log('mousemove');
  };

  return Controller;
});
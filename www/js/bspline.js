// @author github.com/croolsby
define('bspline', ['bspline-model', 'bspline-view', 'bspline-controller'], function(Model, View, Controller) {
  'use strict'

  // @argument paper = a snap svg paper object
  function BSpline(paper, domElement) {
    this.model = new Model(this);
    this.view = new View(this, paper);
    this.controller = new Controller(this, domElement);
  }

  BSpline.prototype = {
    destruct: function () {
      this.view.destruct();
      this.controller.destruct();
    },

    appendPoint: function (x, y) {
      this.model.appendPoint(x, y);
      this.view.constructSVGElements();
    }
  };

  return BSpline;
});
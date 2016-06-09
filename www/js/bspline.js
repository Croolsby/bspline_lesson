// @author github.com/croolsby
define('bspline', ['bspline-model', 'bspline-view', 'bspline-controller', 'knot-view', 'knot-controller', 'deboor-view'], function(BSplineModel, BSplineView, BSplineController, KnotView, KnotController, DeboorView) {
  'use strict'

  // @argument paper = a snap svg paper object
  function BSpline(paper, domElement) {
    this.model = new BSplineModel(this);
    this.view = new BSplineView(this, paper);
    this.controller = new BSplineController(this, domElement);

    this.knotView = new KnotView(this, paper);
    this.knotController = new KnotController(this, domElement);

    this.deboorView = new DeboorView(this, paper);
  }

  BSpline.prototype = {
    destruct: function () {
      this.view.destruct();
      this.controller.destruct();
    },

    appendPoint: function (x, y) {
      this.model.appendPoint(x, y);
      this.view.constructSVGElements();
    },

    update: function () {
      this.view.update();
      this.knotView.update();
      this.deboorView.update();
      // the model should be clean after an update.
      this.model.dirty = false;
    }
  };

  return BSpline;
});
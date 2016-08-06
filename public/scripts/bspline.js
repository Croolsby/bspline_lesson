// @author github.com/croolsby
define('bspline', ['bspline-model', 'bspline-view', 'bspline-controller', 'knot-view', 'knot-controller', 'deboor-view', 'deboor-controller', 'scaffold-view'], function(BSplineModel, BSplineView, BSplineController, KnotView, KnotController, DeboorView, DeboorController, ScaffoldView) {
  'use strict'

  // @argument paper = a snap svg paper object
  function BSpline(paper, domElement) {
    this.model = new BSplineModel(this);
    this.view = new BSplineView(this, paper);
    this.controller = new BSplineController(this, domElement);

    this.knotView = new KnotView(this, paper);
    this.knotController = new KnotController(this, domElement);

    this.deboorView = new DeboorView(this, paper);
    this.deboorController = new DeboorController(this, domElement);

    this.scaffoldView = new ScaffoldView(this, paper); 
  }

  BSpline.prototype = {
    destruct: function () {
      this.view.destruct();
      this.controller.destruct();
      // Todo hook up destructs
    },

    appendPoint: function (x, y) {
      this.model.appendPoint(x, y);
      // this.model.calc(0);
      this.view.constructSVGElements();
      
    },

    update: function () {
      this.view.update();
      this.knotView.update();
      this.deboorView.update();
      this.scaffoldView.update();
      // the model should be clean after an update.
      this.model.dirty = false;
    }
  };

  return BSpline;
});
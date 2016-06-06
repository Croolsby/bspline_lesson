// @author github.com/croolsby
define('bspline', ['bspline-model', 'bspline-view', 'bspline-controller'], function(Model, View, Controller) {
  'use strict'

  // @argument paper = a snap svg paper object
  function BSpline(paper) {
    this.model = new Model(this);
    this.view = new View(this, paper);
    this.controller = new Controller(this);
  }

  return BSpline;
});
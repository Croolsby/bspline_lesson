// @author github.com/croolsby
define('bspline-view', [], function () {
  'use strict'

  function View(parent, paper) {
    if (parent == null) {
      console.error('A parent must be specified.');
    }
    if (paper == null) {
      console.error('A snap svg paper object must be specified.');
    }

    this.parent = parent;
    this.paper = paper;
    this.drawControlLines = false;
    this.drawDot = false; // the dot is animated and travels along the path

    // initialize snap svg elements
    this.path = paper.polyline([0, 0, 0, 0]);
    this.path.attr({
      stroke: '#eee',
      strokeWidth: 2,
      strokeLinecap: 'round',
      fillOpacity: 0,
    });

    this.controlLines = paper.polyline([0, 0, 0, 0]);
    this.controlLines.attr({
      stroke: '#eee',
      strokeWidth: 1,
      strokeLinecap: 'round',
      fillOpacity: 0,
    });

    this.dot = paper.circle(0, 0, 3);
    this.dot.attr({
      fill: '#ee0000'
    });

    this.point = null;
  }

  View.prototype = {
    destruct: function () {
      if (this.path != null) {
        this.path.remove();
        this.path = null;
      }
      if (this.controlLines != null) {
        this.controlLines.remove();
        this.controlLines = null;
      }
      if (this.dot != null) {
        this.dot.remove();
        this.dot = null;
      }
      if (this.point != null) {
        this.point.remove();
        this.point = null;
      }
    },

    update: function () {
      var model = this.parent.model;

      if (model.dirty) {
        this.path.attr({
          points: model.pathToArray(),
        });

        this.controlLines.attr({
          points: model.pointsToArray(),
        });

        model.dirty = false;
      }

      var v = model.calc(performance.now() / 1000);
      this.dot.attr({
        cx: v.x,
        cy: v.y,
      });

      // draw a circle to indicate when a point can be dragged or is being dragged.
      var controller = this.parent.controller;
      if (controller.selectedPoint != null) {
        // the controller has a point selected
        var p = controller.selectedPoint;
        var r = controller.selectRadius;
        if (controller.hovering) {
          // indicate the point is being hovered.  
          if (this.point == null) {
            // the paper element needs to be created.
            this.point = this.paper.circle(p.x, p.y, r);
          }
          this.point.attr({
            cx: p.x,
            cy: p.y,
            stroke: '#eee',
            strokeWidth: 1,
            fillOpacity: 0,
          });
        } else {
          // indicate the point is grabbed.
          if (this.point == null) {
            this.point = this.paper.circle(p.x, p.y, r);
          }
          this.point.attr({
            cx: p.x,
            cy: p.y,
            stroke: '#ee0000',
            strokeWidth: 1,
            fillOpacity: 0,
          });
        }
      } else {
        // the controller does not have a point selected.
        if (this.point != null) {
          this.point.remove();
          this.point = null;
        }
      }
    },
  };

  return View;
});
// @author github.com/croolsby
define('bspline-view', ['knot-view'], function (KnotView) {
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

    this.constructSVGElements();

    this.point = null;
  }

  View.prototype = {
    destructSVGElements: function () {
      if (this.points != null) {
        for (var i = 0; i < this.points.length; i++) {
          this.points[i].remove();
        }
        this.points = null;
      }

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

    constructSVGElements: function () {
      // ensure all svg elements have been freed before creating replacements.
      this.destructSVGElements();

      var model = this.parent.model;
      
      // draw a line segment between each control point
      this.controlLines = this.paper.polyline(model.pointsToArray());
      this.controlLines.attr({
        stroke: '#fff',
        strokeWidth: 4,
        strokeLinecap: 'round',
        strokeOpacity: 0.5,
        fillOpacity: 0,
      });

      // draw a circle for each control point
      this.points = new Array(model.points.length);
      for (var i = 0; i < this.points.length; i++) {
        this.points[i] = this.paper.circle(model.points[i].x, model.points[i].y, 14);
        this.points[i].attr({
          fill: '#eee',
          fillOpacity: 0.5,
        });
      }

      // initialize snap svg elements
      this.path = this.paper.polyline(model.pathAsArray);
      this.path.attr({
        stroke: '#eee',
        strokeWidth: 6,
        strokeLinecap: 'round',
        fillOpacity: 0,
      });

      this.dot = this.paper.circle(0, 0, 10);
      this.dot.attr({
        fill: '#ee0000'
      });
    },

    update: function () {
      // modify atributes
      var model = this.parent.model;

      if (model.dirty) {
        // update control points
        for (var i = 0; i < this.points.length; i++) {
          this.points[i].attr({
            cx: model.points[i].x,
            cy: model.points[i].y,
          });
        }

        // update control lines
        this.controlLines.attr({
          points: model.pointsToArray(),
        });

        // update path
        this.path.attr({
          points: model.pathAsArray,
        });
      }

      // var v = model.calc(performance.now() / 4000);
      // var v = model.calc(this.parent.deboorController.t);
      var v = model.calcPoint;
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
            strokeWidth: 3,
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
            strokeWidth: 3,
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
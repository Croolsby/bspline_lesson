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
  }

  View.prototype = {
    destruct: function () {
      this.path.remove();
      this.controlLines.remove();
      this.dot.remove();
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
        console.log('dirty bspline cleaned');
      }

      var v = model.calc(performance.now() / 1000);
      this.dot.attr({
        cx: v.x,
        cy: v.y,
      });
    },
  };

  return View;
});
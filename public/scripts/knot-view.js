// @author github.com/croolsby
define('knot-view', [], function () {
  function View(parent, paper) {
    if (parent == null) {
      console.error('A parent must be specified.');
    }
    if (paper == null) {
      console.error('A snap svg paper object must be specified.');
    }

    this.parent = parent;
    this.paper = paper;

    this.knotLineLength = 400;
    this.x0 = 200;
    this.y0 = 400;

    this.knotLine = null;
    this.knots = [];
    this.constructSVGElements();
  }

  View.prototype = {
    constructSVGElements: function () {
      // destruct first to ensure resources have been freed.
      this.destructSVGElements();

      this.knotLine = this.paper.line(0, 0, 1, 0);
      this.knotLine.attr({
        stroke: '#fff',
        strokeWidth: 4,
        strokeLinecap: 'round',
      });

      var knots = this.parent.model.knots;
      this.knots = new Array(knots.length);
      for (var i = 0; i < knots.length; i++) {
        this.knots[i] = this.paper.polyline([0, 0, 11, -18, -11, -18, 0, 0]);
        this.knots[i].attr({
          stroke: '#fff',
          strokeWidth: 4,
          strokeLinecap: 'round',
          fillOpacity: 0,
        });
      }
    },

    destructSVGElements: function () {
      if (this.knotLine != null) {
        this.knotLine.remove();
        this.knotLine = null;
      }

      // destruct knots
      for (var i = 0; i < this.knots.length; i++) {
        if (this.knots[i] != null) {
          this.knots[i].remove();
          this.knots[i] = null;
        }
      }
      this.knots = [];
    },

    update: function () {
      var model = this.parent.model;

      var knots = model.knots;

      // reconstruct if number of knots has changed.
      if (knots.length != this.knots.length) {
        this.constructSVGElements();
      }

      var x0 = this.x0;
      var y0 = this.y0;

      this.knotLine.attr({
        x1: x0,
        y1: y0,
        x2: x0 + this.knotLineLength,
        y2: y0,
      });

      // put the knot in the correct position
      // and style them correctly according to the state of the controller
      var controller = this.parent.knotController;
      for (var i = 0; i < this.knots.length; i++) {
        var knot = this.knots[i];
        knot.transform('T' + (knots[i] * this.knotLineLength + x0) + ',' + (y0 - 4));
        if (controller.selectedKnotIndex == i) {
          if (controller.hovering) {
            // hovering
            knot.attr({
              fill: '#aaa',
              fillOpacity: 1,
            });
          } else {
            // selected
            knot.attr({
              fill: '#e00',
              fillOpacity: 1,
            });
          }
        } else {
          // unselected and unhovered.
          knot.attr({
            fillOpacity: 0,
          });
        }
      }
    },
  };

  return View;
});
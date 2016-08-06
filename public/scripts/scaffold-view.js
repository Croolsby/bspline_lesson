// @author github.com/croolsby
define('scaffold-view', [], function () {
  // the scaffold view draws the lerped points on top of what the bspline-view draws.

  function View(parent, paper) {
    if (parent == null) {
      console.error('A parent must be specified.');
    }
    if (paper == null) {
      console.error('A snap svg paper object must be specified.');
    }

    this.parent = parent;
    this.paper = paper;

    // declare svg elements:
    this.dPoints = [];
    this.dLines = [];
    this.dPointLabels = [];

    this.constructSVGElements();
  }

  View.prototype = {
    constructSVGElements: function () {
      this.destructSVGElements(); // ensure resources are freed

      // create dPoints and dLabels.
      // dPoints need to be recreated if k changes.
      var kmin1 = this.parent.model.k - 1;
      var nDPoints = kmin1 * (kmin1 + 1) / 2;
      for (var i = 0; i < nDPoints; i++) {
        this.dPoints.push(this.paper.circle(0, 0, 8));
        this.dPoints[i].attr({
          fill: '#eee',
          fillOpacity: 0.5
        });

        this.dPointLabels.push(this.paper.text(100, 100, 'dnullnull'));
        this.dPointLabels[i].attr({
          fill: 'white',
        });
      }

      // create dLines.
      var kmin2 = kmin1 - 1;
      var nDLines = kmin2 * (kmin2 + 1) / 2;
      for (var i = 0; i < nDLines; i++) {
        this.dLines.push(this.paper.line(0, 0, 0, 0));
        this.dLines[i].attr({
          stroke: '#eee',
          strokeWidth: 4,
          strokeOpacity: 0.5,
        });
      }
    },

    destructSVGElements: function () {
      for (var i = 0; i < this.dPoints.length; i++) {
        if (this.dPoints[i] != null) {
          this.dPoints[i].remove();
          this.dPoints[i] = null;
        }
      }
      this.dPoints = [];

      for (var i = 0; i < this.dLines.length; i++) {
        if (this.dLines[i] != null) {
          this.dLines[i].remove();
          this.dLines[i] = null;
        }
      }
      this.dLines = [];

      for (var i = 0; i < this.dPointLabels.length; i++) {
        if (this.dPointLabels[i] != null) {
          this.dPointLabels[i].remove();
          this.dPointLabels[i] = null;
        }
      }
      this.dPointLabels = [];
    },

    update: function () {
      var model = this.parent.model;

      // update dPoints and dLabels
      var dCounter = 0;
      for (var j = 1; j <= model.k - 1; j++) {
        for (var i = (model.I - (model.k - 2)); i <= model.I - j + 1; i++) {
          this.dPoints[dCounter].attr({
            cx: model.d[j][i].x,
            cy: model.d[j][i].y,
          });

          this.dPointLabels[dCounter].attr({
            text: 'd' + j + '' + i,
            x: model.d[j][i].x,
            y: model.d[j][i].y - 10,
          });

          dCounter++;
        }
      }

      // update dLines
      dCounter = 0;
      for (var j = 1; j <= model.k - 2; j++) { // j is one less than the normal calc alg
        for (var i = (model.I - (model.k - 2)); i <= model.I - j; i++) { // i is one less than the normal calc alg
          this.dLines[dCounter].attr({
            x1: model.d[j][i].x,
            y1: model.d[j][i].y,
            x2: model.d[j][i + 1].x,
            y2: model.d[j][i + 1].y,
          });
          dCounter++;
        }
      }
    },
  };

  return View;
});
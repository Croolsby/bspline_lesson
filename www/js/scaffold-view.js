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

    this.constructSVGElements();
  }

  View.prototype = {
    constructSVGElements: function () {
      this.destructSVGElements(); // ensure resources are freed

      // create dPoints.
      // dPoints need to be recreated if k changes.
      var kmin1 = this.parent.model.k - 1;
      var nDPoints = kmin1 * (kmin1 + 1) / 2 - 1; // minues 1 here because we aren't going to draw the final point.
      for (var i = 0; i < nDPoints; i++) {
        this.dPoints.push(this.paper.circle(0, 0, 8));
        this.dPoints[i].attr({
          fill: '#eee'
        });
      }
      console.log(nDPoints);
    },

    destructSVGElements: function () {
      for (var i = 0; i < this.dPoints.length; i++) {
        this.dPoints[i].remove();
        this.dPoints[i] = null;
      }
      this.dPoints = [];
    },

    update: function () {
      var model = this.parent.model;

      var dCounter = 0;
      for (var j = 1; j <= (model.k - 1); j++) {
        for (var i = (model.I - (model.k - 2)); i <= model.I - j + 1; i++) {
          // console.log('tick');
          if (dCounter < this.dPoints.length) {
            this.dPoints[dCounter].attr({
              cx: model.d[j][i].x,
              cy: model.d[j][i].y,
            });
            dCounter++;
          }
        }
      }
    },
  };

  return View;
});
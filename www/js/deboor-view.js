// @author github.com/croolsby
define('deboor-view', ['bspline-model'], function (BSpline) {
  function View(parent, paper) {
    if (parent == null) {
      console.error('A parent must be specified.');
    }
    if (paper == null) {
      console.error('A snap svg paper object must be specified.');
    }

    this.parent = parent;
    this.paper = paper;

    // position of deboor view elements will be relative to knot view elements
    this.lineGap = 35;
    this.tLineYOffset = -this.lineGap * 2;
    this.uBarLineYOffset = -this.lineGap;
    this.vLineYOffset = this.tLineYOffset - this.lineGap/2;
    

    // declare svg elements:
    this.tLine = null;
    this.uBarLine = null;
    this.vLine = null;
    this.lerpLines = [];

    this.constructSVGElements();
  }

  View.prototype = {
    constructSVGElements: function () {
      // make sure resources have been freed before overwritting.
      this.destructSVGElements();

      // declare initial svg styles:
      // (no initial style for the lerpLines since we don't know how many there will be and they are all different)
      this.tLineStyle = {
        x1: this.parent.knotView.x0,
        y1: this.parent.knotView.y0 + this.tLineYOffset,
        x2: this.parent.knotView.x0 + this.parent.knotView.knotLineLength,
        y2: this.parent.knotView.y0 + this.tLineYOffset,
        stroke: '#eee',
        strokeWidth: 4,
        strokeLinecap: 'round',
      };
      this.uBarLineStyle = {
        x1: this.parent.knotView.x0,
        y1: this.parent.knotView.y0 + this.uBarLineYOffset,
        x2: this.parent.knotView.x0 + this.parent.knotView.knotLineLength,
        y2: this.parent.knotView.y0 + this.uBarLineYOffset,
        stroke: '#eee',
        strokeWidth: 4,
        strokeLinecap: 'round',
      };
      this.vLineStyle = {
        x1: this.parent.knotView.x0,
        y1: this.parent.knotView.y0 + this.vLineYOffset,
        x2: this.parent.knotView.x0,
        y2: this.parent.knotView.y0 + 100,
        stroke: '#e00',
        strokeWidth: 4,
        strokeLinecap: 'round',
      };

      this.tLine = this.paper.line(0, 0, 0, 0);
      this.tLine.attr(this.tLineStyle);


      this.uBarLine = this.paper.line(0, 0, 0, 0);
      this.uBarLine.attr(this.uBarLineStyle);

      this.vLine = this.paper.line(0, 0, 0, 0);
      this.vLine.attr(this.vLineStyle);

      // create the lerpLines
      var model = this.parent.model;
      var kmin1 = model.k - 1;
      var nLerpLines = kmin1 * (kmin1 + 1) / 2; // for example, if k = 4, then there are 3 + 2 + 1 lerp lines.
      for (var i = 0; i < nLerpLines; i++) {
        var line = this.paper.line(0, 0, 0, 0);
        line.attr({
          x1: 0, // this value will change in update
          y1: this.parent.knotView.y0 + (i + 1) * this.lineGap,
          x2: 100, // this value will change in update
          y2: this.parent.knotView.y0 + (i + 1) * this.lineGap,
          stroke: '#eee',
          strokeWidth: 4,
          strokeLinecap: 'round',
        });
        this.lerpLines.push(line);
      }
    },

    destructSVGElements: function () {
      if (this.tLine != null) {
        this.tLine.remove();
        this.tLine = null;
      }

      if (this.uBarLine != null) {
        this.uBarLine.remove();
        this.uBarLine = null;
      }

      if (this.vLine != null) {
        this.vLine.remove();
        this.vLine = null;
      }

      for (var i = 0; i < this.lerpLines.length; i++) {
        if (this.lerpLines[i] != null) {
          this.lerpLines[i].remove();
          this.lerpLines = null;
        }
      }
      this.lerpLines = [];
    },

    update: function () {
      var model = this.parent.model;
      var knotView = this.parent.knotView;

      var uBarBeginOffset = model.uBarBegin() * knotView.knotLineLength;
      var uBarEndOffset = model.uBarEnd() * knotView.knotLineLength;

      if (model.dirty) {
        // modify the t line
        this.tLineStyle.x1 = knotView.x0 + uBarBeginOffset;
        this.tLineStyle.x2 = knotView.x0 + uBarEndOffset;
        this.tLine.attr(this.tLineStyle);

        // modify the uBar line
        this.uBarLineStyle.x1 = knotView.x0 + uBarBeginOffset;
        this.uBarLineStyle.x2 = knotView.x0 + uBarEndOffset;
        this.uBarLine.attr(this.uBarLineStyle);
      }

      // update the vertical line
      var t = (performance.now() / 4000) % 1;
      if (t > 1) {
        // allow t = 1
        t = t % 1;
      }
      this.vLineStyle.x1 = knotView.x0 + uBarBeginOffset + t * model.uBarRange() * knotView.knotLineLength;
      this.vLineStyle.x2 = knotView.x0 + uBarBeginOffset + t * model.uBarRange() * knotView.knotLineLength;
      this.vLine.attr(this.vLineStyle);

      // update the lerpLines
      // which set of lerp lines to draw depends on I, which depends on t.
      var n = model.points.length;
      // transform t to u^bar
      var uBar = model.uBarBegin(); // lowest possible value is the initial value.
      try {
        uBar = BSpline.lerp(t, 0, 1, model.knots[model.k - 2], model.knots[n - 1]);
      } catch (err) {
        console.log(err.message);
      }
      var I = model.findIndex(uBar);
      // console.log(I);
      var lineCounter = 0;
      for (var j = 1; j <= (model.k - 1); j++) {
        for (var i = (I - (model.k - 2)); i <= I - j + 1; i++) {
          this.lerpLines[lineCounter].attr({
            x1: knotView.x0 + model.knots[i + j - 1] * knotView.knotLineLength,
            x2: knotView.x0 + model.knots[i + model.k - 1] * knotView.knotLineLength,
          });
          lineCounter++;
        }
      }

      // BSpline.lerp(uBar, 
      //       this.knots[i + j - 1], this.knots[i + this.k - 1],
      //       d[j - 1][i].x, d[j - 1][i + 1].x);
    },
  };

  return View;
});
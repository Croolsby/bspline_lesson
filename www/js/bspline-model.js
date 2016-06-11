// @author github.com/croolsby
define('bspline-model', ['vector'], function (Vector) {
  "use strict";

  function BSpline(parent) {
    if (parent == null) {
      console.error('A parent must be specified.');
    }
    this.parent = parent;

    // initialize state variables
    // this.position = new Vector(0, 0, 0);
    this.points = [];
    // this.d is the deboor point cascade (that triangular matrix thing).
    // im saving the generations once they are calculated so that the views and controllers can reference them without calling calc() again.
    // d[generation][point of that generation]
    this.d = [];
    this.t = 0;
    this.I = 0;
    // calcPoint contains the last valid (valid as in no error) return of calc().
    this.calcPoint = new Vector(0, 0);
    this.pathAsArray = [];
    this.knots = [];
    this.k = 3; // degree

    // dirty flag used by bspline-view.js to know when to update the svg representation of the path. 
    this.dirty = false;
  }

  /* BEGIN INSTANCE METHODS */

  BSpline.prototype = {
    appendPoint: function (x, y) {
      x = x || this.points[this.points.length - 1] || this.position.x;
      y = y || this.points[this.points.length - 1] || this.position.y;
      this.points.push(new Vector(x, y));
      this.makeKnotsLinSpaced();
      this.dirty = true;
      // console.log('appendPoint');
      // call calc to recompute this.d and this.calcPoint.
      this.pathAsArray = this.pathToArray();
      this.calc(0);
    },

    setPoint: function (i, x, y) {
      this.points[i].x = x;
      this.points[i].y = y;
      // console.log('setPoint called');
      this.pathAsArray = this.pathToArray();
      this.calc(this.t); // calc should be called after pathAsArray
    },

    // returns a Vector object
    calc: function (t) {
      // console.log('entry');
      //ensure 0 <= t <= 1
      if (t > 1) {
        // allow t = 1
        t = t % 1;
      }

      // ensure n >= k
      if (!(this.points.length >= this.k)) {
        // Debug.LogError("Ensure n >= k");
        console.log('Not enough points.');
        return new Vector(0, 0);
      }

      var n = this.points.length;

      // transform t to u^bar
      var uBar = 0;
      try {
        uBar = BSpline.lerp(t, 0, 1, this.knots[this.k - 2], this.knots[n - 1]);
      } catch (err) {
        console.log(err.message);
        return new Vector(0, 0);
      }

      // find index I such that u_I <= u^bar <= u_(I + 1)
      var I = this.findIndex(uBar);

      // d[generation][point of that generation]
      this.d = BSpline.create2DArray(this.k, n);

      // init first generation
      for (var i = 0; i < n; i++) {
        this.d[0][i] = this.points[i]; // points[i] type is Transform
      }
      
      for (var j = 1; j <= (this.k - 1); j++) {
        for (var i = (I - (this.k - 2)); i <= I - j + 1; i++) {
          // the i'th point of generation j
          var x = BSpline.lerp(uBar, this.knots[i + j - 1], this.knots[i + this.k - 1],
            this.d[j - 1][i].x, this.d[j - 1][i + 1].x);
          var y = BSpline.lerp(uBar, this.knots[i + j - 1], this.knots[i + this.k - 1],
            this.d[j - 1][i].y, this.d[j - 1][i + 1].y);
          this.d[j][i] = new Vector(x, y);

          // if (I != 1) {
          //   if (this.knots[i + j - 1] == this.knots[i + this.k - 1]) {
          //     console.log("overlap");

          //   }
          //   console.log('d[' + j + '][' + i + ']: ' + d[j][i].x + ', ' + d[j][i].y);
          //     console.log('BSpline.lerp('+uBar+','+ this.knots[i + j - 1]+','+ this.knots[i + this.k - 1]+','+ d[j - 1][i].x+','+ d[j - 1][i + 1].x+')');
          //     console.log('BSpline.lerp('+uBar+','+ this.knots[i + j - 1]+','+ this.knots[i + this.k - 1]+','+ d[j - 1][i].y+','+ d[j - 1][i + 1].y+')');
          //     console.log(x);
          //     console.log(y);
        }
      }
      
      // save the return value and the corresponding t.
      this.I = I;
      this.t = t;
      this.calcPoint = this.d[this.k - 1][I - (this.k - 2)] 
      return this.calcPoint;
    },

    findIndex: function (u) {
      var i = 0;
      while (u > this.knots[i]) {
        i++;
      }
      i--;
      
      // we know the bounds on Index
      if (i < this.k - 2) {
        i = this.k - 2;
      }
      if (i > this.points.length - 2) {
        i = this.points.length - 2;
      }

      return i;
    },

    makeKnotsLinSpaced: function () {
      var n = this.points.length;
      var nKnots = n + this.k - 2;
      this.knots = new Array(nKnots);
      for (var i = 0; i < nKnots; i++) {
        this.knots[i] = (1.0 * i / (n + this.k - 3));
      }
    },

    setKnot: function (index, value) {
      // knots are bounded by [0, 1]
      // knots may not crossover.

      // prevent knot from going out of bounds
      // there is a hard bound at [0, 1],
      if (value < 0) {
        value = 0;
      }
      if (value > 1) {
        value = 1;
      }
      // there may be a smaller bound caused by neighboring knots: [knot[i-1], knot[i+1]]
      if (value < this.knots[index - 1]) {
        value = this.knots[index - 1];
      }
      if (value > this.knots[index + 1]) {
        value = this.knots[index + 1];
      }

      this.knots[index] = value;

      this.dirty = true;
      this.pathAsArray = this.pathToArray();
      this.calc(this.t);
    },

    // returns the path as a flattened/inline array of points.
    pathToArray: function (nDrawPoints) {
      // save these values because we will call calc and they will be overwritten but we don't want them to.
      var saveT = this.t;
      var saveI = this.I;
      var saveCalcPoint = this.calcPoint;

      nDrawPoints = nDrawPoints || 32 * (this.points.length - 2); // nDrawPoint default to 32
      var linePoints = [];
      for (var i = 0; i < nDrawPoints; i++) {
        var t = i / (nDrawPoints - 1);
        var v = this.calc(t);
        linePoints.push(v.x);
        linePoints.push(v.y);
      }
      // console.log('pathToArray called');
      this.t = saveT;
      this.I = saveI;
      this.calcPoint = saveCalcPoint;

      return linePoints;
    },

    pointsToArray: function () {
      var result = [];
      for (var i = 0; i < this.points.length; i++) {
        result.push(this.points[i].x);
        result.push(this.points[i].y);
      }
      return result;
    },

    uBarBegin: function () {
      return this.knots[this.k - 2];
    },

    uBarEnd: function () {
      return this.knots[this.points.length - 1];
    },

    uBarRange: function () {
      return this.uBarEnd() - this.uBarBegin();
    },
  }; // close BSpline.prototype = { ... };

  /* END INSTANCE METHODS */
  /* BEGIN STATIC FUNCTIONS */

  BSpline.create2DArray = function (rows, cols) {
    var x = new Array(rows);
    for (var i = 0; i < rows; i++) {
      x[i] = new Array(cols);
    }
    return x;
  };

  BSpline.lerp = function (t, inLeft, inRight, outLeft, outRight) {
    // console.log('lerp(' + t + ', ' + inLeft + ', ' + inRight + ', ' + outLeft + ', ' + outRight);
    var diff = inRight - inLeft;
    if (diff == 0) {
      // if the inLeft and inRight are the same value,
      // then pretend t is at inRight.
      // thus the result is at outRight.
      return outRight;
    }
    return (inRight - t) / diff * outLeft + (t - inLeft) / diff * outRight;
  };

  /* END STATIC FUNCTIONS */

  console.log("bspline.js loaded.");
  return BSpline;
});

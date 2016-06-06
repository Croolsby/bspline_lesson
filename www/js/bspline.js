// @author github.com/croolsby
define('bspline', ['vector'], function (Vector) {
  "use strict";

  function BSpline() {
    // initialize state variables
    this.position = new Vector(0, 0, 0);
    this.points = []; // array of Vector
    this.knots = [];
    this.k = 3; // degree
  }

  /* BEGIN INSTANCE METHODS */

  BSpline.prototype = {
    appendPoint: function (x, y) {
      x = x || this.points[this.points.length - 1] || this.position.x;
      y = y || this.points[this.points.length - 1] || this.position.y;
      this.points.push(new Vector(x, y));
      this.makeKnotsLinSpaced();
    },

    // @return {Vector}
    calc: function (t) {
      //ensure 0 <= t <= 1
      if (t > 1) {
        // allow t = 1
        t = t % 1;
      }

      // ensure n >= k
      if (!(this.points.length >= this.k)) {
        // Debug.LogError("Ensure n >= k");
        return this.position;
      }

      var n = this.points.length;

      // transform t to u^bar
      var uBar = 0;
      try {
        uBar = BSpline.lerp(t, 0, 1, this.knots[this.k - 2], this.knots[n - 1]);
      } catch (err) {
        console.log(err.message);
        return this.position;
      }

      // find index I such that u_I <= u^bar <= u_(I + 1)
      var I = this.findIndex(uBar);

      // d[generation][point of that generation] : Vector[][]
      var d = BSpline.create2DArray(this.k, n); // shouldn't this be k -1 not k? and n - 1?

      // init first generation
      for (var i = 0; i < n; i++) {
        d[0][i] = this.points[i]; // points[i] type is Transform
      }

      //print("I: " + I);
      //print("uBar: " + uBar);

      for (var j = 1; j <= (this.k - 1); j++) {
        for (var i = (I - (this.k - 2)); i <= I - j + 1; i++) {
          // the i'th point of generation j
          var x = BSpline.lerp(uBar, this.knots[i + j - 1], this.knots[i + this.k - 1],
            d[j - 1][i].x, d[j - 1][i + 1].x);
          var y = BSpline.lerp(uBar, this.knots[i + j - 1], this.knots[i + this.k - 1],
            d[j - 1][i].y, d[j - 1][i + 1].y);
          d[j][i] = new Vector(x, y);
        }
      }

      return d[this.k - 1][I - (this.k - 2)];
    },

    findIndex: function (u) {
      var i = 0;
      while (u > this.knots[i]) {
        i++;
      }

      // The following is so that u is in [u_I, u_I+1)
      if (u == this.knots[this.k - 2]) {
        return i;
      } else {
        return i - 1;
      }
    },

    makeKnotsLinSpaced: function () {
      var n = this.points.length;
      var nKnots = n + this.k - 2;
      this.knots = new Array(nKnots);
      for (var i = 0; i < nKnots; i++) {
        this.knots[i] = (1.0 * i / (n + this.k - 3));
      }
    },

    // returns the path as a flattened/inline array of points.
    pathToArray: function (nDrawPoints) {
      nDrawPoints = nDrawPoints || 32; // nDrawPoint default to 32
      var linePoints = [];
      for (var i = 0; i < nDrawPoints; i++) {
        var t = i / (nDrawPoints - 1);
        var v = this.calc(t);
        linePoints.push(v.x);
        linePoints.push(v.y);
      }
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
    var diff = inRight - inLeft;
    return (inRight - t) / diff * outLeft + (t - inLeft) / diff * outRight;
  };

  /* END STATIC FUNCTIONS */

  console.log("bspline.js loaded.");
  return BSpline;
});

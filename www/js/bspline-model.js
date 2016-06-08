// @author github.com/croolsby
define('bspline-model', ['vector'], function (Vector) {
  "use strict";

  function BSpline(parent) {
    if (parent == null) {
      console.error('A parent must be specified.');
    }
    this.parent = parent;

    // initialize state variables
    this.position = new Vector(0, 0, 0);
    this.points = []; // array of Vector
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
    },

    // returns a Vector object
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
      if (I < this.k - 2) {
        I = this.k - 2;
      }

      // d[generation][point of that generation] : Vector[][]
      var d = BSpline.create2DArray(this.k, n - 1); // shouldn't this be k -1 not k? and n - 1?

      // init first generation
      for (var i = 0; i < n; i++) {
        d[0][i] = this.points[i]; // points[i] type is Transform

        // if (t == 0) {
        //   console.log('d[' + 0 + '][' + i + ']: ' + d[0][i].x + ', ' + d[0][i].y);
        // }
      }

      //print("I: " + I);
      //print("uBar: " + uBar);
      // console.log('I: ' + I);
      for (var j = 1; j <= (this.k - 1); j++) {
        for (var i = (I - (this.k - 2)); i <= I - j + 1; i++) {

          // console.log('j, i: ' + j + ',' + i);
          // the i'th point of generation j
          var x = BSpline.lerp(uBar, this.knots[i + j - 1], this.knots[i + this.k - 1],
            d[j - 1][i].x, d[j - 1][i + 1].x);
          var y = BSpline.lerp(uBar, this.knots[i + j - 1], this.knots[i + this.k - 1],
            d[j - 1][i].y, d[j - 1][i + 1].y);
          d[j][i] = new Vector(x, y);

          // if (t == 0) {
          //   console.log('d[' + j + '][' + i + ']: ' + d[j][i].x + ', ' + d[j][i].y);

          //   if (j == 2) {
          //     console.log('uBar: ' + uBar);
          //     console.log('BSpline.lerp('+uBar+','+ this.knots[i + j - 1]+','+ this.knots[i + this.k - 1]+','+ d[j - 1][i].x+','+ d[j - 1][i + 1].x+')');
          //     console.log('BSpline.lerp('+uBar+','+ this.knots[i + j - 1]+','+ this.knots[i + this.k - 1]+','+ d[j - 1][i].y+','+ d[j - 1][i + 1].y+')');
          //     console.log(x);
          //     console.log(y);
          //   }
          // }
        }
      }

      return d[this.k - 1][I - (this.k - 2)];
    },

    findIndex: function (u) {
      var i = 0;
      while (u > this.knots[i]) {
        i++;
      }
      i--;
      // at this point in execution, u > knots[i] 

      // if multiple knots are overlapping, accept the first of these overlapping knots.
      // while (i != 0 && (this.knots[i - 1] == this.knots[i])) {
      //   // true if the previous knot is overlapping this knot.
      //   i--;
      // }

      return i;

      // The following is so that u is in [u_I, u_I+1)
      // if (u == this.knots[this.k - 2]) {
      //   return i;
      // } else {
      //   return i - 1;
      // }
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

      // console.log(this.knots);
    },

    // returns the path as a flattened/inline array of points.
    pathToArray: function (nDrawPoints) {
      nDrawPoints = nDrawPoints || 32 * (this.points.length - 2); // nDrawPoint default to 32
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
    if (diff == 0) {
      // if the inLeft and inRight are the same value,
      // then pretend t is half way between inLeft and inRight.
      // thus the result is halfway between outLeft and outRight.
      return (outLeft + outRight) / 2;
    }
    return (inRight - t) / diff * outLeft + (t - inLeft) / diff * outRight;
  };

  /* END STATIC FUNCTIONS */

  console.log("bspline.js loaded.");
  return BSpline;
});

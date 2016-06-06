// @author github.com/croolsby
define('bspline', ["transform", "vector"], function (Transform, Vector) {
  "use strict";

  function BSpline() {
    // initialize state variables
    this.transform = new Transform();
    this.points = []; // array of Transform
    this.k = 3; // degree
  }

  /* BEGIN INSTANCE METHODS */

  BSpline.prototype = {
    calc: function (t) {
      //ensure 0 <= t <= 1
      if (t > 1) {
        // allow t = 1
        t = t % 1;
      }

      // ensure n >= k
      if (!(this.points.Length >= k)) {
        // Debug.LogError("Ensure n >= k");
        return this.transform.position;
      }

      var n = points.length;

      // transform t to u^bar
      var uBar = 0;
      try {
        uBar = lerp(t, 0, 1, knots[k - 2], knots[n - 1]);
      } catch (err) {
        console.log(err.message);
        return this.transform.position;
      }

      // find index I such that u_I <= u^bar <= u_(I + 1)
      var I = findIndex(uBar);

      // d[generation][point of that generation]
      var d = create2DArray(k, n); // shouldn't this be k -1 not k? and n - 1?

      // init first generation
      for (var i = 0; i < n; i++) {
        d[0][i] = points[i].position; // points[i] type is Transform
      }

      //print("I: " + I);
      //print("uBar: " + uBar);

      for (var j = 1; j <= (k - 1); j++) {
        for (var i = (I - (k - 2)); i <= I - j + 1; i++) {
          // the i'th point of generation j
          var x = BSpline.lerp(uBar, knots[i + j - 1], knots[i + k - 1],
            d[j - 1][i].x, d[j - 1][i + 1].x);
          var y = BSpline.lerp(uBar, knots[i + j - 1], knots[i + k - 1],
            d[j - 1][i].y, d[j - 1][i + 1].y);
          var z = BSpline.lerp(uBar, knots[i + j - 1], knots[i + k - 1],
            d[j - 1][i].z, d[j - 1][i + 1].z);
          d[j][i] = new Vector(x, y, z);
        }
      }

      return d[k - 1][I - (k - 2)];
    },

    findIndex: function (u) {
      var i = 0;
      while (u > knots[i]) {
        i++;
      }

      // The following is so that u is in [u_I, u_I+1)
      if (u == knots[k - 2]) {
        return i;
      } else {
        return i - 1;
      }
    },
    
    makeKnotsLinSpaced: function() {
      var n = point.length;
      var nKnots = n + this.k - 2;
      this.knots = new Array(nKnots);
      for (var i = 0; i < nKnots; i++) {
        this.knots[i] = (1.0 * i / (n + this.k - 3)); 
      }
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
    return (inRight - t) / diff * outLeft + (t - inLeft) / dif * outRight;
  };

  /* END STATIC FUNCTIONS */

  console.log("bspline.js loaded.");
  return BSpline;
});

// @author github.com/croolsby
define('quaternion', function () {
  function Quaternion(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;
  }
  
  /* BEGIN INSTANCE METHODS */

  Quaternion.prototype = {
    set: function (x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    },

    toString: function () {
      return this.x + ', ' + this.y + ', ' + this.z + ', ' + w;
    },

    toArray: function () {
      return [this.x, this.y, this.z, this.w];
    },
    
  }
  
  /* END INSTANCE METHODS */
  /* BEGIN STATIC FUNCTIONS */
  
  // @param {Quaternion} a
  // @param {Quaternion} b
  Quaternion.angle = function(a, b) {
    return 0;
  }
  
  /* END STATIC FUNCTIONS */

  console.log("quaternion.js loaded.");
  return Quaternion;
});
// @author github.com/croolsby
// Similiar to how in Unity custom scripts are extended from MonoBehavior, here customs scripts are extended from Behavior.
define('behavior', [], function() {
  function Behavior() {
    this.transform = null;
    this.gameobject = null;
  }
  
  Behavior.prototype = {
    awake: function() {
      return undefined;
    },
    
    update: function() {
      return undefined;
    },
  };
  
  console.log("behavior.js loaded.");
  return Component;
});
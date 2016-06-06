// @author github.com/croolsby
define('gameobject', ['transform'], function(Transform) {
  function GameObject() {
    this.transform = new Transform();
    this.components = [];
  }
  
  console.log("gameobject.js loaded.");
  return GameObject;
});
// @author github.com/croolsby
define('transform', ["vector", "quaternion"], function(Vector, Quaternion) {
    function Transform() {
        this.position = new Vector(0, 0, 0);
        this.rotation = new Quaternion(0, 0, 0, 0);
        
        // the position and rotation are relative to the parent.
        this.parent = null; // points to another Transform
    }
    
    console.log("transform.js loaded.");
    return Transform;
});
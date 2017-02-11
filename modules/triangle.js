

var Triangle = function(size, color) {
  this.size_ = size;
  
  this.color_ = color;
  
  this.mesh = null;
  
  var ratio = 1.7;
  this.height_ = size * ratio;
  
  this.lineWidth_ = size / 100;
  
  var material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color)
  });
  
  this.mesh = new THREE.Object3D();
  
  var geometry = new THREE.BoxGeometry(size, this.lineWidth_, this.lineWidth_, 1, 1);
  
  this.createOuterTriangle_(geometry, material);
  this.createDepth_(geometry, material);
  
};


Triangle.prototype.createDepth_ = function(geometry, material) {
  var lineContainer = new THREE.Object3D();
  
  var line = new THREE.Mesh(geometry, material);
  line.position.x = -this.size_ / 2;
  lineContainer.position.x = -this.size_ / 2;
  lineContainer.rotation.y = -120.3 * Math.PI / 180;
  lineContainer.rotation.x = -376.4 * Math.PI / 180;
  lineContainer.add(line);
  this.mesh.add(lineContainer);
  
  lineContainer = new THREE.Object3D();
  line = new THREE.Mesh(geometry, material);
  line.position.x = this.size_ / 2;
  lineContainer.position.x = this.size_ / 2;
  lineContainer.rotation.y = 120.3 * Math.PI / 180;
  lineContainer.rotation.x = -376.4 * Math.PI / 180;
  lineContainer.add(line);
  this.mesh.add(lineContainer);
  
   var pos = Math.sin(120 * Math.PI / 180) * this.size_;
  
  lineContainer = new THREE.Object3D();
  line = new THREE.Mesh(geometry, material);
  line.position.x = this.size_ / 2;
  lineContainer.position.y = -pos
  lineContainer.rotation.y = -269.86 * Math.PI / 180;
  lineContainer.rotation.x = -322.57 * Math.PI / 180;
  lineContainer.add(line);
  this.mesh.add(lineContainer);
};


Triangle.prototype.createOuterTriangle_ = function(geometry, material) {
  var line = new THREE.Mesh(geometry, material);
  //line.rotation.z = 30 * Math.PI / 180;
  this.mesh.add(line);
  
  var lineContainer = new THREE.Object3D();
  
  line = new THREE.Mesh(geometry, material);
  line.position.x = -this.size_ / 2;
  lineContainer.rotation.z = 120 * Math.PI / 180;
  lineContainer.position.x = -this.size_ / 2;
  lineContainer.add(line);
  this.mesh.add(lineContainer);
  
  lineContainer = new THREE.Object3D();
  
  line = new THREE.Mesh(geometry, material);
  line.position.x = -this.size_ / 2;
  line.position.y = -this.lineWidth_ / 2;
  lineContainer.rotation.z = 240 * Math.PI / 180;
  
  var pos = Math.sin(120 * Math.PI / 180) * this.size_;
  
  lineContainer.position.y = -pos;
  lineContainer.add(line);
  this.mesh.add(lineContainer);
};


module.exports = Triangle;

var Arrow = function() {
  this.mesh = null;
};

Arrow.prototype.create = function(size, color) {
  
  this.mesh = new THREE.Object3D();
  
  this.thirdOfWidth_ = size / 3;
  var lineWidth = size * 0.006;
  
  var geometry = new THREE.CubeGeometry(this.thirdOfWidth_ * 2, lineWidth, lineWidth);
  // var material = new THREE.MeshBasicMaterial({
  //   color: new THREE.Color(color)
  // });
  
  var material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    blending: THREE.AdditiveBlending
  });
  
  // Middle line
  
  var line = new THREE.Mesh(geometry, material);
  line.position.x = -this.thirdOfWidth_;
  
  this.mesh.add(line);
  
  // Top Diagonal line
  var lineLength = Math.sqrt((size * size) + ((size / 2) * (size / 2)));
  geometry = new THREE.CubeGeometry(lineLength, lineWidth, lineWidth);
  
  var lineContainer = this.createDiagonalLine_(geometry, material, lineLength, 30 * Math.PI / 180);
  lineContainer.position.x = -this.thirdOfWidth_ * 2;
  lineContainer.rotation.x = -30 * Math.PI / 180;
  this.mesh.add(lineContainer);
  
  // Bottom Diagonal line.
  lineContainer = this.createDiagonalLine_(geometry, material, lineLength, -30 * Math.PI / 180);
  lineContainer.position.x = -this.thirdOfWidth_ * 2;
  lineContainer.rotation.x = 30 * Math.PI / 180;
  this.mesh.add(lineContainer);

  var halfHeight = Math.sin(30 * Math.PI / 180) * lineLength;

  // Arrow ends

  // lineLength = (this.thirdOfWidth_ * 2) - .8;
  lineLength = Math.sqrt((halfHeight * halfHeight) + (this.thirdOfWidth_ * this.thirdOfWidth_)) - .2;
  geometry = new THREE.CubeGeometry(lineLength, lineWidth, lineWidth);

  var angle = Math.acos(this.thirdOfWidth_ / lineLength) + 0.045;
  lineContainer = this.createDiagonalLine_(geometry, material, lineLength, angle);
  lineContainer.rotation.x = -30 * Math.PI / 180;
  this.mesh.add(lineContainer);

  lineContainer = this.createDiagonalLine_(geometry, material, lineLength, -angle);
  lineContainer.rotation.x = 30 * Math.PI / 180;
  this.mesh.add(lineContainer);
  
  return this.mesh;
};


Arrow.prototype.createDiagonalLine_ = function(geometry, material, lineLength, radians) {
  var lineContainer = new THREE.Object3D();
  var line;
  
  line = new THREE.Mesh(geometry, material);
  line.position.x = lineLength / 2;
  
  lineContainer.rotation.z = radians;
  //lineContainer.rotation.x = 30 * Math.PI / 180;
  
  lineContainer.add(line);
  
  return lineContainer;
};


module.exports = Arrow;

var Rectangle = function(size, color, hideSide) {
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
  
  this.createTopAndBottomLines_(material);
  this.createSideLines_(material, hideSide);
  this.createDiagonalLines_(material);
  
};


Rectangle.prototype.createDiagonalLines_ = function(material) {
  //var lineWidth = Math.sqrt((this.size_ * this.size_) + (this.height_ * this.height_));
  var lineLength = Math.sqrt((this.size_ * this.size_) + (this.size_ * this.size_));
  lineLength = Math.sqrt((lineLength * lineLength) + (this.height_ * this.height_));
  //lineLength += 1.2;
  var geometry = new THREE.BoxGeometry(lineLength, this.lineWidth_, this.lineWidth_);
  
  var line = new THREE.Mesh(geometry, material);
  
  line.rotation.z = -50 * Math.PI / 180;
  line.rotation.y = 45 * Math.PI / 180;
  
  this.mesh.add(line);
  
  line = new THREE.Mesh(geometry, material);
  
  line.rotation.z = 50 * Math.PI / 180;
  line.rotation.y = -45 * Math.PI / 180;
  
  this.mesh.add(line);
  
  line = new THREE.Mesh(geometry, material);
  
  line.rotation.z = -50 * Math.PI / 180;
  line.rotation.y = -45 * Math.PI / 180;
  
  this.mesh.add(line);
  
  line = new THREE.Mesh(geometry, material);
  
  line.rotation.z = 50 * Math.PI / 180;
  line.rotation.y = 45 * Math.PI / 180;
  
  this.mesh.add(line);
};


Rectangle.prototype.createTopAndBottomLines_ = function(material) {
  var geometry = new THREE.BoxGeometry(this.size_, this.lineWidth_, this.lineWidth_);
  var line = new THREE.Mesh(geometry, material);
  line.position.y = this.height_ / 2;
  line.position.z = this.size_ / 2;
  this.mesh.add(line);
  
  line = new THREE.Mesh(geometry, material);
  line.position.y = -this.height_ / 2;
  line.position.z = this.size_ / 2;
  this.mesh.add(line);
  
  line = new THREE.Mesh(geometry, material);
  line.position.y = this.height_ / 2;
  line.position.z = -this.size_ / 2;
  this.mesh.add(line);
  
  line = new THREE.Mesh(geometry, material);
  line.position.y = -this.height_ / 2;
  line.position.z = -this.size_ / 2;
  this.mesh.add(line);
};


Rectangle.prototype.createSideLines_ = function(material, hideSide) {
  var geometry = new THREE.BoxGeometry(this.lineWidth_, this.height_, this.lineWidth_);
  
  if (hideSide !== 'left') {
    var line = new THREE.Mesh(geometry, material);
    line.position.x = this.size_ / 2;
    line.position.z = this.size_ / 2;
    this.mesh.add(line);
    
    line = new THREE.Mesh(geometry, material);
    line.position.x = this.size_ / 2;
    line.position.z = -this.size_ / 2;
    this.mesh.add(line);
  }
  
  if (hideSide !== 'right') {
    line = new THREE.Mesh(geometry, material);
    line.position.x = -this.size_ / 2;
    line.position.z = -this.size_ / 2;
    this.mesh.add(line);
    
    line = new THREE.Mesh(geometry, material);
    line.position.x = -this.size_ / 2;
    line.position.z = this.size_ / 2;
    this.mesh.add(line);
  }
};






module.exports = Rectangle;

var Arrow = require('./modules/arrow');
var Rectangle = require('./modules/rectangle');
var Triangle = require('./modules/triangle');
var Dust = require('./modules/dust');

var Vessels = function() {
  this.renderer_ = null;
  
  this.camera_ = null;
  
  this.scene_ = null;
  
  this.composer_ = null;
  
  this.controls_ = null;
  
  this.dust_ = null;
  
  this.stats_ = null;
  
  this.lights_ = [];
  
  this.angle_ = 0;
  
  this.mouseTouchBinding_ = this.mouseTouchListener_.bind(this);
  
  this.userIsMoving_ = false;
  
  this.startAnimatingTimer_ = -1;
  
  this.cameraAnimationInterval_ = -1;
  
  this.rotationCounter_ = 0;
};

Vessels.prototype.init = function () {
  this.scene_ = new THREE.Scene();
  
  this.camera_ = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
  // this.camera_ = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
  this.camera_.position.z = -30;
  this.camera_.lookAt(new THREE.Vector3(0, 0, 0));
  this.scene_.add(this.camera_);
  
  this.renderer_ = new THREE.WebGLRenderer({
    antialias: false
  });
  this.renderer_.setClearColor(0x160a36);
  
  this.renderer_.setSize(window.innerWidth, window.innerHeight);
  this.renderer_.setPixelRatio(window.devicePixelRatio);
  
  this.dust_ = new Dust(this.renderer_, this.camera_);
  this.scene_.add(this.dust_.mesh);
  
  this.controls_ = new THREE.OrbitControls(this.camera_, this.renderer_.domElement);
  
  
  var light = new THREE.AmbientLight(0xffffff, 0.4);
  this.scene_.add(light);
  
  // var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  // directionalLight.position.set( 1, 1, 0 );
  // this.scene_.add( directionalLight );
  
  var pLight = new THREE.PointLight(0xffffff, 1, 100);
  this.scene_.add(pLight);
  this.lights_.push(pLight);
  
  var sphereSize = 1;
  // var pointLightHelper = new THREE.PointLightHelper(pLight, sphereSize );
  // this.scene_.add( pointLightHelper );
  
  pLight = new THREE.PointLight(0xffffff, 1, 100);
  this.scene_.add(pLight);
  this.lights_.push(pLight);
  
  // pointLightHelper = new THREE.PointLightHelper( pLight, sphereSize );
  // this.scene_.add( pointLightHelper );
  //
  document.body.appendChild(this.renderer_.domElement);
  
  this.createStar_();

  var rect = this.createMultiRectangle_(5, 4, '#cf088a');
  rect.position.x = -7.5;
  
  rect = this.createMultiRectangle_(4.2, 4, '#03a38f');
  rect.position.y = -6.3;
  rect.rotation.z = 1.57;
  rect.scale.y = 1.1;

  rect = this.createMultiRectangle_(1.65, 4, '#cf088a');
  rect.position.x = -7.5;

  rect = this.createMultiRectangle_(1.65, 4, '#cf088a');
  rect.position.x = 2.5;

  rect = this.createMultiRectangle_(1.65, 4, '#03a38f');
  rect.position.y = 2.3;
  rect.rotation.z = 90 * Math.PI / 180;

  rect = this.createMultiRectangle_(1.65, 4, '#03a38f');
  rect.position.y = -7.3;
  rect.rotation.z = 90 * Math.PI / 180;
  
  var triangle = this.createTriangle_(3, '#03a38f');
  triangle.rotation.set(0, 0, 34.3 * Math.PI / 180);
  triangle.position.set(7.9, -0.7, 0);
  
  
  triangle = this.createTriangle_(3, '#03a38f');
  triangle.rotation.set(0, 0, 27.5 * Math.PI / 180);
  triangle.position.set(7.9, 2.14, 0);
  
  triangle = this.createTriangle_(3, '#03a38f');
  triangle.rotation.set(0, 0, 94.5 * Math.PI / 180);
  triangle.position.set(-9.3, 1.4, 0);
  
  triangle = this.createTriangle_(3, '#03a38f');
  triangle.rotation.set(0, 0, 88.8 * Math.PI / 180);
  triangle.position.set(-9.3, -1.5, 0);
  
  
  triangle = this.createTriangle_(3, '#cf088a');
  triangle.rotation.set(0, 0, 114.5 * Math.PI / 180);
  triangle.position.set(-2.2, 8, 0);
  
  triangle = this.createTriangle_(3, '#cf088a');
  triangle.rotation.set(0, 0, 120.3 * Math.PI / 180);
  triangle.position.set(0.6, 7.8, 0);
  
  triangle = this.createTriangle_(3, '#cf088a');
  triangle.rotation.set(0, 0, 57.2 * Math.PI / 180);
  triangle.position.set(0.6, -7.8, 0);
  
  triangle = this.createTriangle_(3, '#cf088a');
  triangle.rotation.set(0, 0, 63.0 * Math.PI / 180);
  triangle.position.set(-2.2, -7.9, 0);
  
  this.stats_ = new Stats();
  this.stats_.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( this.stats_.dom );
  
  document.body.addEventListener('mousedown', this.mouseTouchBinding_, false);
  document.body.addEventListener('touchstart', this.mouseTouchBinding_, false);
  
  this.initVignetteShader_();
  
  this.startAnimatingTimer_ = setTimeout(this.startAnimating_.bind(this), 5000);
  
  this.render_();
};


Vessels.prototype.mouseTouchListener_ = function(e) {
  switch(e.type) {
    case 'mousedown':
      document.body.addEventListener('mouseup', this.mouseTouchBinding_, false);
        
      clearTimeout(this.startAnimatingTimer_);
      this.userIsMoving_ = true;
    break;
    case 'mouseup':
      document.body.removeEventListener('mouseup', this.mouseTouchBinding_, false);
        
      this.startAnimatingTimer_ = setTimeout(this.startAnimating_.bind(this), 5000);
    break;
    case 'touchstart':
      document.body.addEventListener('touchend', this.mouseTouchBinding_, false);
        
      clearTimeout(this.startAnimatingTimer_);
      this.userIsMoving_ = true;
    break;
    case 'touchend':
      document.body.removeEventListener('touchend', this.mouseTouchBinding_, false);
        
      this.startAnimatingTimer_ = setTimeout(this.startAnimating_.bind(this), 5000);
    break;
  }
};


Vessels.prototype.startAnimating_ = function() {
  this.userIsMoving_ = false;
  this.cameraAnimationInterval_ = setInterval(this.animateCameraToRandomPosition_.bind(this), 2000);
};


Vessels.prototype.animateCameraToRandomPosition_ = function() {
  
  if (this.userIsMoving_) {
    clearInterval(this.cameraAnimationInterval_);
    return;
  }
  
  var radius = 30;
  var x = 0;
  var y = 0;
  var z = -radius;
  
  if (this.rotationCounter_ ++ % 10 !== 0) {
    var theta = - (Math.random() * 360 - 180);
    var phi = Math.random() * 360 - 180;
  
    phi = Math.min( 180, Math.max( 0, phi ) );
  
    x = radius * Math.sin( theta * Math.PI / 360 )
                        * Math.cos( phi * Math.PI / 360 );
    y = radius * Math.sin( phi * Math.PI / 360 );
    z = radius * Math.cos( theta * Math.PI / 360 )
                        * Math.cos( phi * Math.PI / 360 );
  }
  
  TweenLite.to(this.camera_.position, .5, {
    x: x,
    y: y,
    z: z,
    ease: Power2.easeOut,
    onUpdate: function() {
      this.camera_.lookAt(this.scene_.position);
      this.camera_.updateMatrix();
    }.bind(this)
  });

};


Vessels.prototype.createTriangle_ = function(size, color) {
  
  var fullTriangle = new THREE.Object3D();
  
  var triangle = new Triangle(size, color);
  
  fullTriangle.add(triangle.mesh);
  
  triangle = new Triangle(size, color);
  triangle.mesh.rotation.x = 286.47 * Math.PI / 180;
  
  fullTriangle.add(triangle.mesh);
  
  this.scene_.add(fullTriangle);
  
  return fullTriangle;
};


Vessels.prototype.createStar_ = function() {
  
  var frontArrows = this.createHalf_();
  this.scene_.add(frontArrows);
  
  var backArrows = this.createHalf_();
  backArrows.rotation.y = 180 * Math.PI / 180;
  this.scene_.add(backArrows);
};


Vessels.prototype.createMultiRectangle_ = function(size, num, color) {
  this.createRectangle_(size);
  
  var multiRect = new THREE.Object3D();
  var hideSide = '';
  
  for (var i = 0; i < num; i++) {
    hideSide = '';
    if (i === 0) {
      hideSide = 'right'
    } else if (i === num - 1) {
      hideSide = 'left';
    }
    var rect = new Rectangle(size, color, hideSide);
    rect.mesh.position.x = size * i;
    multiRect.add(rect.mesh);
  }
  
  this.scene_.add(multiRect);
  
  return multiRect;
};


Vessels.prototype.createRectangle_ = function(size, position) {
  
};


Vessels.prototype.createHalf_ = function() {
  var arrows = new THREE.Object3D();
  
  var arrow = new Arrow();
  arrow.create(25,'#03a38f');
  arrow.mesh.position.x = 4;
  arrows.add(arrow.mesh);

  arrow = new Arrow();
  arrow.create(25,'#03a38f');
  arrow.mesh.rotation.y = 180 * Math.PI / 180;
  arrow.mesh.rotation.x = 180 * Math.PI / 180;
  arrow.mesh.position.x = -4;
  arrows.add(arrow.mesh);


  arrow = new Arrow();
  arrow.create(25, '#cf088a');
  arrow.mesh.rotation.z = 90 * Math.PI / 180;
  arrow.mesh.position.y = 4;
  arrows.add(arrow.mesh);

  arrow = new Arrow();
  arrow.create(25, '#cf088a');
  arrow.mesh.rotation.z = 270 * Math.PI / 180;
  //arrow.mesh.rotation.x = 180 * Math.PI / 180;
  arrow.mesh.position.y = -4;
  arrows.add(arrow.mesh);
  
  
  
  arrow = new Arrow();
  arrow.create(8, '#03a38f');
  arrow.mesh.position.x = -9;
  arrow.mesh.rotation.z = 180 * Math.PI / 180;
  arrows.add(arrow.mesh);
  
  arrow = new Arrow();
  arrow.create(8, '#03a38f');
  arrow.mesh.position.x = 9;
  //arrow.mesh.rotation.z = 180 * Math.PI / 180;
  arrows.add(arrow.mesh);
  
  arrow = new Arrow();
  arrow.create(8, '#cf088a');
  arrow.mesh.position.y = -9;
  arrow.mesh.rotation.z = -90 * Math.PI / 180;
  arrows.add(arrow.mesh);
  
  arrow = new Arrow();
  arrow.create(8, '#cf088a');
  arrow.mesh.position.y = 9;
  arrow.mesh.rotation.z = 90 * Math.PI / 180;
  arrows.add(arrow.mesh);
  
  
  arrow = new Arrow();
  arrow.create(4, '#03a38f');
  arrow.mesh.position.x = -11.5;
  arrow.mesh.rotation.z = 180 * Math.PI / 180;
  arrows.add(arrow.mesh);
  
  arrow = new Arrow();
  arrow.create(4, '#03a38f');
  arrow.mesh.position.x = 11.5;
  //arrow.mesh.rotation.z = 180 * Math.PI / 180;
  arrows.add(arrow.mesh);
  
  arrow = new Arrow();
  arrow.create(4, '#cf088a');
  arrow.mesh.position.y = -11.5;
  arrow.mesh.rotation.z = -90 * Math.PI / 180;
  arrows.add(arrow.mesh);
  
  arrow = new Arrow();
  arrow.create(4, '#cf088a');
  arrow.mesh.position.y = 11.5;
  arrow.mesh.rotation.z = 90 * Math.PI / 180;
  arrows.add(arrow.mesh);
  
  
  return arrows;
};


Vessels.prototype.initVignetteShader_ = function() {
  this.composer_ = new THREE.EffectComposer(this.renderer_);
  this.composer_.addPass(new THREE.RenderPass(this.scene_, this.camera_));
  
  var vignette = new THREE.ShaderPass(THREE.VignetteShader);
  vignette.uniforms.offset.value = 1.16;
  vignette.uniforms.darkness.value = 1.0;
  vignette.renderToScreen = true;
  this.composer_.addPass(vignette);
};


Vessels.prototype.render_ = function() {
  this.stats_.begin();
  
  this.angle_ += 0.02;
  var pointx  =  Math.cos( this.angle_ ) * 15;
  var pointy  = Math.sin( this.angle_) * 15;
  this.lights_[0].position.set(pointx, pointy, 0);
  this.lights_[1].position.set(0, pointx, pointy);
  
  this.dust_.update(this.lights_);
  //this.renderer_.render(this.scene_, this.camera_);
  this.composer_.render();
  this.stats_.end();
  
  requestAnimationFrame(this.render_.bind(this));
};


(function() {
  var vessels = new Vessels();
  vessels.init();
})();

var Dust = function(renderer, camera) {
  this.renderer_ = renderer;
  
  this.camera_ = camera;
  
  this.gpgpuUtility_ = null;

  this.width_ = 256;

  this.numParticles_ = this.width_ * this.width_;
  
  this.mesh = null;

  this.positionVariable = null;

  this.hair_ = null;
  
  this.particles_ = null;
  
  this.init();
};


Dust.prototype.init = function() {
  
  this.mesh = new THREE.Object3D();
  
  this.gpgpuUtility_ = new GPUComputationRenderer( this.width_, this.width_, this.renderer_ );
  var texturePosition = this.gpgpuUtility_.createTexture();
  var textureVelocity = this.gpgpuUtility_.createTexture();
  
  this.fillTexture_(texturePosition);
  this.fillVelocityTexture_(textureVelocity);
  
  this.positionVariable = this.gpgpuUtility_.addVariable(
      "texturePosition",
      document.getElementById( 'fragmentShaderPosition' ).textContent,
      texturePosition);

  this.velocityVariable = this.gpgpuUtility_.addVariable(
      "textureVelocity",
      document.getElementById('fragmentShaderVelocity').textContent,
      textureVelocity);
  
  this.gpgpuUtility_.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable]);
  this.gpgpuUtility_.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable]);

  this.positionVariable.wrapS = THREE.RepeatWrapping;
  this.positionVariable.wrapT = THREE.RepeatWrapping;
  this.velocityVariable.wrapS = THREE.RepeatWrapping;
  this.velocityVariable.wrapT = THREE.RepeatWrapping;

  this.gpgpuUtility_.init();
  
  this.createPointsGeometry_();
  this.createHairParticles_();
};


Dust.prototype.createHairParticles_ = function() {

  this.hair_ = new THREE.Object3D();
  var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
  var numHairs = 30;

  var material = new MeshLineMaterial({
    useMap: false,
    color: new THREE.Color('#ffffff'),
    opacity: 0.2,
    resolution: resolution,
    sizeAttenuation: false,
    lineWidth: 2,
    near: this.camera_.near,
    far: this.camera_.far,
    transparent: true,
    blending: THREE.AdditiveBlending
  });
  
  for (var i = 0; i < numHairs; i++) {
    var geometry = new THREE.Geometry();

    var length = Math.random() * 5 + 2;
    var curvyness = Math.random();
    for( var j = 0; j < length; j += curvyness ) {
        var v = new THREE.Vector3( j, Math.sin( j ), 0 );
        geometry.vertices.push( v );
    }

    var line = new MeshLine();
    line.setGeometry( geometry );
    
    var mesh = new THREE.Mesh( line.geometry, material );

    mesh.scale.set(0.5, 0.5, 0.5);
    mesh.position.set(Math.random() * 30 - 15, Math.random() * 30 - 15, Math.random() * 30 - 15);
    mesh.rotation.set(Math.random(), Math.random(), Math.random());

    this.hair_.add(mesh);
  }
  
  this.mesh.add(this.hair_);
  
};


Dust.prototype.fillVelocityTexture_ = function(texture) {
  var theArray = texture.image.data;

  for ( var k = 0, kl = theArray.length; k < kl; k += 4 ) {
    theArray[ k ] = Math.random() * 20 - 10;
    theArray[ k + 1 ] = Math.random() * 20 - 10;
    theArray[ k + 2 ] = Math.random() * 20 - 10;
    theArray[ k + 3 ] = 1;
  }
};


Dust.prototype.fillTexture_ = function(texture) {
  var theArray = texture.image.data;

  var bounds = 50;
  var boundsHalf = bounds / 2;

  for ( var k = 0, kl = theArray.length; k < kl; k += 4 ) {
    var x = Math.random() * bounds - boundsHalf;
    var y = Math.random() * bounds - boundsHalf;
    var z = Math.random() * bounds - boundsHalf;
    theArray[ k ] = x;
    theArray[ k + 1 ] = y;
    theArray[ k + 2 ] = z;
    theArray[ k + 3 ] = 1;
  }
};


Dust.prototype.createPointsGeometry_ = function() {
  var geometry = new THREE.BufferGeometry();

  var vertices = new Float32Array(this.numParticles_ * 3);
  var references = new Float32Array(this.numParticles_ * 2);



  for (var i = 0; i < vertices.length; i += 3) {
    vertices[i] = 0;
    vertices[i+1] = 0;
    vertices[i+2] = 0;

    var j = ~~(i / 3);
    var x = (j % this.width_) / this.width_;
    var y = ~~(j / this.width_) / this.width_;

    references[ i * 2     ] = x;
    references[ i * 2 + 1 ] = y;
  }

  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3 ));
  geometry.addAttribute('reference', new THREE.BufferAttribute(references, 2));

  geometry.computeBoundingSphere();
  

  var uniforms = {
    texturePosition: { value: null },
    time: { value: 1.0 },
    delta: { value: 0.0 },
    lightPos1: {value: new THREE.Vector3(0, 0, 0)},
    lightPos2: {value: new THREE.Vector3(0, 0, 0)},
    uSpread: {value: 0.26}
  };

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('particlesVertex').innerText,
    fragmentShader: document.getElementById('particlesFragment').innerText,
    side: THREE.DoubleSide,
    transparent: true,
    depthTest: false
  });

  this.particles_ = new THREE.Points(geometry, material);
  
  this.mesh.add(this.particles_);
};


Dust.prototype.update = function(lights) {
  this.gpgpuUtility_.compute();
  
  if (this.hair_) {
    this.hair_.rotation.x += 0.0005;
    this.hair_.rotation.y += 0.0005;
    this.hair_.rotation.z += 0.0005;
  }
  
  
  this.particles_.material.uniforms.texturePosition.value = this.gpgpuUtility_.getCurrentRenderTarget(this.positionVariable).texture;
  
  this.particles_.material.uniforms.lightPos1.value = lights[0].position;
  this.particles_.material.uniforms.lightPos2.value = lights[1].position;
  
};


module.exports = Dust;

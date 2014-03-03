/* Visualization */

function Visualization() {
	this.renderer = null;
    this.scene = null;
    this.camera = null;
	this.stats = null;
    this.particleSystem = null;
}

Visualization.prototype.initScene = function(container) {
	// set the scene size
	var WIDTH = 400,
	  HEIGHT = 300;

	// set some camera attributes
	var VIEW_ANGLE = 45,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

	// create a WebGL renderer, camera
	// and a scene
	var renderer = new THREE.WebGLRenderer();
	var camera =
	  new THREE.PerspectiveCamera(
	    VIEW_ANGLE,
	    ASPECT,
	    NEAR,
	    FAR);

	var scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);

	// the camera starts at 0,0,0
	// so pull it back
	camera.position.z = 300;

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	$container.append(renderer.domElement);

	this.renderer = renderer;
	this.camera = camera;
	this.scene = scene;
};

Visualization.prototype.initStats = function(container) {
	var stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

	// Align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.bottom = '0px';

	container.append(stats.domElement);

	this.stats = stats;
};

Visualization.prototype.addParticleSystem = function() {
	// create the particle variables
	var particleCount = 1800,
	    particles = new THREE.Geometry(),
	    pMaterial = new THREE.ParticleBasicMaterial({
	      color: 0xFFFFFF,
	      size: 20,
	      map: THREE.ImageUtils.loadTexture(
		    "img/particle.png"
		  ),
		  blending: THREE.AdditiveBlending,
		  transparent: true
	    });

	// now create the individual particles
	for (var p = 0; p < particleCount; p++) {
		// create a particle with random
		// position values, -250 -> 250
		var pX = Math.random() * 500 - 250,
		      pY = Math.random() * 500 - 250,
		      pZ = Math.random() * 500 - 250,
		      particle = new THREE.Vector3(pX, pY, pZ);

		// create a velocity vector
		particle.velocity = new THREE.Vector3(
			0,              // x
			-Math.random(), // y: random vel
			0);             // z

		// add it to the geometry
		particles.vertices.push(particle);
	}

	// create the particle system
	var particleSystem = new THREE.ParticleSystem(
	    particles,
	    pMaterial);

    particleSystem.sortParticles = true;

	// add it to the scene
	this.scene.add(particleSystem);

	this.particleSystem = particleSystem;
};

Visualization.prototype.update = function() {
  var particleSystem = this.particleSystem;
  var particles = particleSystem.geometry;

  particleSystem.rotation.y += 0.01;

  var pCount = particles.vertices.length;
  while (pCount--) {

    // get the particle
    var particle =
      particles.vertices[pCount];

    // check if we need to reset
    if (particle.y < -200) {
      particle.y = 200;
      particle.velocity.y = 0;
    }

    // update the velocity with
    // a splat of randomniz
    particle.velocity.y -= Math.random() * 0.1;

    // and the position
    particle.add(particle.velocity);
  }

  // flag to the particle system
  // that we've changed its vertices.
  particleSystem.
    geometry.
    __dirtyVertices = true;
};

Visualization.prototype.render = function() {
	if (this.stats) this.stats.begin();

	this.update();
	this.renderer.render(this.scene, this.camera);

	if (this.stats) this.stats.end();

	requestAnimationFrame(this.render.bind(this));
};

Visualization.prototype.addGUI = function() {
	// create GUI widget
	var gui = new dat.GUI();

	// widget params
	gui.add(this.camera.position, 'x', -100, 100);
	gui.add(this.camera.position, 'y', -100, 100);
	gui.add(this.camera.position, 'z', 0, 600);

	this.gui = gui;
};

/* Main */

var $container = $('#container');

visualization = new Visualization();
visualization.initScene($container);
visualization.initStats($container);
visualization.addParticleSystem();
visualization.render();
visualization.addGUI();

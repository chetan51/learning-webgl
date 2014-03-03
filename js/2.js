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

	  // add it to the geometry
	  particles.vertices.push(particle);
	}

	// create the particle system
	var particleSystem = new THREE.ParticleSystem(
	    particles,
	    pMaterial);

	// add it to the scene
	this.scene.add(particleSystem);

	this.particleSystem = particleSystem;
};

Visualization.prototype.addLight = function() {
	// create a point light
	var pointLight =
	  new THREE.PointLight(0xFFFFFF);

	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;

	// add to the scene
	this.scene.add(pointLight);

	this.light = pointLight;
};

Visualization.prototype.render = function() {
	if (this.stats) this.stats.begin();
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

/* Visualization */

function Visualization() {
	this.renderer = null;
    this.scene = null;
    this.camera = null;
	this.stats = null;
    this.sphere = null;
    this.light = null;
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

Visualization.prototype.addSphere = function() {
	// set up the sphere vars
	var radius = 50,
	    segments = 16,
	    rings = 16;

	// create the sphere's material
	var sphereMaterial =
	new THREE.MeshLambertMaterial(
	{
		color: 0xCC0000
	});

	// create a new mesh with
	// sphere geometry - we will cover
	// the sphereMaterial next!
	var sphere = new THREE.Mesh(

	  new THREE.SphereGeometry(
	    radius,
	    segments,
	    rings),

	  sphereMaterial);

	// add the sphere to the scene
	this.scene.add(sphere);

	this.sphere = sphere;
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
	gui.add(this.light.position, 'x', -100, 100);
	gui.add(this.light.position, 'y', -100, 100);
	gui.add(this.light.position, 'z', 50, 200);

	this.gui = gui;
};

/* Main */

var $container = $('#container');

visualization = new Visualization();
visualization.initScene($container);
visualization.initStats($container);
visualization.addSphere();
visualization.addLight();
visualization.render();
visualization.addGUI();

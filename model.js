// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// use momentjs to get/manipulate dates
var today = moment();

var container = document.getElementById('container');
var container2 = document.getElementById('container2');

// Create an empty scene
var scene = new THREE.Scene();
var scene2 = new THREE.Scene();

// Create a basic parallel projection
// Make sure x-y ratio is 1:1
var w = container.offsetWidth;
var h = container.offsetHeight;
var x_width, y_height;
if (w > h) {
  y_height = 1.5;
  x_width = 1.5 * w / h;
} else {
  y_height = 1.5 * h / w;
  x_width = 1.5;
};

var camera = new THREE.OrthographicCamera( - x_width, x_width, y_height, - y_height, -2, 2 );
//camera.position.z = 1
// Perpective Camera for moon view
var camera2 = new THREE.PerspectiveCamera( 90, w / h, 0.00001, 1000 );

// var controls = new THREE.OrbitControls( camera );
// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});
var renderer2 = new THREE.WebGLRenderer({antialias:true});
// Configure renderer clear color
renderer.setClearColor("#000000");
renderer2.setClearColor("#101010");
// Configure renderer size
renderer.setSize( w, h );
renderer2.setSize( w, h );
// Append Renderer to DOM
//document.body.appendChild( renderer.domElement );
container.appendChild(renderer.domElement);
container2.appendChild(renderer2.domElement);

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Set up scale sliders
var sun_slider = document.getElementById("sun_slider");
var sun_output = document.getElementById("sun_value");
sun_output.innerHTML = sun_slider.value;
sun_slider.oninput = function() {
  sun_output.innerHTML = this.value;
};

var earth_slider = document.getElementById("earth_slider");
var earth_output = document.getElementById("earth_value");
earth_output.innerHTML = earth_slider.value;
earth_slider.oninput = function() {
  earth_output.innerHTML = this.value;
};

var moon_slider = document.getElementById("moon_slider");
var moon_output = document.getElementById("moon_value");
moon_output.innerHTML = moon_slider.value;
moon_slider.oninput = function() {
  moon_output.innerHTML = this.value;
};

var earth_moon_slider = document.getElementById("earth_moon_slider");
var earth_moon_output = document.getElementById("earth_moon_value");
earth_moon_output.innerHTML = earth_moon_slider.value;
earth_moon_slider.oninput = function() {
  earth_moon_output.innerHTML = this.value;
};

// TODO: This part can be in an update function in animate rather than in the slider
var date_str;
var obj;
//data[today.format("YYYY-MM-DD")]["earth"][0])

var date_slider = document.getElementById("date_slider");
var date_output = document.getElementById("date_value");
date_output.innerHTML = today.clone().add(date_slider.value, "days").format("YYYY-MM-DD");
date_slider.oninput = function() {
  date_str = today.clone().add(this.value, "days").format("YYYY-MM-DD");
  date_output.innerHTML = date_str;
  obj = data[date_str][0];
  earth_pos.set(obj[0], obj[1], obj[2]);
  obj = data[date_str][1];
  moon_pos.set(obj[0], obj[1], obj[2]);
};

// Initialize the objects
var sun_rad = 0.00465;
var earth_rad = sun_rad / 109;
var moon_rad = earth_rad / 4;

// Model in threejs
// TODO fix scale of moon phase
var geometry = new THREE.SphereGeometry( earth_rad, 32, 32 );
var geometry2 = new THREE.SphereGeometry( moon_rad, 32, 32 );
var geometry3 = new THREE.SphereGeometry( sun_rad, 32, 32 );
var geometry4 = new THREE.SphereGeometry( moon_rad, 32, 32 );
var material = new THREE.MeshBasicMaterial( { color: "#0000FF" } );
var material2 = new THREE.MeshBasicMaterial( { color: "#FFFFFF" } );
var material3 = new THREE.MeshBasicMaterial( { color: "#FFFF00" } );
var material4 = new THREE.MeshLambertMaterial( { color: "#FFFFFF" } );
var earth = new THREE.Mesh( geometry, material );
var moon = new THREE.Mesh( geometry2, material2 );
var sun = new THREE.Mesh( geometry3, material3 );
var moon_phase = new THREE.Mesh( geometry4, material4 );

// Add to Scene
scene.add( earth );
scene.add( moon );
scene.add( sun );

// Add moon to scene2
scene2.add( moon_phase );
// Add a point light at Sun position
var light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 0, 0, 0 );
scene2.add( light );




// Move everything around
var earth_pos = new THREE.Vector3();
var moon_pos = new THREE.Vector3();
// Position from solarcal
earth_pos.set( -9.54221512e-01, 2.81997761e-01, -5.25333210e-05 );
moon_pos.set( -9.51957022e-01, 2.80504021e-01, -1.77732216e-04 );
//var earth_pos = new THREE.Vector3( -9.81791257e-01, 1.67540994e-01, -4.47878036e-05 );
//var moon_pos = new THREE.Vector3( -9.80106098e-01, 1.69518402e-01, -2.55197419e-04 );
var earth_to_moon;
var scaled_moon;
function update_pos() {
  earth_to_moon = moon_pos.clone().sub(earth_pos);

  // second camera is at earth looking at moon
  camera2.position.copy(earth_pos);
  camera2.up.set(0,0,1);
  camera2.lookAt(moon_pos);
  camera2.zoom = 100;
  camera2.updateProjectionMatrix();

  earth.position.copy(earth_pos);
  moon.position.copy(moon_pos);
  sun.position.set(0,0,0);
  scaled_moon = earth_pos.clone().add(earth_to_moon.clone().multiplyScalar(earth_moon_output.innerHTML));
  moon.position.copy(scaled_moon);
  moon_phase.position.copy(moon_pos);
};


// Render Loop
var render = function () {
  requestAnimationFrame( render );

//  controls.update();
  sun.scale.setScalar(sun_output.innerHTML);
  earth.scale.setScalar(earth_output.innerHTML);
  moon.scale.setScalar(moon_output.innerHTML);
  // update positions
  update_pos();

  // Render the scene
  renderer.render(scene, camera);
  renderer2.render(scene2, camera2);
};

render();
//renderer.render(scene, camera);

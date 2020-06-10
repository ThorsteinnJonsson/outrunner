import {GridMap} from './grid_map.js';

// Performance monitor
// const stats = new Stats();
// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = createCamera();
const controls = createControls(camera, renderer);

const depth = 20;
const width = 150;
const depthStep = 2;
const widthStep = 2;
const gridmap = new GridMap(scene, depth, width, depthStep, widthStep);


drawScene();


function drawScene() {
  // stats.begin();

  setTimeout(function() {
    requestAnimationFrame(drawScene);
  }, 1000 / 60);

  // Update
  controls.update();
  gridmap.update();

  // Render
  renderer.clear();
  renderer.render(scene, camera);

  // stats.end();
}

function createCamera() {
  const camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      1000);
  camera.position.y = 3;
  camera.position.z = 4;
  return camera;
}

function createControls(camera, renderer) {
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.75;
  controls.rotateSpeed = 0.75;
  controls.enableZoom = true;
  // controls.enableKeys = false;
  // controls.enablePan = false;
  return controls;
}

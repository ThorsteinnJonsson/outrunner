import {GridMap} from './grid_map.js';
import * as THREE from '../lib/three/src/Three.js';
import {OrbitControls} from '../lib/three/examples/jsm/controls/OrbitControls.js';
import {EffectComposer} from '../lib/three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from '../lib/three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from '../lib/three/examples/jsm/postprocessing/UnrealBloomPass.js';

const params = {
  exposure: 1,
  bloomStrength: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0,
};

// Performance monitor
// const stats = new Stats();
// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;

document.body.appendChild(renderer.domElement);

const camera = createCamera();
const controls = createControls(camera, renderer);

const depth = 20;
const width = 300;
const depthStep = 2;
const widthStep = 2;
const gridmap = new GridMap(scene, depth, width, depthStep, widthStep);


// Lighting and shading
scene.add(new THREE.AmbientLight(0x404040));
camera.add(new THREE.PointLight(0xffffff, 1));

const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

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
  composer.render();

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
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.75;
  controls.rotateSpeed = 0.75;
  controls.enableZoom = true;
  controls.enableKeys = false;
  controls.enablePan = false;
  return controls;
}

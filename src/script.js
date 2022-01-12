import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import gsap from 'gsap';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load('textures/bricks/cross-hatch.png');
const testTexture = textureLoader.load('textures/keyboard.jpg');
const testTexture2 = textureLoader.load('textures/bricks/color.jpg');

/**
 * House
 */
// Geometries
const flrHeight = 20;
const flrWidth = 40;

// Extrude Geometries
const extrudeLength = flrWidth * 0.92,
  extrudeHeight = 0.01;

const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(0, extrudeHeight);
shape.lineTo(extrudeLength, extrudeHeight);
shape.lineTo(extrudeLength, 0);
shape.lineTo(0, 0);

const extrudeSettings = {
  steps: 10,
  depth: 0.1,
  bevelEnabled: true,
  bevelThickness: 0.25,
  bevelSize: 0.65,
  bevelOffset: 0.7,
  bevelSegments: 1,
};

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(flrWidth, flrHeight),
  new THREE.MeshStandardMaterial({ color: '#a9c388' })
);
// floor.rotation.x = -Math.PI * 0.5;
floor.position.x = -2;

// Header
const header = new THREE.Mesh(
  new THREE.BoxBufferGeometry(flrWidth, flrHeight * 0.1, 0.5),
  new THREE.MeshStandardMaterial({ color: '#FFC8A1' })
);
header.position.set(-2, flrHeight * 0.45, 0.1);

// Left Panel
const leftPanel = new THREE.Mesh(
  new THREE.BoxBufferGeometry(flrWidth * 0.5, flrHeight * 0.9, 0.5),
  new THREE.MeshStandardMaterial({ color: '#FF2A2A' })
);
leftPanel.position.set(-(flrWidth * 0.25) - 2, -1, 0);

const leftImage = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(flrWidth * 0.25, flrHeight * 0.5),
  new THREE.MeshStandardMaterial({ map: testTexture2, side: THREE.DoubleSide })
);
leftImage.position.set(-(flrWidth * 0.25), -3, 1);

// Right Panel
const rightPanel = new THREE.Mesh(
  new THREE.BoxBufferGeometry(flrWidth * 0.5, flrHeight * 0.9, 0.5),
  new THREE.MeshStandardMaterial({ color: '#FFFFFF' })
);
rightPanel.position.set(flrWidth * 0.25 - 2, -1, 0);

const rightImage = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(flrWidth * 0.2, flrHeight * 0.75),
  new THREE.MeshStandardMaterial({ map: testTexture, side: THREE.DoubleSide })
);
rightImage.position.set(flrWidth * 0.25 - 2, -1, 1);

// Side Nav Bar
const navBar = new THREE.Mesh(
  new THREE.BoxBufferGeometry(flrWidth * 0.1, flrHeight, 0.5),
  new THREE.MeshStandardMaterial({ color: '#3CDFB8' })
);

navBar.position.set(flrWidth * 0.25 + 10, 0, 0);

/**
 * TEXT
 */

// Header Text
const fontLoader = new FontLoader();
fontLoader.load('/fonts/Be_Vietnam_Pro_Black_Regular.json', (font) => {
  //Geometry
  const headerTextGeometry = new TextGeometry('Software Developer', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  //Material - make sure you use Normal material to get that gradient color
  const headerTextMaterial = new THREE.MeshBasicMaterial({
    color: 'blue',
  });
  const text = new THREE.Mesh(headerTextGeometry, headerTextMaterial);
  text.position.set(-19, 8.5, 1);
  scene.add(text);
});

scene.add(header, leftPanel, leftImage, rightPanel, rightImage, navBar);
scene.background = bgTexture;
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5);
moonLight.position.set(0, 10, 30);
moonLight.lookAt(0, 0, 0);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

const helper = new THREE.DirectionalLightHelper(moonLight, 5);
scene.add(helper);
// White directional light at half intensity shining from the top.
const width = 10;
const height = 10;
const intensity = 10;
const rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
rectLight.position.set(15, 5, 30);
rectLight.lookAt(0, 0, 0);
// scene.add(rectLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 20;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Reset Button

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const aboutTL = gsap.timeline();
const contactTL = gsap.timeline();

window.addEventListener('mousedown', () => {
  aboutTL
    .to(header.position, { y: -9, ease: 'power1.out', duration: 1 })
    .to(leftPanel.position, { y: 1, ease: 'power1.out', duration: 1 }, '-=1')
    .to(rightPanel.position, { y: 1, ease: 'power1.out', duration: 1 }, '-=1');
});

window.addEventListener('dblclick', () => {
  contactTL
    .to(header.rotation, { z: Math.PI * 0.5 })
    .to(header.position, { y: 1 })
    .to(header.scale, { x: 0.45, y: 0.25 });
});

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { Reflector } from "./modules/reflector";
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
scene.background = new THREE.Color(0xfafafa);
renderer.setSize(innerWidth, innerHeight);
cam.position.z = 5;
cam.position.y = 0;

// lights
const mainLight = new THREE.PointLight(0xe7e7e7, 2.5, 250, 0);
mainLight.position.y = 60;
scene.add(mainLight);
document.body.appendChild(renderer.domElement);
const directionalLight = new THREE.DirectionalLight({
  color: 0xffffff,
  intensity: 1, // Adjust intensity as needed
});

directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;

// Set shadow map size for better quality
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

let grid = new THREE.GridHelper(100, 20, 0x0a0a0a0, 0x0a0a0a0);
grid.position.set(0, -0.5, 0);
scene.add(grid);

const cubeSize = 1;

const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  "https://upload.wikimedia.org/wikipedia/commons/9/94/Osama_bin_Laden_in_2001_%28cropped%29.jpg"
);

const material = new THREE.MeshStandardMaterial({
  map: texture,
});

const cube = new THREE.Mesh(cubeGeometry, material);

scene.add(cube);

const geometry = new THREE.PlaneGeometry(5, 5);
const verticalMirror = new Reflector(geometry, {
  clipBias: 0.003,
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
  color: 0x849595,
});
scene.add(verticalMirror);

const controls = new PointerLockControls(cam, renderer.domElement);
let clock = new THREE.Clock();
// button pointer locked in
const btn1 = document.getElementById("btn1");
btn1.addEventListener("click", () => {
  controls.lock();
});

let keyboard = [];
addEventListener("keydown", (e) => {
  keyboard[e.key] = true;
  console.log(e.key);
});
addEventListener("keyup", (e) => {
  keyboard[e.key] = false;
});

// pointer lock event listener
controls.addEventListener("lock", () => {
  btn1.innerHTML = "Locked";
});
controls.addEventListener("unlock", () => {
  btn1.innerHTML = "unlocked";
});

function proccess_Keyboard(delta) {
  let speed = 3;
  let actualspeed = speed * delta;
  switch (true) {
    case keyboard["w"]:
      controls.moveForward(actualspeed);
      break;
    case keyboard["s"]:
      controls.moveForward(-actualspeed);
      break;
    case keyboard["a"]:
      controls.moveRight(-actualspeed);
      break;
    case keyboard["d"]:
      controls.moveRight(actualspeed);
      break;
    case keyboard["ArrowDown"]:
      cube.position.z -= actualspeed;
      break;
    case keyboard["ArrowUp"]:
      cube.position.z += actualspeed;
      break;
    case keyboard["ArrowRight"]:
      cube.position.x += actualspeed;
      break;
    case keyboard["ArrowLeft"]:
      cube.position.x -= actualspeed;
      break;
    default:
      break;
  }
}

function drawScene() {
  renderer.render(scene, cam);
  let delta = clock.getDelta();
  proccess_Keyboard(delta);
  requestAnimationFrame(drawScene);
}

drawScene();

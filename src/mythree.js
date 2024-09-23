import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as dat from "lil-gui";

let lilnasx;
let blackcat;
let rotatey = 0;
const soundButton = document.getElementById("sound");
const nextButton = document.getElementById("user-move");
const meowAudio = document.getElementById("meow-sound");
const inAudio = document.getElementById("industry-sound");
const Text = document
  .getElementById("user-move")
  .getElementsByClassName("text")[0];
let nowStep = 0;
let lilmov = 0.02;
let startlift = false;
let startback = false;
let nowAudio = meowAudio;

// function transPlayNow() {
//   if (nowStep != STEPSTATE.third.id) {
//     if (nowAudio.paused) {
//       nowAudio.currentTime = 0;
//       nowAudio.play();
//       soundButton.style.visibility = "visible";
//     } else {
//       nowAudio.currentTime = 0;
//       nowAudio.pause();
//       soundButton.style.visibility = "hidden";
//     }
//   }
// }
let meowPlayTimeout = false; // meow only play 3s and stop this is stop event flag

function transAudio(transto, type) {
  nowAudio.currentTime = 0;
  nowAudio.pause();
  soundButton.style.visibility = "hidden";
  nowAudio = transto;
  nowAudio.currentTime = 0;
  nowAudio.play();
  soundButton.style.visibility = "visible";
  if (meowPlayTimeout) {
    clearTimeout(meowPlayTimeout);
    meowPlayTimeout = false;
  }
  if (type === "cat") {
    //cat 三秒后停止；
    meowPlayTimeout = setTimeout(function () {
      meowPlayTimeout = false;
      nowAudio.currentTime = 0;
      nowAudio.pause();
      soundButton.style.visibility = "hidden";
    }, 3000);
  }
}
const STEPSTATE = [
  {
    id: 0,
    dialog: "what is the thing in front of me, bro?",
    audioType: "cat",
    audio: meowAudio,
  },
  {
    id: 1,
    dialog: "It's a dog. So cute.",
    audioType: "cat",
    audio: meowAudio,
  },
  {
    id: 2,
    dialog: "...???",
    audioType: "li",
    audio: inAudio,
  },
];

function makeNext() {
  if (nowStep == 0) {
    nowStep = 1;
  } else if (nowStep == 1) {
    nowStep = 2;
  } else {
    startlift = false;
    startback = true;
    nowStep = 0;
  }
  transAudio(STEPSTATE[nowStep].audio, STEPSTATE[nowStep].audioType);
  Text.innerText = STEPSTATE[nowStep].dialog;
}

// soundButton
//   .getElementsByClassName("talk")[0]
//   .addEventListener("click", transPlayNow);

nextButton
  .getElementsByClassName("next")[0]
  .addEventListener("click", makeNext);

setInterval(function () {
  if (inAudio.currentTime > 5) startlift = true;
}, 500);

//loader promise
function loadMTL(url) {
  return new Promise((resolve) => {
    new MTLLoader().load(url, resolve);
  });
}
function loadGLTF(url) {
  return new Promise((resolve) => {
    new GLTFLoader().load(url, resolve);
  });
}
function loadOBJ(url, mtl) {
  const objloader = new OBJLoader();
  objloader.setMaterials(mtl);
  return new Promise((resolve) => {
    objloader.load(url, resolve);
  });
}
function loadErrorCB(error) {
  console.error(error);
}
// Canvas
const canvas = document.querySelector("#main-canvas");
const scene = new THREE.Scene();

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Gui
//const gui = new dat.GUI()

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(6, 4, 12);
camera.lookAt(0, 0, 0);

// Controls
/*
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = false;
//controls.zoomSpeed = 0.3
controls.target = new THREE.Vector3(0, 3, 0)
controls.enableZoom = false;
controls.enableRotated = false;
controls.enablePan = false;
*/

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.setClearColor(0x00ccff, 0.5);
/**
 * Objects
 */
// plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({
    color: "#FFCCFF",
  })
);
plane.rotateX(-Math.PI / 2);
plane.receiveShadow = true;
scene.add(plane);

/**
 * Light
 */
const directionLight = new THREE.DirectionalLight();
directionLight.castShadow = true;
directionLight.position.set(5, 5, 6);
directionLight.shadow.camera.near = 1;
directionLight.shadow.camera.far = 20;
directionLight.shadow.camera.top = 10;
directionLight.shadow.camera.right = 10;
directionLight.shadow.camera.bottom = -10;
directionLight.shadow.camera.left = -10;

const directionLightHelper = new THREE.DirectionalLightHelper(
  directionLight,
  2
);
directionLightHelper.visible = false;
scene.add(directionLightHelper);

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

const ambientLight = new THREE.AmbientLight(new THREE.Color("#ffffff"), 0.3);
scene.add(ambientLight, directionLight);

//lil-nas-x
/*class PositionGUI {
  constructor(obj, name) {
    this.obj = obj
    this.name = name
  }
  get modify() {
    return this.obj[this.name]
  }
  set modify(v) {
    this.obj[this.name] = v
  }
}
const folder = gui.addFolder('全局Position')
*/
function addLilNasX(gltf) {
  gltf.scene.scale.set(0.05, 0.05, 0.05);
  gltf.scene.position.set(0, -10.15, 0);
  lilnasx = gltf.scene;
  /*folder.add(new PositionGUI(gltf.scene.position, 'x'), 'modify', 0, 200).name('x')
  folder.add(new PositionGUI(gltf.scene.position, 'y'), 'modify', -200, 200).name('y')
  folder.add(new PositionGUI(gltf.scene.position, 'z'), 'modify', 0, 200).name('z')*/
  scene.add(gltf.scene);
}
loadGLTF("model/lil-nas-x/scene.gltf")
  .then((gltf) => addLilNasX(gltf))
  .catch((error) => loadErrorCB(error));

//cat
function addCat(obj) {
  obj.scale.set(0.05, 0.05, 0.05);
  obj.rotateX(-Math.PI / 2);
  console.log(obj);
  obj.position.set(0, 0, 0);
  blackcat = obj;
  scene.add(obj);
  nextButton.style.visibility = "visible";
}
loadMTL("model/black-cat/12222_Cat_v1_l3.mtl")
  .then((mtl) => loadOBJ("model/black-cat/12222_Cat_v1_l3.obj", mtl))
  .then((obj) => addCat(obj))
  .catch((error) => loadErrorCB(error));

//animate
function animate() {
  requestAnimationFrame(animate);
  if (
    blackcat != null &&
    blackcat != undefined &&
    lilnasx != null &&
    lilnasx != undefined
  ) {
    if (startlift) {
      if (lilnasx.position.y > 40) lilmov = -0.03;
      else if (lilnasx.position.y < -10.5) lilmov = 0.03;
      lilnasx.position.y += lilmov;
      blackcat.position.y += lilmov;
      rotatey += 0.01;
      lilnasx.rotateY(0.01);
      blackcat.rotateZ(0.01);
    } else if (startback) {
      lilmov = -1.5;
      if (blackcat.position.y > 1.5) {
        lilnasx.position.y += lilmov;
        blackcat.position.y += lilmov;
      } else {
        lilmov = 0.03;
        startback = false;
        lilnasx.position.y = -10.5;
        blackcat.position.y = 0;
      }
    } else {
      lilnasx.position.y = -10.5;
      blackcat.position.y = 0;
    }
    if (blackcat.position.y > 5) camera.lookAt(0, blackcat.position.y - 5, 0);
    else camera.lookAt(0, 0, 0);
  }
  renderer.render(scene, camera);
}

animate();

/*
 * Visualization Sound
 */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Get the source
meowAudio.onplay = () => audioCtx.resume();
inAudio.onplay = () => audioCtx.resume();
console.log(meowAudio);
console.log(meowAudio.onplay);
const meowSource = audioCtx.createMediaElementSource(meowAudio);
const inSource = audioCtx.createMediaElementSource(inAudio);

// Create an analyser
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2 ** 5;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const secLength = 8;
const secLong = parseInt(bufferLength / secLength + 1);
let secTemp = new Array(secLength).fill(0);

// Connect parts
meowSource.connect(analyser);
inSource.connect(analyser);
analyser.connect(audioCtx.destination);

// Visualisation
const section = document.querySelector(".see-sound");
const secI = new Array(secLength)
  .fill()
  .map((e) => (e = document.createElement("i")) && section.appendChild(e) && e);

setInterval(() => {
  analyser.getByteTimeDomainData(dataArray);
  secTemp = secTemp.fill(0);
  dataArray.forEach(
    (d, i) =>
      (secTemp[parseInt(i / secLong)] += (Math.abs(128 - d) * 2.8125) | 0)
  );
  secI.forEach((d, i) =>
    secI[i].style.setProperty("--c", secTemp[i] / secLong)
  );
}, 15);

/*
gui.add(directionLightHelper, 'visible').name('lightHelper visible')
gui.add(directionalLightCameraHelper, 'visible').name('lightCameraHelper visible')
gui.add(controls, 'autoRotate')
*/

import { Scene, Object, ImageObject, ButtonObject } from './scene.js'
import { io } from "socket.io-client";
import { MultiplayerLobbiesScene } from './scenes/multiplayerlobbies.js';
import { MainScene } from './scenes/mainScreen.js';
import { LoadingScene } from './scenes/loadingScreen.js';

/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const socket = io("ws://localhost:3000");

// Constants
const EXPECTED_HEIGHT = 1040;

// Variables
const SceneManager = {
    currentScene: null
}

socket.on('test-two', (msg) => {
    console.log("SECOND TEST: " + msg);
});


// Main Code
function initialize() {
    onresize = resize;
    resize();
    SceneManager.currentScene = LoadingScene;

    requestAnimationFrame(loop);
}

function update(elapsed) {
    SceneManager.currentScene?.update(elapsed);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    SceneManager.currentScene?.draw();
}

let lastRender = 0;
function loop(dt) {
    const elapsed = dt - lastRender;

    update(elapsed);
    draw();

    lastRender = dt;
    requestAnimationFrame(loop);
}

canvas.addEventListener("click", function (e) {
    const scale = EXPECTED_HEIGHT / innerHeight;
    const [mx, my] = [e.clientX * scale, e.clientY * scale];

    SceneManager.currentScene?.handleClick(mx, my);
});

function resize() {
    const ar = innerWidth / innerHeight;
    canvas.width = EXPECTED_HEIGHT * ar;
    canvas.height = EXPECTED_HEIGHT;
    console.log(SceneManager.currentScene);
}

initialize();

export { ctx, canvas, SceneManager }
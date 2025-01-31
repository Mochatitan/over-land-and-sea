import { Scene, Object, ImageObject, ButtonObject } from './scene.js'
import { io } from "socket.io-client";

/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const socket = io("ws://localhost:3000");

// Constants
const EXPECTED_HEIGHT = 1040;

// Variables
let currentScene;

// Scenes
const LoadingScene = new Scene([
    new Object(120, 780, function() {
        ctx.fillStyle = "orange";
        ctx.fillRect(this.x, this.y, this.data.loadingProgress, 120);
    }, function(elapsed) {
        this.data.loadingProgress = this.data.loadingProgress ?? 0
        this.data.loadingProgress += elapsed;
        if (this.data.loadingProgress >= 760) {
            this.data.loadingProgress = 760
            currentScene = MainScene
        }
    }),
    new ImageObject(20, 20, "/img/test.png")
]);

const MainScene = new Scene([
    new ButtonObject(100, 100, 100, 40, function() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }, function() {
        socket.emit("test", "wingmill");
        alert("Ow");
    })
])

socket.on()
// Main Code
function initialize() {
    onresize = resize;
    resize();
    currentScene = LoadingScene;

    requestAnimationFrame(loop);
}

function update(elapsed) {
    currentScene?.update(elapsed);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentScene?.draw();
}

let lastRender = 0;
function loop(dt) {
    const elapsed = dt - lastRender;

    update(elapsed);
    draw();

    lastRender = dt;
    requestAnimationFrame(loop);
}

canvas.addEventListener("click", function(e) {
    const scale = EXPECTED_HEIGHT / innerHeight;
    const [mx, my] = [e.clientX * scale, e.clientY * scale];

    currentScene?.handleClick(mx, my);
});

function resize() {
    const ar = innerWidth / innerHeight;
    canvas.width = EXPECTED_HEIGHT * ar;
    canvas.height = EXPECTED_HEIGHT;
}

initialize();

export { ctx, canvas }
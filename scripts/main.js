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
    new Object(() => [120, 780], function() {
        const [x, y] = this.position()
        ctx.fillStyle = "orange";
        ctx.fillRect(x, y, this.data.loadingProgress, 120);
    }, function(elapsed) {
        this.data.loadingProgress = this.data.loadingProgress ?? 0 
        this.data.loadingProgress += elapsed;
        if (this.data.loadingProgress >= 760) {
            this.data.loadingProgress = 760;
            currentScene = MainScene;
        }
    }),
    new ImageObject(() => [20, 20], "/img/test.png")
]);

const MainScene = new Scene([new Object(() => [10, 10],
    function() {
        const [x, y] = this.position()
        ctx.fillStyle = "yellow";
        ctx.fillRect(x, y, canvas.width, canvas.height);
    }, 
    function(){}
),
    new ButtonObject(() => [10, 10], () => [300, canvas.height/2], function() {
        const [x, y] = this.position()
        const [w, h] = this.dimensions()
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, w, h);
    }, function() {
        socket.emit("test", "if you can read this, the test worked  ");
        alert("emitting test...");
    })]);

socket.on('test-two', (msg) => {
    console.log("SECOND TEST: " + msg);
});

function getCanvas(){
    return canvas;
}

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
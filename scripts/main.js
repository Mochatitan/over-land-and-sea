import { Scene, Object, ImageObject } from './scene.js'

/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

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
        this.data.loadingProgress = Math.min(this.data.loadingProgress, 760)
    }),
    new ImageObject(20, 20, "/public/img/test.png")
]);

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
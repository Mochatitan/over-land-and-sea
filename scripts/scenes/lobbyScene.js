import { Scene, Object, ImageObject, ButtonObject, TextObject } from "../scene.js";
import { ctx, canvas } from '../main.js';
import { MultiplayerLobbiesScene } from "./multiplayerlobbies.js";
import { SceneManager } from "../main.js";
import { socket } from "./multiplayerlobbies.js";

export const LobbyScene = new Scene([
    new Object(() => [10, 10],
        function () {
            const [x, y] = this.position()
            ctx.fillStyle = "orange";
            ctx.fillRect(x, y, canvas.width, canvas.height);

            //draw your flag here
            ctx.fillStyle = "cyan";
            ctx.fillRect(100, 80, canvas.width / 2, canvas.height - 160);

            // Draw the user-drawn strokes
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < this.parentScene.data.drawnLines.length; i++) {
                let line = this.parentScene.data.drawnLines[i];
                ctx.moveTo(line[0].x, line[0].y);
                for (let j = 1; j < line.length; j++) {
                    ctx.lineTo(line[j].x, line[j].y);
                }
            }
            ctx.stroke();
        },
        function () { }
    ),
    new ButtonObject(() => [(canvas.width / 2) - 150, canvas.height / 2], () => [300, 100], function () {
        const [x, y] = this.position()
        const [w, h] = this.dimensions()
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, w, h);
    }, function () {
        SceneManager.currentScene = MultiplayerLobbiesScene;
    }),
    new TextObject("SIGmA", () => [(100), (100)], () => [100, 100]),
]);

// Initialize drawing-related variables
LobbyScene.data = {
    drawing: false,   // Tracks if the user is currently drawing
    drawnLines: []    // Stores all drawn lines (each line is an array of points)
};

// Define the drawing area (cyan rectangle)
let drawArea = {};

// Function to check if mouse is inside the drawing area
function isInsideDrawArea(mx, my) {
    drawArea = {
        x: 100,
        y: 80,
        width: canvas.width / 2,
        height: canvas.height - 160
    }
    return mx > drawArea.x && mx < drawArea.x + drawArea.width &&
        my > drawArea.y && my < drawArea.y + drawArea.height;
}

// Add event listeners for drawing
addEventListener("mousedown", function (e) {
    if (!canvas) return;
    const scale = canvas.height / innerHeight; // Dynamic scaling
    const mx = e.clientX * scale;
    const my = e.clientY * scale;

    if (isInsideDrawArea(mx, my)) {
        LobbyScene.data.drawing = true;
        LobbyScene.data.drawnLines.push([{ x: mx, y: my }]); // Start a new stroke
    }
});

addEventListener("mousemove", function (e) {
    if (!LobbyScene.data.drawing || !canvas) return;

    const scale = canvas.height / innerHeight; // Dynamic scaling
    const mx = e.clientX * scale;
    const my = e.clientY * scale;

    if (isInsideDrawArea(mx, my)) {
        let currentLine = LobbyScene.data.drawnLines[LobbyScene.data.drawnLines.length - 1];
        currentLine.push({ x: mx, y: my });
    }
});

addEventListener("mouseup", function () {
    LobbyScene.data.drawing = false;
});

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

// Initialize drawing-related data
LobbyScene.data.drawing = false;
LobbyScene.data.drawnLines = [];

// Add event listeners for drawing
// canvas.addEventListener("mousedown", function (e) {
//     const scale = EXPECTED_HEIGHT / innerHeight;
//     const [mx, my] = [e.clientX * scale, e.clientY * scale];

//     // Check if inside the cyan rectangle
//     if (mx > 100 && mx < 100 + canvas.width / 2 && my > 80 && my < canvas.height - 80) {
//         LobbyScene.data.drawing = true;
//         LobbyScene.data.drawnLines.push([{ x: mx, y: my }]); // Start a new stroke
//     }
// });

// canvas.addEventListener("mousemove", function (e) {
//     if (!LobbyScene.data.drawing) return;

//     const scale = EXPECTED_HEIGHT / innerHeight;
//     const [mx, my] = [e.clientX * scale, e.clientY * scale];

//     // Add point to the last stroke if within bounds
//     if (mx > 100 && mx < 100 + canvas.width / 2 && my > 80 && my < canvas.height - 80) {
//         let currentLine = LobbyScene.data.drawnLines[LobbyScene.data.drawnLines.length - 1];
//         currentLine.push({ x: mx, y: my });
//     }
// });

// canvas.addEventListener("mouseup", function () {
//     LobbyScene.data.drawing = false;
// });
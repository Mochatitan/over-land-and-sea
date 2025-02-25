import { Scene, Object, ImageObject, ButtonObject, TextObject } from "../scene.js";
import { ctx, canvas } from '../main.js';
import { MultiplayerLobbiesScene } from "./multiplayerlobbies.js";
import { SceneManager } from "../main.js";
import { socket } from "./multiplayerlobbies.js";

//let canvas = document.getElementById("canvas");

// Grid Settings
const GRID_SIZE = 16;  // Change this for bigger/smaller pixels
const ROWS = 15;       // Number of rows
const COLS = 30;       // Number of columns

// Create a 2D grid filled with 0 (empty pixels)
let grid = new Array(ROWS).fill(null).map(() => new Array(COLS).fill(0));

// Define the drawing area (cyan rectangle)
const drawArea = {
    x: 100,
    y: 80,
    width: 1200,
    height: 600
};

// Calculate pixel size based on grid dimensions
const CELL_W = drawArea.width / COLS;
const CELL_H = drawArea.height / ROWS;

// Mouse state
let drawing = false;

// Converts mouse position to grid coordinates
function getGridCoords(mx, my) {
    let col = Math.floor((mx - drawArea.x) / CELL_W);
    let row = Math.floor((my - drawArea.y) / CELL_H);
    return { row, col };
}

// Check if mouse is inside the draw area
function isInsideDrawArea(mx, my) {
    return mx >= drawArea.x && mx < drawArea.x + drawArea.width &&
        my >= drawArea.y && my < drawArea.y + drawArea.height;
}

// Add event listeners for drawing
addEventListener("mousedown", function (e) {
    if (!canvas) return;
    const scale = canvas.height / innerHeight; // Dynamic scaling
    const mx = e.clientX * scale;
    const my = e.clientY * scale;

    if (isInsideDrawArea(mx, my)) {
        drawing = true;
        let { row, col } = getGridCoords(mx, my);
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
            grid[row][col] = 1; // Mark cell as "drawn"
        }
    }
});

addEventListener("mousemove", function (e) {
    if (!drawing || !canvas) return;

    const scale = canvas.height / innerHeight;
    const mx = e.clientX * scale;
    const my = e.clientY * scale;

    if (isInsideDrawArea(mx, my)) {
        let { row, col } = getGridCoords(mx, my);
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
            grid[row][col] = 1; // Mark cell as "drawn"
        }
    }
});

addEventListener("mouseup", function () {
    drawing = false;
});

// Define the Lobby Scene
export const LobbyScene = new Scene([
    new Object(() => [10, 10], function () {
        const [x, y] = this.position();
        ctx.fillStyle = "orange";
        ctx.fillRect(x, y, canvas.width, canvas.height);

        // Draw cyan rectangle (drawing area)
        ctx.fillStyle = "cyan";
        ctx.fillRect(drawArea.x, drawArea.y, drawArea.width, drawArea.height);

        // Draw the grid
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (grid[r][c] === 1) {
                    ctx.fillStyle = "black"; // Drawn pixels
                    ctx.fillRect(
                        drawArea.x + c * CELL_W,
                        drawArea.y + r * CELL_H,
                        CELL_W,
                        CELL_H
                    );
                }
            }
        }

        // Draw grid lines (optional)
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 1;
        for (let r = 0; r <= ROWS; r++) {
            let y = drawArea.y + r * CELL_H;
            ctx.beginPath();
            ctx.moveTo(drawArea.x, y);
            ctx.lineTo(drawArea.x + drawArea.width, y);
            ctx.stroke();
        }
        for (let c = 0; c <= COLS; c++) {
            let x = drawArea.x + c * CELL_W;
            ctx.beginPath();
            ctx.moveTo(x, drawArea.y);
            ctx.lineTo(x, drawArea.y + drawArea.height);
            ctx.stroke();
        }
    }),
    new ButtonObject(() => [(canvas.width / 2) + 300, canvas.height / 2], () => [300, 100], function () {
        const [x, y] = this.position();
        const [w, h] = this.dimensions();
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, w, h);
    }, function () {
        //SceneManager.currentScene = MultiplayerLobbiesScene;
        console.log(grid[3][3]);
    }),
    new TextObject("SIGmA", () => [100, 100], () => [100, 100]),
]);

// Initialize scene data
LobbyScene.data = {
    drawing: false,
};

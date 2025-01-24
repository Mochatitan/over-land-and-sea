import { Artist } from './artist.js'

/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const artist = new Artist();

var state = 'loading';
//loading, title, settings, lobby, game
var gamestate = 'unstarted';
var loadingProgress = 0;

const image = new Image();
var loaded = false;
image.src = '/img/screens/loadingscreen.png';
image.onload = () => {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Adjust the dimensions as needed
  loaded = true;
};
image.onerror = () => {
  console.error('Failed to load the image.');
};



function update(progress) {
  // Update the state of the world for the elapsed time since last render
  if (loadingProgress < 760) {
    loadingProgress += 1;
  } else {
    state = 'title';
  }
}

function draw() {
  if (state == 'loading') {
    drawLoadingScreen();
  }
  if (state == 'title') {
    drawTitleScreen();
  }

}

function loop(timestamp) {
  var progress = timestamp - lastRender;

  update(progress);
  draw();

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);


canvas.addEventListener("mousedown", async function (e) {
  const rect = canvas.getBoundingClientRect();
  let mouseX = e.clientX - rect.x;
  let mouseY = e.clientY - rect.y;



  if (mouseX >= 400 && mouseX <= 600 && mouseY >= 540 && mouseY <= 610) {
    console.log("button clicked");
  }

  console.log(mouseX);
  console.log(mouseY);
});


function drawLoadingScreen() {
  if (loaded) {
    //ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Adjust the dimensions as needed
    ctx.fillStyle = "orange";
    ctx.fillRect(120, 780, loadingProgress, 120);
  }
}
function drawTitleScreen() {

  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, 1000, 1000);

  ctx.fillStyle = "red";
  ctx.fillRect(200, 140, 200, 70);
}

// function drawChessboard() {
//   // draw a checkered background
//   ctx.fillStyle = "white";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   ctx.fillStyle = "black";
//   for (let row = 0; row < ROWS; row++) {
//     for (let col = 0; col < COLUMNS; col++) {
//       // only color every other tile
//       if ((row + col) % 2 == 1) {
//         // draw a square tile at the current row/column position
//         ctx.fillRect(col * WIDTH, row * HEIGHT, WIDTH, HEIGHT);
//       }

//     }
//   }
// }


export { WIDTH, HEIGHT, ctx, canvas }
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let frames = 0;
let liveCells = new Set();
let camera;
let prevCamera;
let prevMouse;
let zoom = 20;
let mouseIsDown = false;

function showGridLines() {
  ctx.beginPath();
  for (let i = 0; i < canvas.width; i += zoom) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
  }
  for (let i = 0; i < canvas.height; i += zoom) {
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
  }
  ctx.stroke();
  ctx.closePath();
}

function displayGrid() {
  showGridLines();
}

function init() {
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  canvas.width = 600;
  canvas.height = 600;

  camera = { x: 0, y: 0 };
  prevMouse = { x: 0, y: 0 };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(150, 150, 150)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(camera.x, camera.y);
  displayGrid();
  ctx.restore();

  frames++;
  requestAnimationFrame(draw);
}

init();
draw();

// Mouse events
canvas.addEventListener("mousedown", (e) => {
  mouseIsDown = true;
  prevMouse.x = e.offsetX;
  prevMouse.y = e.offsetY;
  prevCamera = { ...camera };
});

canvas.addEventListener("mouseup", (e) => {
  mouseIsDown = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (mouseIsDown) {
    camera.x = e.offsetX - prevMouse.x + prevCamera.x;
    camera.y = e.offsetY - prevMouse.y + prevCamera.y;
  }
});

canvas.addEventListener("wheel", (e) => {
  if (e.deltaY > 0) {
    // scrolling down
    zoom -= 1;
    if (zoom < 5) {
      zoom = 5;
    }
  } else {
    // scrolling up
    zoom += 1;
  }
});

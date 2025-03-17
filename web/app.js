const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const fps = 5;
let frames = 0;
let liveCells = new Set([
  JSON.stringify({ x: 0, y: 1 }),
  JSON.stringify({ x: 1, y: 2 }),
  JSON.stringify({ x: 2, y: 0 }),
  JSON.stringify({ x: 2, y: 1 }),
  JSON.stringify({ x: 2, y: 2 }),
]);
let camera, prevCamera, prevMouse;
let zoom = 20;
let mouseIsDown = false;

function init() {
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  canvas.width = 800;
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

  liveCells = getNextGeneration(liveCells);

  frames++;
  setTimeout(() => {
    requestAnimationFrame(draw);
  }, 1000 / fps);
}

function getNextGeneration(liveCells) {
  const neighborCount = new Map();
  const deltas = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
    [0, 1],
  ];

  for (const cellString of liveCells) {
    const cell = JSON.parse(cellString);
    for (const delta of deltas) {
      const neighbor = JSON.stringify({
        x: cell.x + delta[1],
        y: cell.y + delta[0],
      });

      neighborCount.set(neighbor, (neighborCount.get(neighbor) ?? 0) + 1);
    }
  }

  let newLiveCells = new Set();
  for (const [cellString, count] of neighborCount) {
    let isLiveCell = liveCells.has(cellString);

    // live cell with < 2 neighbors die
    // live cell with > 3 neighbors die

    // live cell with 2 or 3 neighbors live
    if (isLiveCell && (count === 2 || count === 3)) {
      newLiveCells.add(cellString);
    }

    // dead cell with 3 neighbors spawn
    else if (!isLiveCell && count === 3) {
      newLiveCells.add(cellString);
    }
  }

  return newLiveCells;
}

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
  const gridWidth = Math.ceil(canvas.width / zoom);
  const gridHeight = Math.ceil(canvas.height / zoom);

  ctx.beginPath();
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (liveCells.has(JSON.stringify({ x, y }))) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(x * zoom, y * zoom, zoom, zoom);
      }
    }
  }
  ctx.closePath();

  showGridLines();
}

// function calls

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
    zoom -= 5;
    if (zoom < 5) {
      zoom = 5;
    }
  } else {
    // scrolling up
    zoom += 5;
  }
});

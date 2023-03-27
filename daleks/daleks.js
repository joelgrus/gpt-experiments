// Define variables and constants
const GRID_SIZE = 10;
let playerPosition, dalekPositions, pilePositions, gameOver;

// Set up the game grid
const gameGrid = document.getElementById("game-grid");
for (let i = 0; i < GRID_SIZE; i++) {
  const row = document.createElement("div");
  row.classList.add("row");
  for (let j = 0; j < GRID_SIZE; j++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    row.appendChild(cell);
  }
  gameGrid.appendChild(row);
}

// Initialize the game state
playerPosition = [Math.floor(GRID_SIZE / 2), Math.floor(GRID_SIZE / 2)];
dalekPositions = [];
pilePositions = [];
gameOver = false;

// Add event listeners for player movement
document.addEventListener("keydown", (event) => {
  if (gameOver) {
    return;
  }
  let dx = 0,
    dy = 0;
  console.log(event.key);

  switch (event.key) {
    case "W":
    case "w":
      dy = -1;
      break;
    case "X":
    case "x":
      dy = 1;
      break;
    case "A":
    case "a":
      dx = -1;
      break;
    case "D":
    case "d":
      dx = 1;
      break;
    case "Q":
    case "q":
      dx = -1;
      dy = -1;
      break;
    case "E":
    case "e":
      dx = 1;
      dy = -1;
      break;
    case "Z":
    case "z":
      dx = -1;
      dy = 1;
      break;
    case "C":
    case "c":
      dx = 1;
      dy = 1;
      break;
    case "S":
      dx = 0;
      dy = 0;
      break;

    default:
      return;
  }
  const newPosition = [playerPosition[0] + dy, playerPosition[1] + dx];
  if (
    newPosition[0] < 0 ||
    newPosition[0] >= GRID_SIZE ||
    newPosition[1] < 0 ||
    newPosition[1] >= GRID_SIZE
  ) {
    return;
  }
  playerPosition = newPosition;
  updateGrid();
  updateGame();
});

// Add event listener for teleportation
document.getElementById("teleport-button").addEventListener("click", () => {
  if (gameOver) {
    return;
  }
  let newPosition = [
    Math.floor(Math.random() * GRID_SIZE),
    Math.floor(Math.random() * GRID_SIZE),
  ];
  while (
    dalekPositions.some(
      (p) => p[0] === newPosition[0] && p[1] === newPosition[1]
    ) ||
    (newPosition[0] === playerPosition[0] &&
      newPosition[1] === playerPosition[1])
  ) {
    newPosition = [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE),
    ];
  }
  playerPosition = newPosition;
  updateGame();
});

// Update the game state and grid
function updateGame() {
  // Move the Daleks towards the player
  for (let i = 0; i < dalekPositions.length; i++) {
    const dalekPosition = dalekPositions[i];
    let dx = Math.sign(playerPosition[1] - dalekPosition[1]);
    let dy = Math.sign(playerPosition[0] - dalekPosition[0]);
    if (Math.random() < 0.5) {
      [dx, dy] = [dy, dx];
    }
    const newDalekPosition = [dalekPosition[0] + dy, dalekPosition[1] + dx];
    if (
      newDalekPosition[0] < 0 ||
      newDalekPosition[0] >= GRID_SIZE ||
      newDalekPosition[1] < 0 ||
      newDalekPosition[1] >= GRID_SIZE
    ) {
      continue;
    }
    if (
      newDalekPosition[0] === playerPosition[0] &&
      newDalekPosition[1] === playerPosition[1]
    ) {
      gameOver = true;
      document.getElementById("game-over-message").textContent =
        "You were caught by a Dalek!";
      return;
    }
    for (let j = 0; j < dalekPositions.length; j++) {
      if (j === i) {
        continue;
      }
      if (
        newDalekPosition[0] === dalekPositions[j][0] &&
        newDalekPosition[1] === dalekPositions[j][1]
      ) {
        pilePositions.push(newDalekPosition);
        dalekPositions.splice(j, 1);
        j--;
        break;
      }
    }
    dalekPosition[0] = newDalekPosition[0];
    dalekPosition[1] = newDalekPosition[1];
  }

  updateGrid();
}

function updateGrid() {
  // Update the game grid
  const cells = gameGrid.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.classList.remove("player", "dalek", "pile");
  });

  cells[playerPosition[0] * GRID_SIZE + playerPosition[1]].classList.add(
    "player"
  );
  dalekPositions.forEach((dalekPosition) => {
    cells[dalekPosition[0] * GRID_SIZE + dalekPosition[1]].classList.add(
      "dalek"
    );
  });
  pilePositions.forEach((pilePosition) => {
    cells[pilePosition[0] * GRID_SIZE + pilePosition[1]].classList.add("pile");
  });
}

// Use the Sonic Screwdriver
document.getElementById("sonic-screwdriver").addEventListener("click", () => {
  if (gameOver) {
    return;
  }
  for (let i = 0; i < dalekPositions.length; i++) {
    const dalekPosition = dalekPositions[i];
    if (
      Math.abs(dalekPosition[0] - playerPosition[0]) <= 1 &&
      Math.abs(dalekPosition[1] - playerPosition[1]) <= 1
    ) {
      pilePositions.push(dalekPosition);
      dalekPositions.splice(i, 1);
      i--;
    }
  }
  updateGame();
});

// Initialize the Daleks
function initializeDaleks() {
  while (dalekPositions.length < 10) {
    const dalekPosition = [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE),
    ];
    if (
      dalekPosition[0] === playerPosition[0] &&
      dalekPosition[1] === playerPosition[1]
    ) {
      continue;
    }
    if (
      dalekPositions.some(
        (p) => p[0] === dalekPosition[0] && p[1] === dalekPosition[1]
      )
    ) {
      continue;
    }
    dalekPositions.push(dalekPosition);
  }
}

// Start the game
initializeDaleks();
updateGrid();
updateGame();

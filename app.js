class Player {
  constructor(hull, firepower, accuracy) {
    this.hull = hull;
    this.firepower = firepower;
    this.accuracy = accuracy;
  }
  attack(target) {
    if (Math.random() < this.accuracy) {
      logMessage("Player hits alien ship!");
      target.takeDamage(this.firepower);
    } else {
      logMessage("Player misses!");
    }
  }
  takeDamage(damage) {
    this.hull -= damage;
    updatePlayerHull();
    logMessage(`Player takes ${damage} damage. Hull remaining: ${this.hull}`);
  }
  isDestroyed() {
    return this.hull <= 0;
  }
}

class Alien {
  constructor(id, hull, firepower, accuracy) {
    this.id = id;
    this.hull = hull;
    this.firepower = firepower;
    this.accuracy = accuracy;
  }
  attack(target) {
    if (Math.random() < this.accuracy) {
      logMessage("Alien hits player ship!");
      target.takeDamage(this.firepower);
    } else {
      logMessage("Alien misses!");
    }
  }
  takeDamage(damage) {
    this.hull -= damage;
    updateAlienHull(this.id, this.hull);
    logMessage(`Alien takes ${damage} damage. Hull remaining: ${this.hull}`);
  }
  isDestroyed() {
    return this.hull <= 0;
  }
}

// Utility function to log messages
function logMessage(message, color = "#fff") {
  const gameStatus = document.getElementById("game-status");
  const messageElement = document.createElement("p");
  messageElement.style.color = color;
  messageElement.textContent = message;
  gameStatus.appendChild(messageElement);
  gameStatus.scrollTop = gameStatus.scrollHeight;
}

// Update the player's hull in html
function updatePlayerHull() {
  document.getElementById("player-hull").textContent = `Hull: ${player.hull}`;
}

// Update an alien's hull in html
function updateAlienHull(id, hull) {
  const alienHull = document.getElementById(`alien-hull-${id}`);
  alienHull.textContent = `Hull: ${hull}`;
}

const player = new Player(20, 5, 0.7);
let alienShips = [];
let currentAlien = 0;
let gameOver = false;
let destroyedAliens = 0;

function createAlienShips() {
  alienShips = [];
  const alienContainer = document.getElementById("alien-ships");
  alienContainer.innerHTML = ""; // Clear any existing alien ships

  for (let i = 0; i < 6; i++) {
    const hull = generateRandomNumber(4, 7);
    const firepower = generateRandomNumber(2, 4); // between 2 and 4
    const accuracy = Math.random() * (0.8 - 0.6) + 0.6; // between 0.6 and 0.8
    const alien = new Alien(i, hull, firepower, accuracy);
    alienShips.push(alien);
    // Create GUI elements for the alien ship
    const alienElement = document.createElement("div");
    alienElement.classList.add("alien-container");

    const alienShipIcon = document.createElement("img");
    alienShipIcon.src =
      "https://static.vecteezy.com/system/resources/previews/023/673/668/non_2x/alien-spaceship-ai-generative-free-png.png";
    alienShipIcon.classList.add("alien-ship");
    alienShipIcon.id = `alien-${i}`;

    const alienHull = document.createElement("p");
    alienHull.id = `alien-hull-${i}`;
    alienHull.textContent = `Hull: ${hull}`;

    alienElement.appendChild(alienShipIcon);
    alienElement.appendChild(alienHull);
    alienContainer.appendChild(alienElement);
  }
}

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Attack button click event
document.getElementById("attack-btn").addEventListener("click", function () {
  if (gameOver) {
    return;
  }

  logMessage(`\nAttacking alien ship ${currentAlien + 1}...`);
  player.attack(alienShips[currentAlien]);

  if (alienShips[currentAlien].isDestroyed()) {
    logMessage(`Alien ship ${currentAlien + 1} is destroyed!`);
    destroyedAliens++;
    currentAlien++;
    if (currentAlien >= alienShips.length) {
      logMessage("You have destroyed all alien ships. You win!", "green");
      logMessage(`You destroyed all ${destroyedAliens} alien ships.`, "green");
      logMessage(`Your remaining hull: ${player.hull}`, "green");
      gameOver = true;
    }
  } else {
    logMessage(`Alien ship ${currentAlien + 1} is attacking...`);
    alienShips[currentAlien].attack(player);

    if (player.isDestroyed()) {
      logMessage("Your ship was destroyed. You lose.", "red");
      logMessage(`You destroyed ${destroyedAliens} alien ships.`, "red");
      logMessage(`Your remaining hull: 0`, "red");
      gameOver = true;
    }
  }
});

// retreat btn onclick
document.getElementById("retreat-btn").addEventListener("click", () => {
  if (gameOver) {
    return;
  }
  logMessage("You retreated. Game over.", "red");
  logMessage(`You destroyed ${destroyedAliens} alien ships.`, "red");
  logMessage(`Your remaining hull: ${player.hull}`, "red");
  gameOver = true;
});

// start the game
createAlienShips();

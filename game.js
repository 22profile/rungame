// game.js

let playerX = 50;
let playerY = 50;
const playerSpeed = 5;
let gameStarted = false;
let startTime = 0;
let elapsedTime = 0;
let recordTime = getRecordFromLocalStorage();

let zombies = [];
const zombieSpeed = 2;
const zombieSize = 50;
let spawnInterval = 150; 


function createZombie() {
  let side = Math.floor(random(4));
  let zombie = {
    x: 0,
    y: 0,
    move: function () {
      if (playerX < this.x) {
        this.x -= zombieSpeed;
      } else {
        this.x += zombieSpeed;
      }
      if (playerY < this.y) {
        this.y -= zombieSpeed;
      } else {
        this.y += zombieSpeed;
      }
    },
    display: function () {
      fill(0, 255, 0);
      rect(this.x, this.y, zombieSize, zombieSize);
    },
    initializePosition: function () {
      switch (side) {
        case 0:
          this.x = random(width);
          this.y = -zombieSize;
          break;
        case 1:
          this.x = random(width);
          this.y = height;
          break;
        case 2:
          this.x = -zombieSize;
          this.y = random(height);
          break;
        case 3:
          this.x = width;
          this.y = random(height);
          break;
      }
    },
  };
  zombie.initializePosition();
  return zombie;
}


function setup() {
  createCanvas(windowWidth * 0.99, windowHeight * 0.975);
  window.addEventListener("focus", windowFocus);
  window.addEventListener("blur", windowBlur);
  startTime = getCurrentTime() - elapsedTime;
}

function windowFocus() {
  if (gameStarted) {
    loop();
    startTime = getCurrentTime() - elapsedTime;
  }
}

function windowBlur() {
  if (gameStarted) {
    noLoop();
    elapsedTime = getCurrentTime() - startTime;
  }
}


function draw() {
  background(220);

  if (!gameStarted) {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Нажмите Enter, чтобы начать", width / 2, height / 2);

    if (keyIsDown(ENTER)) {
      gameStarted = true;
      startTime = getCurrentTime();
      saveStartTimeToLocalStorage(startTime);
      zombies = [];
      loop();
    }
  } else {
    if (frameCount % spawnInterval === 0) {
      zombies.push(createZombie());
    }

    for (let i = zombies.length - 1; i >= 0; i--) {
      zombies[i].move();
      zombies[i].display();

      if (
        playerX < zombies[i].x + zombieSize &&
        playerX + 50 > zombies[i].x &&
        playerY < zombies[i].y + zombieSize &&
        playerY + 50 > zombies[i].y
      ) {
        gameStarted = false;
        elapsedTime = getCurrentTime() - startTime;
        if (elapsedTime > recordTime) {
          recordTime = elapsedTime;
          saveRecordToLocalStorage();
        }
        textSize(32);
        textAlign(CENTER, CENTER);
        fill(0, 0, 0);
        text(
          `Ваш результат: ${nf(elapsedTime / 1000, 0, 2)} секунд`,
          width / 2,
          height / 2 + 50
        );
        text(
          `Рекордное время: ${nf(recordTime / 1000, 0, 2)} секунд`,
          width / 2,
          height / 2 + 80
        );
 
		text("Для рестарта нажмите Enter", width / 2, height / 2 - 110);
		elapsedTime = 0;
        noLoop();
      }
    }


    let prevPlayerX = playerX;
    let prevPlayerY = playerY;

    if (keyIsDown(87) && playerY > 0) {
      playerY -= playerSpeed;
    }

    if (keyIsDown(65) && playerX > 0) {
      playerX -= playerSpeed;
    }

    if (keyIsDown(83) && playerY < height - 50) {
      playerY += playerSpeed;
    }

    if (keyIsDown(68) && playerX < width - 50) {
      playerX += playerSpeed;
    }

    fill(255, 0, 0);
    rect(playerX, playerY, 50, 50);

    textSize(16);
    textAlign(LEFT, TOP);
    fill(0);
    text(
      `Прошедшее время: ${nf((getCurrentTime() - startTime) / 1000, 0, 2)} секунд`,
      10,
      10
    );
    text(`Рекордное время: ${nf(recordTime / 1000, 0, 2)} секунд`, 10, 30);
   
  }
}

function saveRecordToLocalStorage() {
  localStorage.setItem("record", recordTime);
}

function getRecordFromLocalStorage() {
  return parseFloat(localStorage.getItem("record")) || 0;
}

function saveStartTimeToLocalStorage(time) {
  localStorage.setItem("startTime", time);
}

function getCurrentTime() {
  return millis();
}

function getElapsedTimeFromLocalStorage() {
  return getCurrentTime() - parseFloat(localStorage.getItem("startTime")) || 0;
}

function keyPressed() {
  if (keyCode === ENTER && !gameStarted) {
    gameStarted = true;
    startTime = getCurrentTime() - elapsedTime;
    saveStartTimeToLocalStorage(startTime);
    zombies = [];
    loop();
  }
}

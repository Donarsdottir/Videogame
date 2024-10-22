let KEY_SPACE = false; // 32
let KEY_UP = false; // 38
let KEY_DOWN = false; // 40
let canvas;
let ctx;
let backgroundImage = new Image();

let rocket = {
  x: 50,
  y: 200,
  width: 100,
  height: 50,
  src: "rocket.png",
  img: new Image(),
};

let ufos = [];
let shots = [];
let gameOver = false;
let createUfoInterval;
let updateInterval;
let ufoSpeed = 5;
let ufoCount = 0;
let shotUfoCount = 0;
let shotInterval;
let score = 10;
let ufoPassedCount = 3;
let speedInterval;
let canShoot = true;

document.onkeydown = function (e) {
  if (e.keyCode == 32) KEY_SPACE = true;
  if (e.keyCode == 38) KEY_UP = true;
  if (e.keyCode == 40) KEY_DOWN = true;
};

document.onkeyup = function (e) {
  if (e.keyCode == 32) KEY_SPACE = false;
  if (e.keyCode == 38) KEY_UP = false;
  if (e.keyCode == 40) KEY_DOWN = false;
};

function startGame() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  loadImages();
  backgroundImage.onload = function () {
    updateInterval = setInterval(update, 1000 / 25);
    createUfoInterval = setInterval(createUfos, 5000);
    shotInterval = setInterval(checkForShoot, 1000 / 10);
    setInterval(checkForCollision, 1000 / 25);
    draw();

    // Start or reset the speed increment interval
    clearInterval(speedInterval);
    speedInterval = setInterval(() => {
      ufoSpeed += 0.5;
    }, 10000);
  };
}

function resetGame() {
  rocket.x = 50;
  rocket.y = 200;
  ufos = [];
  shots = [];
  gameOver = false;
  rocket.img.src = "rocket.png";
  ufoSpeed = 5;
  ufoCount = 0;
  shotUfoCount = 0;
  score = 10;
  ufoPassedCount = 3;

  clearInterval(createUfoInterval);
  clearInterval(updateInterval);
  clearInterval(shotInterval);
  clearInterval(speedInterval);

  shotInterval = null;
  startGame();
}

function checkForCollision() {
  if (gameOver) return;

  ufos.forEach(function (ufo) {
    if (
      rocket.x < ufo.x + ufo.width &&
      rocket.x + rocket.width > ufo.x &&
      rocket.y < ufo.y + ufo.height &&
      rocket.y + rocket.height > ufo.y
    ) {
      rocket.img.src = "boom.png";
      gameOver = true;
      console.log("Rocket Collision!!!");
      setTimeout(() => {
        Swal.fire({
          title: "Game over!",
          text: "Ufo has been hit you",
          icon: "question"
        });
        resetGame();
      }, 500);
      ufos = ufos.filter((u) => u !== ufo);
      ufos.splice(ufoIndex, 1); // Remove the UFO
    }

    shots.forEach((shot, shotIndex) => {
      if (
        shot.x + shot.width > ufo.x &&
        shot.x < ufo.x + ufo.width &&
        shot.y + shot.height > ufo.y &&
        shot.y < ufo.y + ufo.height
      ) {

      ufos.forEach((ufo, ufoIndex) => {
        if (
          !ufo.hit &&
          shot.x + shot.width > ufo.x &&
          shot.x < ufo.x + ufo.width &&
          shot.y + shot.height > ufo.y &&
          shot.y < ufo.y + ufo.height
        ) {
          if (!ufo.hit) {  // Only count if the UFO hasn't been hit yet
            ufo.hit = true;
            ufo.img.src = "boom.png";
            shotUfoCount++; // Only increment when a UFO is actually hit

          score--;

          if (shotUfoCount >= 10) {
            setTimeout(() => {
              alert("You won! You shot 10 UFOs!");
              resetGame();
            }, 500);
          }

          // setTimeout(() => {
          //   if (shotUfoCount >= 10) {
          //     alert("You won! You shot 10 UFOs!");
          //     resetGame();
          //   }
          // }, 1000);

          setTimeout(() => {
            ufos = ufos.filter((u) => u !== ufo);
          }, 2000);

          ufos.splice(ufoIndex, 1);
          shots.splice(shotIndex, 1);
        }
      
  });
}

function createUfos() {
  let ufo = {
    x: 800,
    y: Math.random() * (canvas.height - 40),
    width: 100,
    height: 40,
    src: "spaceship.png",
    img: new Image(),
  };
  ufo.img.src = ufo.src;
  ufos.push(ufo);
}

function checkForShoot() {
  if (KEY_SPACE && canShoot) {
    let shot = {
      x: rocket.x + 110,
      y: rocket.y + 22,
      width: 20,
      height: 4,
      src: "bullet.png",
      img: new Image(),
    };
    shot.img.src = shot.src;
    shots.push(shot);

    canShoot = false;
    setTimeout(() => {
      canShoot = true;
    }, 300);
  }
}

function update() {
  if (KEY_UP && rocket.y > 0) rocket.y -= 4;
  if (KEY_DOWN && rocket.y < canvas.height - rocket.height) rocket.y += 4;

  ufos.forEach(function (ufo, index) {
    if (!ufo.hit) {
      ufo.x -= ufoSpeed;

      if (ufo.x + ufo.width < 0) {
        ufoCount++;
        ufoPassedCount--;
        ufos.splice(index, 1);
      }

      if (ufoCount >= 3) {
        alert("Game Over! Too many UFOs passed!");
        resetGame();
      }
    }
  });

  shots.forEach(function (shot, index) {

    shot.x += 10; 

    if (shot.x > canvas.width) {
      shots.splice(index, 1); 
    }

    if (
      shot.x + shot.width > ufo.x &&
      shot.x < ufo.x + ufo.width &&
      shot.y + shot.height > ufo.y &&
      shot.y < ufo.y + ufo.height
    ) {
      ufo.hit = true;
      ufo.img.src = "boom.png";
      shotUfoCount++;

      if (shotUfoCount >= 10) {
        alert("You won! You shot 10 UFOs!");
        resetGame();
      }

      setTimeout(() => {
        ufos = ufos.filter((u) => u !== ufo);
      }, 2000);
    }
    ufos.splice(ufoIndex, 1);
    shots.splice(shotIndex, 1);
  });
}

function loadImages() {
  backgroundImage.src = "space.jpg";
  rocket.img.src = rocket.src;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0);
  ctx.drawImage(rocket.img, rocket.x, rocket.y, rocket.width, rocket.height);

  ufos.forEach(function (ufo) {
    ctx.drawImage(ufo.img, ufo.x, ufo.y, ufo.width, ufo.height);
  });

  shots.forEach(function (shot) {
    ctx.drawImage(shot.img, shot.x, shot.y, shot.width, shot.height);
  });

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Enemies: " + score, 10, 30);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("UFOs Missed: " + ufoPassedCount, 10, 50);

  requestAnimationFrame(draw);
}

setInterval(() => {
  ufoSpeed += 0.5;
}, 10000);

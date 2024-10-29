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

  // Clear intervals
  clearInterval(createUfoInterval);
  clearInterval(updateInterval);
  clearInterval(shotInterval);
  clearInterval(speedInterval);

  shotInterval = null;
  startGame();
}

function checkForCollision() {
  if (gameOver) return;

  ufos.forEach((ufo, ufoIndex) => {
    // Rocket collision with UFO
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
          text: "You collided with a UFO!",
          icon: "error",
        });
        resetGame();
      }, 500);
      ufos.splice(ufoIndex, 1); // Remove the UFO
    }

    // Shot collision with UFO
    shots.forEach((shot, shotIndex) => {
      if (
        shot.x + shot.width > ufo.x &&
        shot.x < ufo.x + ufo.width &&
        shot.y + shot.height > ufo.y &&
        shot.y < ufo.y + ufo.height
      ) {
        if (!ufo.hit) {
          // Only count if the UFO hasn't been hit yet
          ufo.hit = true;
          ufo.img.src = "boom.png";
          shotUfoCount++; // Only increment when a UFO is actually hit

          // Check if player wins
          if (shotUfoCount >= 10) {
            setTimeout(() => {
              Swal.fire({
                title: "You won!",
                text: "You shot 10 UFOs!",
                icon: "explanation",
              });
              resetGame();
            }, 500);
          }

          // Immediately remove the UFO and shot after the collision
          setTimeout(() => {
            ufos.splice(ufoIndex, 1); // Remove the hit UFO
          }, 1000);
          shots.splice(shotIndex, 1); // Remove the shot that hit the UFO
        }
      }
    });
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
    // Create a new shot only when space is pressed and shooting is allowed
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

    // Set a cooldown to prevent immediate subsequent shots
    canShoot = false;
    setTimeout(() => {
      canShoot = true;
    }, 300); // You can adjust this delay as needed for shot frequency
  }
}

function update() {
  // Move the rocket
  if (KEY_UP && rocket.y > 0) rocket.y -= 4;
  if (KEY_DOWN && rocket.y < canvas.height - rocket.height) rocket.y += 4;

  // Move the UFOs
  // ufos.forEach(function (ufo, index) {
  for (let i = 0; i < ufos.length; i++) {
    let ufo = ufos[i];
    let index = i;
    if (!ufo.hit) {
      ufo.x -= ufoSpeed;

      if (ufo.x + ufo.width < 0) {
        ufoCount++;
        ufos.splice(index, 1);
      }

      if (ufoCount >= 3) {
        // gameOver = true;
        document.body.classList.add("body");

        document.getElementById("canvas").style.display = "none";
        ufos.splice(index, 1);
        ufoCount = -3;
        document.getElementById("planet").classList.add("planet");
        document.getElementById("spaceship").classList.add("spaceship");
        setTimeout(() => {
          Swal.fire({
            title: "Game Over!",
            text: "Too many UFOs passed!",
            icon: "error",
          });
          document.getElementById("planet").classList.remove("planet");
          document.getElementById("spaceship").classList.remove("spaceship");
          document.getElementById("canvas").style.display = "block";
          document.body.classList.remove("body");

          resetGame();
        }, 5000);
        break;
      }
    }
  }
  // });

  // Move the shots
  shots.forEach(function (shot, index) {
    shot.x += 10; // Increase the shot speed to move faster

    if (shot.x > canvas.width) {
      shots.splice(index, 1); // Remove shots that go off the screen
    }
  });
}

function loadImages() {
  backgroundImage.src = "space.jpg";
  rocket.img.src = rocket.src;
}

function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background and rocket
  ctx.drawImage(backgroundImage, 0, 0);
  ctx.drawImage(rocket.img, rocket.x, rocket.y, rocket.width, rocket.height);

  // Draw the UFOs
  ufos.forEach(function (ufo) {
    ctx.drawImage(ufo.img, ufo.x, ufo.y, ufo.width, ufo.height);
  });

  // Draw the shots
  shots.forEach(function (shot) {
    ctx.drawImage(shot.img, shot.x, shot.y, shot.width, shot.height);
  });

  requestAnimationFrame(draw); // Continue drawing on each frame
}

setInterval(() => {
  ufoSpeed += 0.5;
}, 10000);

startGame();

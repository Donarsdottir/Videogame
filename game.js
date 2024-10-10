let KEY_SPACE = false; //32
let KEY_UP = false; //38
let KEY_DOWN = false; //40
let canvas;
let ctx;
let backgroundImage = new Image();

let rocket = {
  x: 50,
  y: 200,
  width: 100,
  height: 50,
  src: "rocket.png",
};

let ufos = [];

document.onkeydown = function (e) {
  if (e.keyCode == 32) {
    KEY_SPACE = true;
  }

  if (e.keyCode == 38) {
    KEY_UP = true;
  }

  if (e.keyCode == 40) {
    KEY_DOWN = true;
  }
};

document.onkeyup = function (e) {
  if (e.keyCode == 32) {
    KEY_SPACE = false;
  }

  if (e.keyCode == 38) {
    KEY_UP = false;
  }

  if (e.keyCode == 40) {
    KEY_DOWN = false;
  }
};

function startGame() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  loadImages();
  setInterval(update, 1000 / 25);
  setInterval(createUfos, 5000);
  setInterval(checkForCollision, 1000 / 25);
  draw();
  console.log("test");
}

function checkForCollision() {
  ufos.forEach(function (ufo) {
    if (
      rocket.x < ufo.x + ufo.width &&
      rocket.x + rocket.width > ufo.x &&
      rocket.y < ufo.y + ufo.height &&
      rocket.y + rocket.height > ufo.y
    ) {
      rocket.img.src = "boom.png";
      console.log("Collision!!!");
      ufos = ufos.filter((u) => u !== ufo);
      // setTimeout(() => {
      //   rocket.img.src = rocket.src;
      // }, 500);
    }

    shots.forEach(function (shot) {
      if (
        shot.x + shot.width > ufo.x &&
        shot.y + shot.height > ufo.y &&
        shot.x < ufo.x &&
        shot.y < ufo.y + ufo.height
      ) {
        ufo.hit = true;
        ufo.img.src = "boom.png";
        console.log("Collision!!!");

        setTimeout(() => {
          ufos = ufos.filter((u) => u != ufo);
        }, 2000);
      }
    });
  });
}

function createUfos() {
  let ufo = {
    x: 800,
    y: 200,
    width: 100,
    height: 40,
    src: "spaceship.png",
    img: new Image(),
  };

  ufo.img.src = ufo.src;

  ufos.push(ufo);
}

function checkForShoot() {
  if (KEY_SPACE) {
    let shot = {
      x: rocket.x + 110,
      y: rocket.y + 22,
      width: 20,
      height: 4,
      src: "bullet.png",
      img: new Image(),
    };
    shot.img.src = shot.src; // Laser-Bild wird geladen.

    shots.push(shot);
  }
}

function update() {
  if (KEY_UP) {
    rocket.y -= 4;
  }

  if (KEY_DOWN) {
    rocket.y += 4;
  }

  ufos.forEach(function (ufo) {
    if (!ufo.hit) {
      ufo.x -= 5;
    }
  });

  shots.forEach(function (shot) {
    shot.x += 15;
  });
}

function loadImages() {
  backgroundImage.src = "space.jpg";
  rocket.img = new Image();
  rocket.img.src = rocket.src;
}

function draw() {
  ctx.drawImage(backgroundImage, 0, 0);
  ctx.drawImage(rocket.img, rocket.x, rocket.y, rocket.width, rocket.height);

  ufos.forEach(function (ufo) {
    ctx.drawImage(ufo.img, ufo.x, ufo.y, ufo.width, ufo.height);
  });

  shots.forEach(function (shot) {
    ctx.drawImage(shot.img, shot.x, shot.y, shot.width, shot.height);
  });

  requestAnimationFrame(draw);
}

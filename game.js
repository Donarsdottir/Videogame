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
  ufos.forEach(function (ufo) {});
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

function update() {
  if (KEY_UP) {
    rocket.y -= 4;
  }

  if (KEY_DOWN) {
    rocket.y += 4;
  }

  ufos.forEach(function (ufo) {
    ufo.x -= 5;
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

  requestAnimationFrame(draw);
}

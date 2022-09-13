// 이미지 로딩

let img = new Image();
img.src = "../static/img/phantom.png";
img.onload = function () {
  window.requestAnimationFrame(gameLoop);
};

// 캔버스 설정

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

// 캐릭터 스케일 설정

const WIDTH = 128;
const HEIGHT = 128;

// 프레임 그리기

function drawFrame(frameX, frameY, canvasX, canvasY) {
  ctx.drawImage(
    img,
    frameX * WIDTH,
    frameY * HEIGHT,
    WIDTH,
    HEIGHT,
    canvasX,
    canvasY,
    WIDTH,
    HEIGHT
  );
}

const FACING_ORIGINAL = 0;
const FACING_LEFT = 1;
const FACING_RIGHT = 2;
const FACING_SMILE = 3;
let currentDirection = FACING_ORIGINAL;
let currentLoopIndex = 0;
let framecount = 0;

// gameLoop 함수 ⓐ

function gameLoop() {
  window.requestAnimationFrame(gameLoop);
}

// 사용자 입력 처리

let keyPresses = {};

window.addEventListener("keydown", keyDownListener, false);
function keyDownListener(event) {
  keyPresses[event.key] = true;
}

window.addEventListener("keyup", keyUpListener, false);
function keyUpListener(event) {
  keyPresses[event.key] = false;
}

// gameLoop 함수 ⓑ

const MOVEMENT_SPEED = 3; // 움직이는 속도
let positionX = 0;
let positionY = 0;

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keyPresses.ArrowUp) {
    positionY -= MOVEMENT_SPEED;
    currentDirection = FACING_ORIGINAL;
  } else if (keyPresses.ArrowDown) {
    positionY += MOVEMENT_SPEED;
    currentDirection = FACING_ORIGINAL;
  }
  if (keyPresses.ArrowLeft) {
    positionX -= MOVEMENT_SPEED;
    currentDirection = FACING_RIGHT;
  } else if (keyPresses.ArrowRight) {
    positionX += MOVEMENT_SPEED;
    currentDirection = FACING_LEFT;
  }

  drawFrame(0, currentDirection, positionX, positionY);
  window.requestAnimationFrame(gameLoop);
}

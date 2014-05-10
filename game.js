"use strict";

var canvas = null;

function getCanvas() {
  if (canvas) {
    return canvas;
  }
  else {
    canvas = document.getElementById('game_scene');
    return canvas;
  }
}

function createSnake(start, size) {
  var x = start[0];
  var y = start[1];

  var snakeCoordinates = [];

  for (var i = 0; i != size; i++) {
    snakeCoordinates.push([x+i,y]);
  }

  return snakeCoordinates;
}

var snake = createSnake([10,10], 4);

// Can contain the following values:
//
// - right
// - left
// - up
// - down
var snakeDirection = 'right';



function convertDirectionToVector(direction) {
  switch(direction) {
    case 'right' : return [  1,  0 ];
    case 'left'  : return [ -1,  0 ];
    case 'up'    : return [  0, -1 ];
    case 'down'  : return [  0,  1 ];
    default:
  }

  // The switch statement should always match
  console.log("Shouldn't be here: @convertDirectionToVector");
  return null;
}



function drawSnake(snake) {
  var fillStyle = 'rgb(0, 200, 0)';

  for (var i = 0; i != snake.length; i++) {
    drawAt(snake[i][0], snake[i][1], fillStyle);
  }
}



function updateSnakePosition(snake, direction) {
  var directionVector = convertDirectionToVector(direction);

  var xVelocity = directionVector[0];
  var yVelocity = directionVector[1];

  // Remove current tail of the snake
  snake.shift();


  // Place the new head of the snake in the correct position
  var headX = snake[snake.length-1][0];
  var headY = snake[snake.length-1][1];

  // Add a new head
  snake.push([headX + xVelocity, headY + yVelocity]);
}

function drawAt(x, y, fillStyle) {
  var canvas = getCanvas().getContext('2d');

  canvas.fillStyle = fillStyle;
  canvas.fillRect(x*25, y*25, 25, 25);
}

function clearScreen() {
  var canvas = getCanvas().getContext('2d');
  canvas.clearRect(0,0,500,500);
}

function detectWallCollision(snake) {

  var snakeHeadX = snake[snake.length-1][0];
  var snakeHeadY = snake[snake.length-1][1];

  if (snakeHeadX > 20 || snakeHeadX < 0) {
    return true;
  }

  if (snakeHeadY > 20 || snakeHeadY < 0) {
    return true;
  }

  return false;
}

function doExplosion(snake) {
  var snakeHeadX = snake[snake.length-1][0];
  var snakeHeadY = snake[snake.length-1][1];

  for (var x = 0; x !== 3; x++) {
    for (var y = 0; y !== 3; y++) {
      drawAt(snakeHeadX-1+x, snakeHeadY-1+y, "rgb(0, 200, 200)");
    }
  }

}

function mainLoop() {
  clearScreen();

  updateSnakePosition(snake, snakeDirection);

  if (detectWallCollision(snake)) {
    doExplosion(snake);
  }

  drawSnake(snake);
  drawFruit(fruitCoordinates);
}

function snakeIsAbleToTurn(snakeDirection, newDirection) {
  if (snakeDirection === newDirection) return false;
  if (snakeDirection === 'up'    && newDirection === 'down')  return false;
  if (snakeDirection === 'down'  && newDirection === 'up')    return false;
  if (snakeDirection === 'left'  && newDirection === 'right') return false;
  if (snakeDirection === 'right' && newDirection === 'left')  return false;

  return true;
}

function changeDirection() {
  switch(snakeDirection) {
    case 'up':    snakeDirection = 'left';  break;
    case 'left':  snakeDirection = 'down';  break;
    case 'down':  snakeDirection = 'right'; break;
    case 'right': snakeDirection = 'up';    break;
  }
}

function processKeyPress(e) {
  console.log("Keycode: " + e.keyCode);

  switch (e.keyCode) {
    case 37: snakeDirection = 'left';  break; // Key code for the left arrow on the keyboard
    case 38: snakeDirection = 'up';    break; // Key code for the up arrow on the keyboard
    case 39: snakeDirection = 'right'; break; // Key code for the right arrow on the keyboard
    case 40: snakeDirection = 'down';  break; // Key code for the down arrow on the keyboard
  }
}

var fruitCoordinates = [];

function containsSnake(snake, x, y) {
  // Indicate if the snake is in position X and Y

  for (var i = 0; i != snake.length; i++) {
    var snakeX = snake[i][0];
    var snakeY = snake[i][1];

    if (snakeX === x && snakeY === y) {
      return true;
    }
  }
  return false;
}

function containsFruit(fruits, x, y) {
  // Indicate whether or not there is a piece of fruit in X Y

  for (var i = 0; i != fruitCoordinates.length; i++) {
    var fruitX = fruitCoordinates[i][0];
    var fruitY = fruitCoordinates[i][1];

    if (fruitX === x && fruitY === y) {
      return true;
    }
  }

  return false;
}

function addFruit() {
  // Add a fruit to a random location not occupied by fruit or snake

  var fruitX = -1;
  var fruitY = -1;

  do {
    fruitX = Math.round(Math.random() * 25);
    fruitY = Math.round(Math.random() * 25);
  } while (containsSnake(snake, fruitX, fruitY) || containsFruit(fruitCoordinates, fruitX, fruitY));

  fruitCoordinates.push([fruitX, fruitY]);
  //
  // At this point in time, "fruit" no longer looks like a real word :(
  //
}

function drawFruit(fruitCoordinates) {
  var fillStyle = 'rgb(200, 0, 0)';

  for (var i = 0; i != fruitCoordinates.length; i++) {
    drawAt(fruitCoordinates[i][0], fruitCoordinates[i][1], fillStyle);
  }
}


function initialize() {
  canvas = getCanvas();

  window.setInterval(mainLoop, 500);
  //window.setInterval(changeDirection, 5000);
  window.addEventListener("keypress", processKeyPress, false);
  // Add initial fruit
  for (var i = 0; i != 3; i++) {
    addFruit();
  }

  window.setInterval(addFruit, 5000);
}

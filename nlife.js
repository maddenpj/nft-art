//  nlife-color
//     This is a modified version of the nlife core that adds color.

//      * Each cell has a color attribute. When generating the initial
//        board, colors are randomly assigned.
//      * When a new cell is created it inherits the most prevalent
//        color of the surrounding cells, or if there is a tie, any
//        one of the the top colors may be used.

//  GitHub: https://github.com/DougHaber/nlife-color


var life = {
  version        : '0.5-color',
  updateTime     : 50, // Wait time between cycles (no proper timing loop)
  chanceOfLife   : 6,
  scale          : 10,
  canvas         : null,  // Set during init
  frontBoard     : [], // The grid
  backBoard      : [], // Temporary grid for simultaneous stepping
  currentBoard   : 0, // 0 = Front, 1 = back
  numCycles      : 0
};


// **********************************************************
// * Life Itself - Game Code
// **********************************************************

function isAlive(x, y, board) {
  return ! ((x < 0 ||
    y < 0 ||
    x >= life.boardWidth ||
    y >= life.boardHeight ||
    ! board[x][y]))
}


function countNeighbors(posx, posy, board) {
  return (isAlive(posx - 1, posy - 1, board) +
    isAlive(posx - 1, posy, board) +
    isAlive(posx - 1, posy + 1, board) +
    isAlive(posx, posy - 1, board) +
    isAlive(posx, posy + 1, board) +
    isAlive(posx + 1, posy - 1, board) +
    isAlive(posx + 1, posy, board) +
    isAlive(posx + 1, posy + 1, board)
  );
}

function wave(x, y, dt, phase, freq) {
  var len = Math.sqrt((x*x) + (y*y))
  var sine = 0.5 + (Math.sin((len*freq) - (dt * phase))/ 2);
  var rValue = Math.floor(sine * 255)
  return rValue;
}

function polarWave(x, y, dt) {

  var theta = Math.atan(y / x)
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


function getColor(xPos, yPos, numCycles, board) {
  var x, y;
  var color = {};
  var dominant;
  var dominantCount = 0;

  // for (x = xPos - 1; x <= xPos + 1; x++) {
    // if (! board[x]) {
      // continue;
    // }

    // for (y = yPos - 1; y <= yPos + 1; y++) {
      // if (board[x][y]) {
        // if (color[board[x][y]]) {
          // color[board[x][y]]++;
        // } else {
          // color[board[x][y]] = 1;
        // }
      // }
    // }
  // }

  // for (x in color) {
    // if (color[x] > dominantCount) {
      // dominant = x;
      // dominantCount = color[x];
    // }
  // }


  // var modifiedDominant;
  // if (hexToRgb(dominant) != null) {
    // var dominantRgb = hexToRgb(dominant);
    // modifiedDominant = rgbToHex(wave(xPos, yPos, numCycles), dominantRgb.g, dominantRgb.b);
  // } else {
    // modifiedDominant = dominant;
  // }

  // var color = rgbToHex(wave(xPos, yPos, numCycles, 0), wave(xPos, yPos, numCycles, 0.5), wave(xPos, yPos, numCycles, 1.5))

  var red   = wave(xPos, yPos, numCycles, 1, 1);
  var green = wave(xPos, yPos, numCycles, 1.2, 1.3);
  var blue  = wave(xPos, yPos, numCycles, 2, 0.4);
  var color = rgbToHex(red, green, blue);

  return (color);
}


function testLife(x, y, board) {
  var n = countNeighbors(x, y, board);
  return (getColor(x, y, life.numCycles, board));
  if (isAlive(x, y, board)) {
    return (getColor(x, y, life.numCycles, board));
  } else {
    return false;
  }

  // if (isAlive(x, y, board)) {
    // if ((n < 2) || (n > 3)) {
      // return (false);
    // } else {
      // return (getColor(x, y, life.numCycles, board));
    // }
  // } else if (n == 3) {
    // return (getColor(x, y, life.numCycles, board));
  // } else {
    // return (false);
  // }
}


function doCycle() {
  var x, y;
  var board = life.currentBoard % 2 ? life.frontBoard : life.backBoard;

  if (life.currentBoard) {
    life.currentBoard = 0;
    altBoard = life.frontBoard;
    board = life.backBoard
  }
  else {
    altBoard = life.backBoard;
    board = life.frontBoard
    life.currentBoard = 1;
  }

  for (x = 0; x < life.boardWidth; x++) {
    for (y = 0; y < life.boardHeight; y++) {
      altBoard[x][y] = testLife(x, y, board);
    }
  }

  life.numCycles += 1
  drawBoard(board);
  setTimeout(doCycle, life.updateTime);
}


// **********************************************************
// * Drawing
// **********************************************************

function drawBoard(board) {
  var x, y;
  var boardWidth = life.boardWidth;
  var boardHeight = life.boardHeight;
  var scale = life.scale;

  blankBoard();

  for (x = 0; x < boardWidth; x++) {
    for (y = 0; y < boardHeight; y++) {
      if (board[x][y]) {
        life.context.fillStyle = board[x][y];
        life.context.fillRect(x * scale,
          y * scale,
          scale,
          scale);
      }
    }
  }
}


function blankBoard() {
  life.context.fillStyle = '#000000';
  life.context.fillRect(0, 0, life.canvas.width, life.canvas.height);
}


// **********************************************************
// * Initialization
// **********************************************************

function randomColor() {
  return ('#' + parseInt(Math.random() * 16777215).toString(16));
}


function initBoard() {
  var x, y;

  life.boardHeight = Math.floor(parseInt(life.canvas.height) / life.scale);
  life.boardWidth  = Math.floor(parseInt(life.canvas.width)  / life.scale);
  life.context = life.canvas.getContext('2d');

  for (x = 0; x < life.boardWidth; x++) {
    life.frontBoard[x] = [];
    life.backBoard[x] = [];

    for (y = 0; y < life.boardHeight; y++) {
      // life.frontBoard[x][y] = Math.floor(Math.random() * life.chanceOfLife) == 0 ? randomColor() : false;
      life.frontBoard[x][y] = false;
    }
  }
}


function init() {
  var e;

  life.canvas = document.getElementById("nLifeCanvas");
  life.canvas.height = document.body.clientHeight - life.scale * 4;
  life.canvas.width = document.body.clientWidth - life.scale * 2;
  life.canvas.style.padding = '0px';
  life.canvas.style.margin = '0px';

  if (life.canvas) {
    initBoard();
  }
  else {
    alert("ERROR: Canvas not found. Aborting!\n");
  }

  doCycle();
}


window.onload = init;

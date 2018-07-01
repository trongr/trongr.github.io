/**
 * Wrote this early 2013.
 */
var CANVAS_WIDTH = 0;
var CANVAS_HEIGHT = 0;
var SIZE_CELL = 0;
var SIZE_HALF_CELL = 0;
var NUM_CELLS = 19; // Number of cells on each side of the grid.

var canvas;
var canvasContext;

var gridX, gridY, prevGridX, prevGridY;          // Grid coordinates
var clickX, clickY, prevClickX, prevClickY;      // Grid coordinates

var gridX2, gridY2, prevGridX2, prevGridY2;      // Coordinates for keyboard
var clickX2, clickY2, prevClickX2, prevClickY2;  // player.

var stones; // 2-dimensional array to hold stones
var STONE_EMPTY = 0;
var STONE_BLACK = 1;
var STONE_WHITE = 2;

var TURN_BLACK = 0;
var TURN_WHITE = 1;
var turn = TURN_BLACK; // BLACK goes first.

var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_ENTER = 13;
var KEY_ESC = 27;

var moveSound // Move sound

window.onload = function () {
    canvas = document.getElementById("Grid");

    CANVAS_WIDTH = $("#content").width()
    CANVAS_HEIGHT = $("#content").width()
    SIZE_CELL = Math.floor(CANVAS_WIDTH / (NUM_CELLS + 1));
    SIZE_HALF_CELL = Math.floor(SIZE_CELL / 2);

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    canvas.onmousemove = onCanvasMouseMove;
    canvas.onclick = onCanvasClick;
    canvas.onkeypress = onCanvasKeypress;

    canvasContext = canvas.getContext("2d");
    canvasContext.translate(0.5, 0.5); // This avoids anti-aliasing, so two overlapping lines don't appear darker.

    initBoard();
    drawGrid();
    initReticulum();

    initAudio()
};

function initAudio() {
    moveSound = document.createElement('audio')
    // moveSound.setAttribute('src', './audio/ethniclodrum2.mp3')
    moveSound.setAttribute('src', './audio/knockwood2.mp3')
}

function initReticulum() {
    gridX2 = Math.floor(NUM_CELLS / 2);
    gridY2 = Math.floor(NUM_CELLS / 2);
    redrawCell2(gridX2, gridY2);
}

function redrawCell2(gridX, gridY) {
    if (!isInGrid(gridX, gridY)) {
        return;
    }

    var canvasX = getCanvasCoordinate(gridX);
    var canvasY = getCanvasCoordinate(gridY);

    canvasContext.clearRect(canvasX - SIZE_HALF_CELL, canvasY - SIZE_HALF_CELL, SIZE_CELL, SIZE_CELL);

    var stone = stones[gridX][gridY];
    if (stone == STONE_EMPTY) {
        drawCross(gridX, gridY);
    } else {
        drawStone(canvasX, canvasY, stone);
    }

    if (isCellHighlighted2(gridX, gridY)) {
        highlightCell2(gridX, gridY);
    } else if (isCurrentCell2(gridX, gridY)) {
        reticulo2(canvasX, canvasY);
    }
}

function onCanvasKeypress(e) {
    getMoving2(e.keyCode);
    e.preventDefault(); // Prevents keys from scrolling page.
}

function getMoving2(keyCode) {
    var key;
    switch (keyCode) {
        case KEY_UP:
            key = "UP"; // TODO. Remove these.
            prevGridX2 = gridX2;
            prevGridY2 = gridY2;
            gridY2 = (gridY2 - 1 + NUM_CELLS) % NUM_CELLS;
            break;
        case KEY_DOWN:
            key = "DOWN";
            prevGridX2 = gridX2;
            prevGridY2 = gridY2;
            gridY2 = (gridY2 + 1) % NUM_CELLS;
            break;
        case KEY_LEFT:
            key = "LEFT";
            prevGridX2 = gridX2;
            prevGridY2 = gridY2;
            gridX2 = (gridX2 - 1 + NUM_CELLS) % NUM_CELLS;
            break;
        case KEY_RIGHT:
            key = "RIGHT";
            prevGridX2 = gridX2;
            prevGridY2 = gridY2;
            gridX2 = (gridX2 + 1) % NUM_CELLS;
            break;
        case KEY_ENTER:
            key = "ENTER";
            prevClickX2 = clickX2;
            prevClickY2 = clickY2;
            clickX2 = gridX2;
            clickY2 = gridY2;
            move2(clickX2, clickY2, prevClickX2, prevClickY2);
            moveSound.play()
            break;
        case KEY_ESC:
            key = "ESC";
            canvas.blur(); // Relinguish focus.
            break;
    }
    redrawCell2(prevGridX2, prevGridY2);
    redrawCell2(gridX2, gridY2);
}

function onCanvasClick(e) {
    prevClickX = clickX;
    prevClickY = clickY;
    clickX = gridX;
    clickY = gridY;
    move(clickX, clickY, prevClickX, prevClickY);
    moveSound.play()
}

function getGridCoordinate(canvasCoord) {
    return Math.floor(canvasCoord / SIZE_CELL) - 1;
}

function move(clickX, clickY, prevClickX, prevClickY) {
    if (!isInGrid(clickX, clickY)) {
        return;
    }

    if (stoneExists(clickX, clickY)) {
        removeStone(clickX, clickY);
    } else if (turn == TURN_BLACK) {
        addStone(gridX, gridY, TURN_BLACK);
        turn = TURN_WHITE;
    } else {
        addStone(gridX, gridY, TURN_WHITE);
        turn = TURN_BLACK;
    }

    var coordinates = document.getElementById("WhoseTurnIsIt");
    if (turn == TURN_BLACK) {
        coordinates.innerHTML = "[ BLACK ]";
    } else {
        coordinates.innerHTML = "[ WHITE ]";
    }

    redrawCell(clickX, clickY);
    redrawCell(prevClickX, prevClickY);
}

function move2(clickX, clickY, prevClickX, prevClickY) {
    if (!isInGrid(clickX, clickY)) {
        return;
    }

    if (stoneExists(clickX, clickY)) {
        removeStone(clickX, clickY);
    } else if (turn == TURN_BLACK) {
        addStone(gridX2, gridY2, TURN_BLACK);
        turn = TURN_WHITE;
    } else {
        addStone(gridX2, gridY2, TURN_WHITE);
        turn = TURN_BLACK;
    }

    var coordinates = document.getElementById("WhoseTurnIsIt");
    if (turn == TURN_BLACK) {
        coordinates.innerHTML = "[BLACK]";
    } else {
        coordinates.innerHTML = "[WHITE]";
    }

    redrawCell2(clickX, clickY);
    redrawCell2(prevClickX, prevClickY);
}

function highlightCell(gridX, gridY) {
    var canvasX = getCanvasCoordinate(gridX);
    var canvasY = getCanvasCoordinate(gridY);
    canvasContext.beginPath();
    canvasContext.arc(canvasX, canvasY, SIZE_HALF_CELL - 2, 0, Math.PI * 2);
    canvasContext.strokeStyle = "yellow";
    canvasContext.lineWidth = 2;
    canvasContext.stroke();
}

function highlightCell2(gridX, gridY) {
    var canvasX = getCanvasCoordinate(gridX);
    var canvasY = getCanvasCoordinate(gridY);
    canvasContext.beginPath();
    canvasContext.arc(canvasX, canvasY, SIZE_HALF_CELL - 2, 0, Math.PI * 2);
    canvasContext.strokeStyle = "red";
    canvasContext.lineWidth = 2;
    canvasContext.stroke();
}

function addStone(gridX, gridY, turn) {
    if (turn == TURN_BLACK) {
        stones[gridX][gridY] = STONE_BLACK;
    } else {
        stones[gridX][gridY] = STONE_WHITE;
    }
}

function getCanvasCoordinate(x) {
    return (x + 1) * SIZE_CELL;
}

function redrawCell(gridX, gridY) {
    if (!isInGrid(gridX, gridY)) {
        return;
    }

    var canvasX = getCanvasCoordinate(gridX);
    var canvasY = getCanvasCoordinate(gridY);

    canvasContext.clearRect(canvasX - SIZE_HALF_CELL, canvasY - SIZE_HALF_CELL, SIZE_CELL, SIZE_CELL);

    var stone = stones[gridX][gridY];
    if (stone == STONE_EMPTY) {
        drawCross(gridX, gridY);
    } else {
        drawStone(canvasX, canvasY, stone);
    }

    if (isCellHighlighted(gridX, gridY)) {
        highlightCell(gridX, gridY);
    } else if (isCurrentCell(gridX, gridY)) {
        reticulo(canvasX, canvasY);
    }
}

function isCurrentCell(gridX, gridY) {
    return gridX == this.gridX && gridY == this.gridY;
}

function isCurrentCell2(gridX, gridY) {
    return gridX == this.gridX2 && gridY == this.gridY2;
}

function isCellHighlighted(gridX, gridY) {
    return gridX == clickX && gridY == clickY;
}

function isCellHighlighted2(gridX, gridY) {
    return gridX == clickX2 && gridY == clickY2;
}

function isInGrid(gridX, gridY) {
    return gridX >= 0 && gridX < NUM_CELLS && gridY >= 0 && gridY < NUM_CELLS;
}

function drawStone(canvasX, canvasY, stone) {
    canvasContext.beginPath();
    canvasContext.arc(canvasX, canvasY, SIZE_HALF_CELL, 0, 2 * Math.PI);

    if (stone == STONE_BLACK) {
        canvasContext.fillStyle = "black";
    } else {
        canvasContext.fillStyle = "white";
    }
    canvasContext.fill();

    // If you want to use globalAlpha, you should set it in drawCross as well.
    /* canvasContext.globalAlpha = 0.5; */

    /* canvasContext.strokeStyle = "black";
    canvasContext.lineWidth = ;
    canvasContext.stroke(); */
}

function drawCross(gridX, gridY) {
    var canvasX = getCanvasCoordinate(gridX);
    var canvasY = getCanvasCoordinate(gridY);

    canvasContext.beginPath();

    if (gridX == 0) {
        canvasContext.moveTo(canvasX, canvasY);
        canvasContext.lineTo(canvasX + SIZE_HALF_CELL + 1, canvasY); // These +1 finetunes the cross-ends, so they don't overlap with existing lines.
    } else if (gridX == NUM_CELLS - 1) {
        canvasContext.moveTo(canvasX - SIZE_HALF_CELL, canvasY);
        canvasContext.lineTo(canvasX, canvasY);
    } else {
        canvasContext.moveTo(canvasX - SIZE_HALF_CELL, canvasY);
        canvasContext.lineTo(canvasX + SIZE_HALF_CELL + 1, canvasY);
    }
    if (gridY == 0) {
        canvasContext.moveTo(canvasX, canvasY);
        canvasContext.lineTo(canvasX, canvasY + SIZE_HALF_CELL + 1);
    } else if (gridY == NUM_CELLS - 1) {
        canvasContext.moveTo(canvasX, canvasY - SIZE_HALF_CELL);
        canvasContext.lineTo(canvasX, canvasY);
    } else {
        canvasContext.moveTo(canvasX, canvasY - SIZE_HALF_CELL);
        canvasContext.lineTo(canvasX, canvasY + SIZE_HALF_CELL + 1);
    }

    canvasContext.strokeStyle = "black";
    canvasContext.lineWidth = 1;
    canvasContext.stroke();
}

function removeStone(gridX, gridY) {
    stones[gridX][gridY] = STONE_EMPTY;
}

function stoneExists(gridX, gridY) {
    return stones[gridX][gridY] != STONE_EMPTY;
}

function initBoard() {
    stones = new Array()
    var i, j;
    for (i = 0; i < NUM_CELLS; i++) {
        stones[i] = new Array();
        for (j = 0; j < NUM_CELLS; j++) {
            stones[i][j] = STONE_EMPTY;
        }
    }
}

// Actually, redrawing only a portion of the canvas, cause it's slow to redraw the whole thing.
function redrawCanvas(gridX, gridY, prevGridX, prevGridY) {
    redrawCell(gridX, gridY);
    redrawCell(prevGridX, prevGridY);
}

function isNewCell(oldX, oldY, newX, newY) {
    return oldX != newX || oldY != newY;
}

// The grid is offset from the borders by one SIZE_CELL.
function drawGrid() {
    canvasContext.beginPath();
    var i;
    for (i = 0; i < NUM_CELLS; i++) {
        canvasContext.moveTo(SIZE_CELL + i * SIZE_CELL, SIZE_CELL);
        canvasContext.lineTo(SIZE_CELL + i * SIZE_CELL, SIZE_CELL + (NUM_CELLS - 1) * SIZE_CELL);

        canvasContext.moveTo(SIZE_CELL, SIZE_CELL + i * SIZE_CELL);
        canvasContext.lineTo(SIZE_CELL + (NUM_CELLS - 1) * SIZE_CELL, SIZE_CELL + i * SIZE_CELL);
    }
    canvasContext.strokeStyle = "black";
    canvasContext.lineWidth = 1;
    canvasContext.stroke();
}

function onCanvasMouseMove(e) {
    var mouseX, mouseY;
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    } else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

    var tempX = gridX;
    var tempY = gridY;

    gridX = getGridCoordinate(modify(mouseX, SIZE_CELL));
    gridY = getGridCoordinate(modify(mouseY, SIZE_CELL));
    // Use this for less mouse control:
    // gridX = getGridCoordinate(mouseX);
    // gridY = getGridCoordinate(mouseY);

    if (tempX != gridX || tempY != gridY) {
        prevGridX = tempX;
        prevGridY = tempY;
    }

    // TODO. Remove
    var coordinates = document.getElementById("MousePosition");
    coordinates.innerHTML = "[ " + gridX + ", " + gridY + " ]";

    redrawCanvas(gridX, gridY, prevGridX, prevGridY);
}

// Draws cross-hair as mouse moves across the grid.
function reticulo(canvasX, canvasY) {
    if (!isInGrid(getGridCoordinate(canvasX), getGridCoordinate(canvasY))) {
        return;
    }

    canvasContext.strokeStyle = "yellow";
    canvasContext.lineWidth = 2;
    canvasContext.strokeRect(canvasX - SIZE_HALF_CELL + canvasContext.lineWidth,
        canvasY - SIZE_HALF_CELL + canvasContext.lineWidth,
        SIZE_CELL - 2 * canvasContext.lineWidth,
        SIZE_CELL - 2 * canvasContext.lineWidth);
}

// Draws cross-hair as mouse moves across the grid.
function reticulo2(canvasX, canvasY) {
    if (!isInGrid(getGridCoordinate(canvasX), getGridCoordinate(canvasY))) {
        return;
    }

    canvasContext.strokeStyle = "red";
    canvasContext.lineWidth = 2;
    canvasContext.strokeRect(canvasX - SIZE_HALF_CELL + canvasContext.lineWidth,
        canvasY - SIZE_HALF_CELL + canvasContext.lineWidth,
        SIZE_CELL - 2 * canvasContext.lineWidth,
        SIZE_CELL - 2 * canvasContext.lineWidth);
}

// Returns the closest number to x divisible by n.
function modify(x, n) {
    var q = Math.floor(x / n);
    if (x - n * q < n * (q + 1) - x) {
        return n * q;
    } else {
        return n * (q + 1);
    }
}
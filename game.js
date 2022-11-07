
var rows = 4;
var columns = 4;

var image;
var context;
var canvas;
var pieceWidth;
var pieceHeight;
var frameWidth;
var frameHeight;
var pieces;
var emptyPosition;
var lastPiece;
var moving;
var running;

function init() {
    image = new Image();
    image.addEventListener("load", initProgram);

    var params = location.search.split("?")
    if (!isNaN(params[1]) && params[1] <= 12 && params[1] >= 1)
        image.src = "images/image" + params[1] + ".jpg";
    else
        image.src = "images/image" + 1 + ".jpg";
    if (params[2] != "" && !isNaN(params[2]))
        rows = params[2];
    if (params[3] != "" && !isNaN(params[3]))
        columns = params[3];

    document.getElementById("solution-image").src = image.src;
    var restart = document.getElementById("refresh");
    restart.addEventListener("click", initProgram)
}


function initProgram() {
    pieceWidth = Math.floor(image.width / columns);
    pieceHeight = Math.floor(image.height / rows);
    frameWidth = pieceWidth * columns;
    frameHeight = pieceHeight * rows;
    canvas = document.getElementById("myCanvas");
    canvas.width = frameWidth;
    canvas.height = frameHeight;
    context = canvas.getContext("2d");
    moving = false;
    running = true;
    pieces = [];
    lastPiece = null;
    document.getElementById("title").innerHTML = "Ułóż obrazek aby wygrać"
    createPieces();
}

function createPieces() {
    var xPos = 0;
    var yPos = 0;
    for (var i = 0; i < rows * columns; i++) {
        pieces.push({ sx: xPos, sy: yPos, px: xPos, py: yPos});
        xPos += pieceWidth;
        if (xPos >= frameWidth) {
            xPos = 0;
            yPos += pieceHeight;
        }
    }
    emptyPosition = pieces[0];
    shuffle();
    drawPieces();
    if (window.innerWidth > 400)
        onmousemove = mouseHover;
    onmouseup = choosePiece;
    ontouchend = choosePiece;
}

function getMouse(e) {
    var mouse = {}
    var scale = canvas.width / canvas.offsetWidth;
    mouse.x = Math.floor((e.clientX - canvas.offsetLeft) * scale);
    mouse.y = Math.floor((e.clientY - canvas.offsetTop) * scale);
    return mouse;
}

function choosePiece(e) {
    if (moving || !running) {
        return;
    }
    var mouse = getMouse(e)
    var currentPiece = checkPositions(mouse);
    var x;
    var index = checkPositions(mouse);
    if (index != null) {
        currentPiece = pieces[currentPiece];
        x = { ...currentPiece };
        movePiece(x, currentPiece)
    }
}

function movePiece(startPoint, currentPiece) {
    var dx = (emptyPosition.px - currentPiece.px) / 20;
    var dy = (emptyPosition.py - currentPiece.py) / 20;
    var counter = 0;
    moving = true;
    var repeater = setInterval(function () {
        context.fillRect(emptyPosition.px, emptyPosition.py, pieceWidth, pieceHeight);
        context.fillRect(startPoint.px, startPoint.py, pieceWidth, pieceHeight);

        currentPiece.px += dx;
        currentPiece.py += dy;
        counter++;
        drawPiece(currentPiece);
        if (counter == 20) {
            currentPiece.px = emptyPosition.px
            currentPiece.py = emptyPosition.py
            emptyPosition.px = startPoint.px;
            emptyPosition.py = startPoint.py;
            moving = false;
            clearInterval(repeater);
            checkGame();
        }
    }, 10)
}

function checkGame() {
    for (let piece of pieces) {
        if (piece.px != piece.sx || piece.py != piece.sy)
            return;
    }
    running = false;
    drawPiece(emptyPosition);
    context.strokeRect(0, 0, pieceWidth, pieceHeight)
    document.getElementById("title").innerHTML = "Wygrałeś"
}

function mouseHover(e) {
    if (moving || !running)
        return;
    var mouse = getMouse(e);
    var index = checkPositions(mouse);
    if (lastPiece != null) {
        context.clearRect(lastPiece.px, lastPiece.py, pieceWidth, pieceHeight);
        drawPiece(lastPiece);
        lastPiece = null;
    }
    if (index != null) {
        currentPiece = pieces[index];
        context.clearRect(currentPiece.px, currentPiece.py, pieceWidth, pieceHeight);
        context.save();
        context.filter = "brightness(150%)";
        drawPiece(currentPiece);
        context.restore();
        lastPiece = currentPiece;
    }
}

function checkPositions(mouse) {
    var index = 0;
    if ((mouse.x < emptyPosition.px + 2 * pieceWidth && mouse.x > emptyPosition.px - pieceWidth)
        && (mouse.y > emptyPosition.py && mouse.y < emptyPosition.py + pieceHeight) ||
        (mouse.y < emptyPosition.py + 2 * pieceHeight && mouse.y > emptyPosition.py - pieceHeight)
        && (mouse.x > emptyPosition.px && mouse.x < emptyPosition.px + pieceWidth))
        for (let piece of pieces) {
            // console.log("dkajw")
            if (piece !== emptyPosition) {
                if (mouse.x > piece.px && mouse.x < piece.px + pieceWidth &&
                    mouse.y > piece.py && mouse.y < piece.py + pieceHeight) {
                    return index;
                }
            }
            index++;
        }
    return null;
}

function drawPieces() {
    context.clearRect(0, 0, frameWidth, frameHeight);
    pieces.forEach(piece => {
        drawPiece(piece)
    })
    context.fillStyle = "red";
    context.fillRect(emptyPosition.px, emptyPosition.py, pieceWidth, pieceHeight);
    context.strokeRect(emptyPosition.px, emptyPosition.py, pieceWidth, pieceHeight)
}

function shuffle() {
    var j, x;
    var n = pieces.length;
    for (var i = n - 1; i > 1; i--) {
        j = parseInt(Math.random() * (i - 1)) + 1;
        swap(i, j)
    }
    var inver = rows * columns;
    if (columns % 2 != 0 && inver % 2 != 0)
        swap(n - 2, n - 1);

    if (columns % 2 == 0 && rows % 2 == 0 && inver % 2 != 0)
        swap(n - 2, n - 1);

    if (columns % 2 == 0 && rows % 2 != 0 && inver % 2 == 0)
        swap(n - 2, n - 1);


}

function swap(i, j) {
    x = pieces[i].px;
    pieces[i].px = pieces[j].px;
    pieces[j].px = x;
    x = pieces[i].py;
    pieces[i].py = pieces[j].py;
    pieces[j].py = x;
}

function drawPiece(piece) {
    context.drawImage(image, piece.sx, piece.sy, pieceWidth, pieceHeight,
        piece.px, piece.py, pieceWidth, pieceHeight);
    context.strokeRect(piece.px, piece.py, pieceWidth, pieceHeight)
}
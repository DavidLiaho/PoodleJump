//board
let board;
let boardWidth = 1500; // 500
let boardHeight = 740; // 740
let context;

//poodle
let poodleWidth = 83; // 100
let poodleHeight = 83; // 100
let poodleX = boardWidth / 2 - poodleWidth / 2;
let poodleY = boardHeight - 100 - poodleHeight;
let poodleRightImg;
let poodleLeftImg;

let poodle = {
    img: null,
    x: poodleX,
    y: poodleY,
    width: poodleWidth,
    height: poodleHeight
}

// Physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -12;
let gravity = 0.6;

// Platforms
let platformArray = [];
let platformWidth = 100; // 100
let platformHeight = 17; // 17
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //load images
    poodleRightImg = new Image();
    poodleRightImg.src = "poodle-right.png";
    poodle.img = poodleRightImg;
    poodleRightImg.onload = function () {
        context.drawImage(poodle.img, poodle.x, poodle.y, poodle.width, poodle.height);

    }

    poodleLeftImg = new Image();
    poodleLeftImg.src = "poodle-left.png";

    platformImg = new Image();
    platformImg.src = "platform.png"

    velocityY = initialVelocityY;
    placePlatforms();

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePoodle);
}

// Game loop
function update() {
    requestAnimationFrame(update);
    if (gameOver)
        return;
    context.clearRect(0, 0, board.width, board.height);
    // draw poodle in loop
    poodle.x += velocityX;
    if (poodle.x > boardWidth) {
        poodle.x = 0 - poodle.width;
    }
    else if (poodle.x + poodle.width < 0) {
        poodle.x = boardWidth;
    }

    velocityY += gravity;
    poodle.y += velocityY;
    if (poodle.y > board.height)
        gameOver = true;

    context.drawImage(poodle.img, poodle.x, poodle.y, poodle.width, poodle.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && poodle.y < boardHeight * 0.5) {
            platform.y -= initialVelocityY; // slide platforms down
        }
        if (detectCollision(poodle, platform) && velocityY > 0) {
            velocityY = initialVelocityY; // jump
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }
    // clear platforms and add new platforms
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); // removes first element from the array
        newPlatform();
    }

    //score
    updateScore();
    context.fillStyle = "black";
    context.font = "bold 25px san-serif";
    context.fillText(score, 5, 30);

    if (gameOver) {
        context.fillText("Game Over", boardWidth / 2 - 70, boardHeight / 2);
        context.fillText(`Score: ${score}`, boardWidth / 2 - 60, boardHeight * 3 / 4 - 20);
        context.fillText("Press `Space` to Restart", boardWidth / 2 - 130, boardHeight * 3 / 4 + 20);
    }
}

function movePoodle(e) {
    if (e.code === "ArrowRight" || e.code === "KeyD") { // move right
        velocityX = 15;
        poodle.img = poodleRightImg;
    }
    else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        velocityX = -15;
        poodle.img = poodleLeftImg;
    }
    else if (e.code === "Space" && gameOver) {
        //reset
        poodle = {
            img: poodleRightImg,
            x: poodleX,
            y: poodleY,
            width: poodleWidth,
            height: poodleHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = [];

    //starting platform
    let platform = {
        img: platformImg,
        x: boardWidth / 2 - platformWidth / 2,
        y: boardHeight - 100,
        width: platformWidth,
        height: platformHeight
    }
    platformArray.push(platform);

    // random platforms
    for (let i = 0; i < 7; i++) {
        let randomX = Math.floor(Math.random() * (boardWidth - platformWidth));
        let platform = {
            img: platformImg,
            x: randomX,
            y: boardHeight - 200 - i * 100,
            width: platformWidth,
            height: platformHeight
        }

        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * (boardWidth - platformWidth));
    let platform = {
        img: platformImg,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function updateScore() {
    let points = 5;
    if (velocityY < 0 && poodle.y < board.height - board.height / 4) { // going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}
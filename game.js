const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// 🔊 Sounds
const jumpSound = new Audio();
jumpSound.src =
"https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg";

const hitSound = new Audio();
hitSound.src =
"https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg";

// 🏆 High Score
let highScore = localStorage.getItem("highScore") || 0;

// 🐤 Bird
let bird = {
    x: 80,
    y: 300,
    velocity: 0
};

let gravity = 0.25;
let jump = -5;

// 🚧 Pipes
let pipeWidth = 60;
let pipeGap = 150;
let pipeX = WIDTH;
let pipeHeight = randomPipe();
let pipeSpeed = 4;

// ☁️ Clouds
let clouds = [
    {x: 50, y: 80, r: 20},
    {x: 180, y: 120, r: 30},
    {x: 320, y: 70, r: 25}
];

// 🎮 Game States
let started = false;
let gameOver = false;

// 🏆 Score
let score = 0;
let lastScoreTime = Date.now();

function randomPipe() {
    return Math.floor(Math.random() * 250) + 100;
}

// ⌨️ Controls
document.addEventListener("keydown", (e) => {

    if (e.code === "Space") {

        // Start Game
        if (!started) {

            started = true;

            jumpSound.currentTime = 0;
            jumpSound.play().catch(() => {});
        }

        // Jump
        else if (!gameOver) {

            bird.velocity = jump;

            jumpSound.currentTime = 0;
            jumpSound.play().catch(() => {});
        }

        // Restart
        else {

            restartGame();

            jumpSound.currentTime = 0;
            jumpSound.play().catch(() => {});
        }
    }
});

// 🔄 Restart
function restartGame() {

    bird.y = 300;
    bird.velocity = 0;

    pipeX = WIDTH;
    pipeHeight = randomPipe();

    score = 0;

    gameOver = false;
    started = true;
}

// 🐤 Draw Bird
function drawBird() {

    // Body
    ctx.fillStyle = "yellow";

    ctx.beginPath();
    ctx.ellipse(
        bird.x,
        bird.y,
        18,
        14,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Wing
    ctx.fillStyle = "gold";

    ctx.beginPath();
    ctx.ellipse(
        bird.x - 5,
        bird.y + 2,
        8,
        5,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Eye
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(
        bird.x + 8,
        bird.y - 5,
        5,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.arc(
        bird.x + 9,
        bird.y - 5,
        2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Beak
    ctx.fillStyle = "orange";

    ctx.beginPath();
    ctx.moveTo(bird.x + 18, bird.y);
    ctx.lineTo(bird.x + 28, bird.y - 4);
    ctx.lineTo(bird.x + 28, bird.y + 4);
    ctx.fill();
}

// ☁️ Draw Cloud
function drawCloud(cloud) {

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cloud.x + 20, cloud.y + 10, cloud.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cloud.x - 20, cloud.y + 10, cloud.r, 0, Math.PI * 2);
    ctx.fill();
}

// 🎮 Main Game Loop
function update() {

    // Sky
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Clouds
    clouds.forEach(cloud => {

        drawCloud(cloud);

        cloud.x -= 0.5;

        if (cloud.x < -60) {
            cloud.x = WIDTH + 60;
        }
    });

    // Bird
    drawBird();

    // Physics
    if (started && !gameOver) {

        bird.velocity += gravity;
        bird.y += bird.velocity;

        pipeX -= pipeSpeed;

        // New Pipe
        if (pipeX < -pipeWidth) {

            pipeX = WIDTH;
            pipeHeight = randomPipe();
        }

        // Score every 2 sec
        if (Date.now() - lastScoreTime > 2000) {

            score++;
            lastScoreTime = Date.now();
        }

        // High Score
        if (score > highScore) {

            highScore = score;

            localStorage.setItem(
                "highScore",
                highScore
            );
        }

        // Collision
        if (
            bird.x + 18 > pipeX &&
            bird.x - 18 < pipeX + pipeWidth &&
            (
                bird.y - 14 < pipeHeight ||
                bird.y + 14 > pipeHeight + pipeGap
            )
        ) {

            hitSound.currentTime = 0;
            hitSound.play().catch(() => {});

            gameOver = true;
        }

        // Screen Collision
        if (bird.y < 0 || bird.y > HEIGHT) {

            hitSound.currentTime = 0;
            hitSound.play().catch(() => {});

            gameOver = true;
        }
    }

    // Pipes
    ctx.fillStyle = "green";

    ctx.fillRect(
        pipeX,
        0,
        pipeWidth,
        pipeHeight
    );

    ctx.fillRect(
        pipeX,
        pipeHeight + pipeGap,
        pipeWidth,
        HEIGHT
    );

    // Score
    ctx.fillStyle = "black";
    ctx.font = "28px Arial";

    ctx.fillText(
        "Score: " + score,
        10,
        40
    );

    ctx.fillText(
        "High: " + highScore,
        10,
        80
    );

    // Start Screen
    if (!started) {

        ctx.fillStyle = "black";
        ctx.font = "32px Arial";

        ctx.fillText(
            "Press SPACE",
            85,
            250
        );

        ctx.font = "22px Arial";

        ctx.fillText(
            "to Start",
            145,
            290
        );
    }

    // Game Over
    if (gameOver) {

        ctx.fillStyle = "red";
        ctx.font = "40px Arial";

        ctx.fillText(
            "GAME OVER",
            60,
            250
        );

        ctx.fillStyle = "black";
        ctx.font = "24px Arial";

        ctx.fillText(
            "Press SPACE",
            95,
            310
        );

        ctx.fillText(
            "to Restart",
            120,
            345
        );
    }

    requestAnimationFrame(update);
}

update();
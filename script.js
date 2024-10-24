// Canvas Setup: We define the canvas element and get its 2D context (ctx), which allows us to draw shapes.
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas width and height
canvas.width = 480;
canvas.height = 320;

// Paddle: We define the size and position of the paddle, and then draw it on the canvas.
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2; // Starting position: center of the canvas

// Ball: Similarly, we define the ball’s size and position, and we use arc() to draw a circle (the ball) that moves across the screen.
let ballRadius = 10;
let x = canvas.width / 2;  // Starting x position: center of the canvas
let y = canvas.height / 2; // Starting y position: center of the canvas
let dx = 2;  // Horizontal speed of the ball
let dy = 2;  // Vertical speed of the ball

// Tracks how many bricks are left. The player wins when this count reaches 0.
let brickCount = 0;  // We'll initialize this when creating the bricks

// Variable to store the current game loop request ID
let animationFrameId;

// drawPaddle(): This function draws the paddle on the canvas.
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';  // Paddle color
    ctx.fill();
    ctx.closePath();
}

// drawBall(): This function draws the ball on the canvas.
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);  // Draw a circle (ball)
    ctx.fillStyle = "#FFC300";  // Ball color
    ctx.fill();
    ctx.closePath();
}

// Ball Movement: The ball moves by incrementing its position (x and y) with dx and dy, changing directions when it hits the canvas edges or the paddle.
function draw() {
    // Clear the canvas before redrawing (prevents trails left by the ball)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddle, bricks, and ball on the canvas
    drawBricks();
    drawBall();
    drawPaddle();

    // Paddle movement
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7; // Move paddle to the right
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7; // Move paddle to the left
    }

    // Update ball position
    x += dx;  // Move the ball horizontally
    y += dy;  // Move the ball vertically

    // Collision Detection: If the ball hits the sides of the canvas, it bounces.
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;  // Reverse the horizontal direction
    }

    // Bounce the ball off the top wall
    if (y + dy < ballRadius) {
        dy = -dy;  // Reverse the vertical direction
    }
    // Ball hits the bottom (game over or bounces off the paddle)
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            // Calculate the distance from the center of the paddle
            let paddleCenter = paddleX + paddleWidth / 2;
            let distanceFromCenter = x - paddleCenter;

            // Scale the ball's horizontal movement based on where it hit the paddle
            let maxBounceAngle = Math.PI / 3; // Max bounce angle (60 degrees)
            let bounceAngle = (distanceFromCenter / (paddleWidth / 2)) * maxBounceAngle;

            // Adjust dx and dy based on the bounce angle
            dx = Math.sin(bounceAngle) * 2;  // Multiply by 2 for consistent speed
            dy = -Math.cos(bounceAngle) * 2; // Negative because it should bounce up
        } else {
            // Game Over: The ball missed the paddle
            alert('Game over!');
            resetGame();  // Reset the game after the game over
        }
    }

    // Check for collision with bricks
    collisionDetection();

    // Store the ID of the current frame request
    animationFrameId = requestAnimationFrame(draw);
}

// Keyboard controls: Tracks whether the right or left arrow keys are pressed
let rightPressed = false;  // Tracks if the right arrow key is being pressed
let leftPressed = false;   // Tracks if the left arrow key is being pressed

// Event listener for key presses (keydown)
document.addEventListener("keydown", keyDownHandler, false);

// Event listener for key releases (keyup)
document.addEventListener("keyup", keyUpHandler, false);

// keyDownHandler(): This function is triggered when a key is pressed down
function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

// keyUpHandler(): This function is triggered when a key is released
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Brick properties
const brickRowCount = 3; // Number of rows of bricks
const brickColumnCount = 5; // Number of columns of bricks
const brickWidth = 75; // Width of each brick
const brickHeight = 20; // Height of each brick
const brickPadding = 10; // Space between each brick
const brickOffsetTop = 30; // Top margin from the canvas edge
const brickOffsetLeft = 30; // Left margin from the canvas edge

// Create a 2D array to store brick positions and their status (visible or broken)
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []; // Create a new array for each column
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }; // status 1 means the brick is still visible
        brickCount++;  // Increment the total number of bricks
    }
}

// Function to draw the bricks on the canvas
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";  // Brick color
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Function to detect collision between the ball and the bricks
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            // Check if the brick is still visible (status === 1)
            if (b.status === 1) {
                // Check if the ball is within the brick's area
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;  // Reverse the ball's vertical direction
                    b.status = 0;  // Mark the brick as broken (invisible)
                    brickCount--;  // Decrease the number of bricks left
                    if (brickCount === 0) {
                        alert('You Win!');
                        resetGame();  // Reset the game after winning
                    }
                }
            }
        }
    }
}

// Reset the game after winning or losing
function resetGame() {
    // Stop the current game loop
    cancelAnimationFrame(animationFrameId);

    // Reset ball position
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = 2;

    // Reset paddle position
    paddleX = (canvas.width - paddleWidth) / 2;

    // Reset bricks
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;  // Make all bricks visible again
        }
    }

    // Reset brick count
    brickCount = brickRowCount * brickColumnCount;

    // Start a new game loop
    draw();
}

// Start the game loop
draw();

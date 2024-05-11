// Get canvas element
const canvas = document.getElementById('boardCanvas');
const ctx = canvas.getContext('2d');
let initialAngles = [0, 0, 0];


// Board properties
const boardWidth = 150;
const boardHeight = 25;
let boardAngle = [0, 0, 60]; // Array to store angles of rotation in radians for each board

// Function to draw a single wooden board
function drawBoard(x, y, angle) {
    ctx.fillStyle = '#8B4513'; // Brown color
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillRect(-boardHeight / 2, -boardWidth / 2, boardHeight, boardWidth); // Swapped width and height
    ctx.restore();
}

// Draw the support and boards
function draw() {
    // Draw support
    const supportX = 250; // Adjust based on support position
    const supportY = canvas.height / 12;

    // Draw boards
    const gap = 2; // Gap between boards
    const startY = supportY + 60; // Adjusted start position
    let currentX = supportX + 30; // Starting position for the first board
    for (let i = 0; i < 3; i++) {
        drawBoard(currentX, startY + i * (boardWidth + gap), boardAngle[i]); // Adjusted y-coordinate
    }
}

// Function to set positions of the boards
function setPositions() {
    boardAngle = [Math.PI / 4, Math.PI / -4, Math.PI / 3]; // Example angles, adjust as needed
    redraw();
}

// Function to relax the boards
function relax() {
    // Reset the angles of rotation to their initial values
    boardAngle = [...initialAngles];
    redraw();
}

// Function to return the boards to the set position
function returnToSetPosition() {
    // Reset the angles of rotation to the previously set positions
    redraw();
}

// Function to show muscles
function showMuscles() {
    // Logic to show muscles
    // For now, let's just log a message
    console.log("Muscles shown");
}

// Function to clear canvas and redraw
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}

// Initial drawing
draw();

// Event listeners for buttons
document.getElementById('setPositionsBtn').addEventListener('click', setPositions);
document.getElementById('relaxBtn').addEventListener('click', relax);
document.getElementById('returnToSetPositionBtn').addEventListener('click', returnToSetPosition);
document.getElementById('showMusclesBtn').addEventListener('click', showMuscles);


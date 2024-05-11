

// Get canvas element
const canvas = document.getElementById('boardCanvas');
const ctx = canvas.getContext('2d');
let initialAngles = [0, 0, 0];

// Board properties
const boards = [
    { width: 150, height: 25, angle: 0 },
    { width: 165, height: 25, angle: 0 },
    { width: 130, height: 10, angle: 25 }
];

// Function to draw a single wooden board
function drawBoard(x, y, angle, width, height) {
    ctx.fillStyle = '#8B4513'; // Brown color
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180); // Convert degrees to radians
    ctx.fillRect(-height / 2, -width / 2, height, width); // Swapped width and height
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
    boards.forEach((board, index) => {
        drawBoard(currentX, startY + index * (board.width + gap), board.angle, board.width, board.height); // Adjusted y-coordinate
    });
}

// Function to set positions of the boards
function setPositions() {
    boards.forEach((board, index) => {
        board.angle = [45, -45, 60][index]; // Example angles, adjust as needed
    });
    redraw();
}

// Function to relax the boards
function relax() {
    // Reset the angles of rotation to their initial values
    boards.forEach((board, index) => {
        board.angle = 0;
    });
    redraw();
}

// Function to return the boards to the set position
function returnToSetPosition() {
    // Reset the angles of rotation to the previously set positions
    setPositions();
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

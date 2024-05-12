

// Get canvas element
const canvas = document.getElementById('boardCanvas');
const ctx = canvas.getContext('2d');
let initialAngles = [0, 0, 0];

// Board properties
const boards = [
    { width: 150, height: 18, angle: 0 },
    { width: 170, height: 18, angle: 0 },
    { width: 130, height: 14, angle: 20 }
];




// // Function to draw a single wooden board with border and dot
// function drawBoard(x, y, angle, width, height, dotX, dotY) {
//     ctx.fillStyle = '#8B4513'; // Brown color
//     ctx.strokeStyle = 'black'; // Border color
//     ctx.lineWidth = 2; // Border width
//     ctx.save();
//     ctx.translate(x, y);
//     ctx.rotate(angle * Math.PI / 180); // Convert degrees to radians
    
//     // Draw border around the board
//     ctx.strokeRect(-height / 2, -width / 2, height, width); 
    
//     // Draw dot at the customized position
//     ctx.beginPath();
//     ctx.arc(dotX, dotY, 5, 0, Math.PI * 2); // Position dot at the specified coordinates
//     ctx.fillStyle = 'black'; // Dot color
//     ctx.fill();
    
//     // Fill the board with brown color
//     ctx.fillStyle = '#8B4513'; // Brown color
//     ctx.fillRect(-height / 2, -width / 2, height, width);
//     ctx.restore();
// }


function drawBoard(x, y, angle, width, height, dotX, dotY) {
    ctx.fillStyle = '#8B4513'; // Brown color
    ctx.strokeStyle = 'black'; // Border color
    ctx.lineWidth = -2; // Border width
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180); // Convert degrees to radians
    
    // Draw border around the board
    ctx.strokeRect(-height / 2, -width / 2, height, width); 
    
    // Fill the board with brown color
    ctx.fillRect(-height / 2, -width / 2, height, width);
    
    // Draw dot at the customized position
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5, 5, Math.PI * 3); // Position dot at the specified coordinates
    ctx.fillStyle = 'black'; // Dot color
    ctx.fill();
    
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
    let currentX = supportX + 40; // Starting position for the first board
    let offsetY = 0; // Initialize offset

    
    boards.forEach((board, index) => {
        const dotX = board.dotX !== undefined ? board.dotX : 0;
        const dotY = startY + index * (board.width + gap) + board.height / 2;
        drawBoard(currentX, startY + index * (board.width + gap), board.angle, board.width, board.height, dotX, dotY);
        offsetY += board.height + gap; // Update offset for next board

    });
}

// // Function to set positions of the boards
// function setPositions() {
//     boards.forEach((board, index) => {
//         board.angle = [50, -50, 60][index]; // Example angles, adjust as needed
//     });
//     redraw();
// }


function setPositions() {
    // Example angles, adjust as needed
    const angles = [50, -50, 60];

    // Customize width and height for each board
    boards.forEach((board, index) => {
        // Example customization based on index
        // You can customize the width and height based on any condition
        if (index === 0) {
            board.width = 200;
            board.height = 18;
        } else if (index === 1) {
            board.width = 180;
            board.height = 18;
        } else if (index === 2) {
            board.width = 150;
            board.height = 10;
        }

        // Set angle for each board
        board.angle = angles[index];
    });

    // Redraw to apply changes
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

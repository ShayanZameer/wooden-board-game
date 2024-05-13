

// Get canvas element
const canvas = document.getElementById('boardCanvas');
const ctx = canvas.getContext('2d');
// let initialAngles = [0, 0, 0];





const boards = [
    { 
        width: 170, 
        height: 28, 
        angle: 90, 
        x: 270, 
        y: 120, 
        dots: [{ x: -80, y: -25 }] // Array of dot positions for the top board
    },
    { 
        width: 170, 
        height: 28, 
        angle: 90, 
        x: 270, 
        y: 280, 
        dots: [{ x: -80, y: -2 }] // Array of dot positions for the middle board
    },
    { 
        width: 150, 
        height: 18, 
        angle: 125, 
        x: 270, 
        y: 363, 
        dots: [ { x: -10, y: -1 }] // Array of dot positions for the bottom board
    }
];

function drawBoard(board) {
    ctx.save();
    ctx.translate(board.x, board.y);
    ctx.rotate(board.angle * Math.PI / 180);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-board.width / 2, -board.height / 2, board.width, board.height);

    // Draw dots at specified positions
    ctx.fillStyle = 'black';
    board.dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
        ctx.fill()
    });

    ctx.restore();
}


// Draw the entire scene
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    boards.forEach(board => drawBoard(board));       // Draw each board
}




function setPositions() {
    // Adjust angles and positions to match the second picture
    boards[0].angle = -30;  // Example angle, adjust as necessary
    boards[1].angle = 30; // Example angle, adjust as necessary
    boards[2].angle = -20;  // Example angle, adjust as necessary

    // Update positions if necessary
    boards[0].x = 250; boards[0].y = 80;  // Adjust x, y positions
    boards[1].x = 250; boards[1].y = 170; // Adjust x, y positions
    boards[2].x = 325; boards[2].y = 215;
    

    boards[0].width=200;
    boards[1].width=180;
    boards[2].width=180;// Adjust x, y positions

    



    draw(); // Redraw with new positions
}









function drawArrows() {
    const arrowConfig = [
        {
            startX: 270, startY: 120,
            controlX: 270, controlY: 200,
            endX: 270, endY: 80,
            headLength: 10, headAngle: 90
        },
        {
            startX: 270, startY: 280,
            controlX: 300, controlY: 250,
            endX: 290, endY: 200,
            headLength: 10, headAngle: -60
        },
        {
            startX: 270, startY: 360,
            controlX: 320, controlY: 340,
            endX: 310, endY: 320,
            headLength: 20, headAngle: 75
        }
    ];

    arrowConfig.forEach(config => {
        ctx.save();

        // Draw the tail of the arrow
        ctx.beginPath();
        ctx.moveTo(config.startX, config.startY);
        ctx.quadraticCurveTo(config.controlX, config.controlY, config.endX, config.endY);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Draw the head of the arrow
        ctx.translate(config.endX, config.endY);
        ctx.rotate(config.headAngle * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(-config.headLength, -config.headLength);
        ctx.lineTo(config.headLength, -config.headLength);
        ctx.closePath();
        ctx.fillStyle = 'red';
        ctx.fill();

        ctx.restore();
    });
}




// Function to relax the boards
function relax() {
    // Draw the arrows to show motion direction
    redraw();
    drawArrows();

    // Delay before returning to initial position
    setTimeout(() => {
        boards.forEach((board, index) => {
            board.angle = initialAngles[index]; // Reset angles to initial values
        });
        redraw();
    }, 5000); // Delay of 2000 milliseconds (2 seconds)
}

// Initial angles stored for each board
const initialAngles = [90, 90, 125]; // Adjust these as per your initial setup

// Ensure all initial setups are correct
boards.forEach((board, index) => {
    board.angle = initialAngles[index];
});

// Initialize the drawing
draw();


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


function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    draw(); // Redraw all elements
}

// Initialize the drawing
draw();



// Event listeners for buttons
document.getElementById('setPositionsBtn').addEventListener('click', setPositions);
document.getElementById('relaxBtn').addEventListener('click', relax);
document.getElementById('returnToSetPositionBtn').addEventListener('click', returnToSetPosition);
document.getElementById('showMusclesBtn').addEventListener('click', showMuscles);

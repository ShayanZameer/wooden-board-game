

// Get canvas element
const canvas = document.getElementById('boardCanvas');
const ctx = canvas.getContext('2d');
const boards = [
    { 
        width: 170, 
        height: 28, 
        angle: 90, 
        x: 270, 
        y: 120, 
        dots: [{ x: -75, y: -3 }] // Array of dot positions for the top board
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
    ctx.fillStyle = '#FFDB58';
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
            startX: 180, startY: 120, // Adjust startY to move the arrow up
            controlX: 270-10, controlY: 170, // Adjust controlY to move the arrow up
            endX: 320, endY: 120, // Adjust endY to move the arrow up
            headLength: 10, headAngle: -15
        },
        {
            startX: 320, startY: 220+50,
            controlX: 270 + 10, controlY: 270+50,
            endX: 180, endY: 220+50,
            headLength: 10, headAngle: 15 // Adjust headAngle to reverse the direction
        },
       
        

        {
            startX: 260 - 90, // Reverse direction by moving startX farther from endX
            startY: 370, // Move the arrow up by adjusting startY
            controlX: 320 - 50, // Adjusted to keep the control point in line with new startX and endX
            controlY: 390, // Move the control point up to maintain the curve
            endX: 390 - 90, // Reverse direction by moving endX farther from startX
            endY: 370, // Move the arrow up by adjusting endY
            headLength: 10,
            headAngle: -15 // Angle adjusted to maintain the same pointing direction
        }
        
        
        
    ];

    arrowConfig.forEach(config => {
        ctx.save();

        // Draw the tail of the arrow
        ctx.beginPath();
        ctx.moveTo(config.startX, config.startY);
        ctx.quadraticCurveTo(config.controlX, config.controlY, config.endX, config.endY);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
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




// // Function to relax the boards
function relax() {



    boards[0].angle = -70;
    boards[1].angle = 65;
    boards[2].angle = 150;

    boards[0].y= 120
    boards[1].y= 265

    boards[2].y=340
    boards[2].x=300

    redraw();
    drawArrows();

    // Delay before returning to initial position
    setTimeout(() => {
        
        boards.forEach((board, index) => {
            board.angle = initialAngles[index];
            if(index===2){
                board.x=245;
                board.y=355;
        
            } // Reset angles to initial values
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




// Function to return the boards to the set position
function returnToSetPosition() {
    // Reset the angles of rotation to the previously set positions
    setPositions();
}




function drawMuscles() {
    boards[0].angle = -70;
    boards[0].width=140;
    boards[1].width=140;
    boards[1].angle = 65;
    boards[2].angle = 150;
    boards[0].y= 80
    boards[1].y= 190

    boards[2].y=260
    boards[2].x=290

    boards[1].dots.x=-95
    boards[0].dots.x=-85


    redraw();
    drawArrows();


    const muscleConfig = [
        { startX: 225, startY: 40, endX: 232, endY: 95 }, 
        { startX: 270, startY: 76, endX: 278, endY: 200 },
        { startX: 230, startY: 180, endX: 230, endY: 280 }  
       
    ];

    muscleConfig.forEach(muscle => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(muscle.startX, muscle.startY);
        ctx.lineTo(muscle.endX, muscle.endY);
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 4; // Thicker line for visibility
        ctx.stroke();
        ctx.restore();
    });
}

// Modify the showMuscles function to draw muscles
function showMuscles() {
    redraw(); // Clear and redraw the scene
    drawMuscles(); // Draw the muscles
    // Optionally draw arrows or other annotations if needed
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

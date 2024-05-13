// Get canvas element
const canvas = document.getElementById('boardCanvas');
const ctx = canvas.getContext('2d');

let isPositionSet = false;

let dragging = false; // Flag to check if a board is being dragged
let selectedBoardIndex = null; 
let initialMouseY = 0; // To track the initial mouse Y position for rotation calculations
// To keep track of which board is being selected
let initialAngle = 0;



// Utility function to show popup messages
function showPopup(message) {
    alert(message);
}

function calculateRotationAngle(mouseY) {
    if (selectedBoardIndex !== null) {
        const board = boards[selectedBoardIndex];
        const dy = mouseY - initialMouseY;
        board.angle += dy * 0.5; // Change 0.5 to adjust sensitivity
        initialMouseY = mouseY; // Update initialMouseY to the new position after calculation
        draw(); // Redraw to update board position
    }
}



let currentmode="normal";
const boards = [
    { 
        width: 170, 
        height: 28, 
        angle: 90, 
        setAngle: 90,
        x: 270, 
        y: 120,
        setX: 270,
        setY: 120, 
        dots: [{ x: -75, y: -36 }] // Array of dot positions for the top board
    },
    { 
        width: 170, 
        height: 28, 
        angle: 90, 
        setAngle: 90,
        x: 270, 
        y: 280, 
        setX: 270,
        setY: 280,
        dots: [{ x: -80, y: -2 }] // Array of dot positions for the middle board
    },
    { 
        width: 150, 
        height: 18, 
        angle: 125, 
        setAngle: 125,
        x: 270, 
        y: 363, 
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
    ctx.fillStyle = 'black';
    board.dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boards.forEach(drawBoard);
}


// Function to enable rotation of the boards
function enableRotation() {
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
}

function onMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    boards.forEach((board, index) => {
        if (Math.abs(mouseY - board.y) < 50) {
            dragging = true;
            selectedBoardIndex = index;
            initialMouseY = mouseY;
        }
    });
}

function calculateRotationAngle(board, mouseY, startY) {
    const dy = mouseY - startY;
    return board.angle + (dy / 2); // Divisor controls sensitivity of rotation
}


function onMouseMove(e) {
    if (dragging && selectedBoardIndex !== null) {
        const rect = canvas.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        const dy = mouseY - initialMouseY;
        // const deltaAngle = dy * 0.1; // Sensitivity of rotation

        // Adjust board angle and ensure it remains within 0-360 degrees
        const board = boards[selectedBoardIndex];
        // board.angle = (360 + board.angle + deltaAngle) % 360;
        board.angle = calculateRotationAngle(board, mouseY, board.y);

        // initialMouseY = mouseY;
        draw();
    }
}



function onMouseUp() {
    dragging = false;
    selectedBoardIndex = null;
}

// Function to disable rotation of the boards
function disableRotation() {
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
}

document.getElementById('setPositionsBtn').addEventListener('click', function() {
    if (!isPositionSet) {

        boards.forEach(board => {
            board.setAngle = board.angle;
            board.setX = board.x;
            board.setY = board.y;
        });
        isPositionSet = true;
        disableRotation();
        alert("Positions set. Boards are locked.");
    }
});

// Initial drawing
enableRotation();
draw();



function drawArrows() {
    let arrowConfig;


        if(currentmode==="relax"){
            arrowConfig=[
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
            startX: 260 - 90, 
            
            startY: 370, // Move the arrow up by adjusting startY
            controlX: 320 - 50, // Adjusted to keep the control point in line with new startX and endX
            controlY: 390, // Move the control point up to maintain the curve
            endX: 390 - 90, 
            endY: 370, // Move the arrow up by adjusting endY
            headLength: 10,
            headAngle: -15 // Angle adjusted to maintain the same pointing direction
        }     
        
    ];
} if (currentmode==="muscles"){
        arrowConfig=[

    {
        startX: 230, // Start X, potentially the right-most or middle point
        startY: 100, // Start Y, same as before
        controlX: 180, // Control X moved slightly to the left for a sharper ascent
        controlY: 150, // Control Y lowered to pull the curve upwards
        endX: 180, // End X remains close to startX to emphasize vertical movement
        endY: 70, // End Y lowered to make the arrow move further up
        headLength: 10,
        headAngle: 30 // Arrow head pointing upward, directly up
    },

    
    
    
    
    {
        startX: 240, // Start X, remains unchanged
        startY: 280, // Adjusted to shorten the length of the arrow
        controlX: 110, // Control X, remains unchanged
        controlY: 270, // Adjusted to shorten the length of the arrow
        endX: 120, // End X, remains unchanged
        endY: 220, // Adjusted to shorten the length of the arrow
        headLength: 10, // Arrow head length (unchanged)
        headAngle: -45 // Arrow head angle (unchanged)
    },
    {
        startX: 270, 
        startY: 200, // Move the arrow up by adjusting startY
        controlX: 300, // Adjusted to keep the control point in line with new startX and endX
        controlY: 270, // Move the control point up to maintain the curve
        endX: 350, // Reverse direction by moving endX farther from startX
        endY: 170, // Move the arrow up by adjusting endY
        headLength: 10,
        headAngle: -45 
    }
   
    

];
}
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


function resetBoardPositions() {
    boards.forEach((board, index) => {
        board.angle = initialAngles[index];
        if (index === 2) {
            board.x = 270; // Reset x position if modified
            board.y = 363; // Reset y position if modified
        }
    });
    redraw();
}
// // Function to relax the boards
function relax() {
    if (!isPositionSet) {
        showPopup("Boards are already in relax position");
        return;
    }

    
    currentmode= "relax"
    // 
    redraw();
   
    setTimeout(() => {
        
        boards.forEach((board, index) => {
            board.angle = initialAngles[index];
            if(index===2){
                board.x=245;
                board.y=355;
        
            } // Reset angles to initial values
        });
        redraw();
    }, 2000); // Delay of 2000 milliseconds (2 seconds)
}

// Initial angles stored for each board
const initialAngles = [90, 90, 125]; // Adjust these as per your initial setup

// Ensure all initial setups are correct
boards.forEach((board, index) => {
    board.angle = initialAngles[index];
});
// Function to return the boards to the set position



function returnToSetPosition() {
    if (!isPositionSet) {
        showPopup("First press Set Position button");
        return;
    }
    boards.forEach(board => {
        board.angle = board.setAngle;
        board.x = board.setX;
        board.y = board.setY;
    });
    draw(); // Redraw the boards in their set positions
}


function drawBands() {
    ctx.beginPath();
    // Band between first and second board
    ctx.moveTo(boards[0].x, boards[0].y + boards[0].height / 2);
    ctx.lineTo(boards[1].x, boards[1].y - boards[1].height / 2);
    
    // Band between second and third board
    ctx.moveTo(boards[1].x, boards[1].y + boards[1].height / 2);
    ctx.lineTo(boards[2].x, boards[2].y - boards[2].height / 2);

    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 5; // Width of the band
    ctx.stroke();
}

function drawMuscles() {
    currentmode = "muscles";
    redraw(); // Clear and redraw the scene
    drawBands(); // Draw the band
}

function showMuscles() {
    if (!isPositionSet) {
        showPopup("No muscles shown. Set positions first.");
        return;
    }
    redraw(); // Clear and redraw the scene
    drawMuscles(); // Draw the muscles
}

document.getElementById('showMusclesBtn').addEventListener('click', showMuscles);



// Modify the showMuscles function to draw muscles
function showMuscles() {

    if (!isPositionSet) {
        showPopup("No muscles shown. Set positions first.");
        return;
    }
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
document.getElementById('relaxBtn').addEventListener('click', relax);
document.getElementById('returnToSetPositionBtn').addEventListener('click', returnToSetPosition);
// document.getElementById('showMusclesBtn').addEventListener('click', showMuscles);

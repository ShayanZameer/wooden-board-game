

// Get canvas element
const canvas = document.getElementById('boardCanvas');
const ctx = canvas.getContext('2d');
let initialAngles = [0, 0, 0];





const boards = [
    { 
        width: 150, 
        height: 28, 
        angle: 90, 
        x: 270, 
        y: 120, 
        dots: [{ x: -50, y: -10 }] // Array of dot positions for the top board
    },
    { 
        width: 170, 
        height: 28, 
        angle: 90, 
        x: 270, 
        y: 280, 
        dots: [{ x: 10, y: 50 }] // Array of dot positions for the middle board
    },
    { 
        width: 150, 
        height: 18, 
        angle: 125, 
        x: 270, 
        y: 363, 
        dots: [{ x: -50, y: 10 }, { x: 50, y: -10 }] // Array of dot positions for the bottom board
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







// Draw the support and boards
// function draw() {
//     // Draw support
//     const supportX = 250; // Adjust based on support position
//     const supportY = canvas.height / 12;

//     // Draw boards
//     const gap = -45; // Gap between boards
//     const startY = supportY + 60; // Adjusted start position
//     let currentX = supportX + 40; // Starting position for the first board
//     let offsetY = 0; // Initialize offset

    
//     boards.forEach((board, index) => {
//         const dotX = board.dotX !== undefined ? board.dotX : 0;
//         const dotY = startY + index * (board.width + gap) + board.height / 2;
//         drawBoard(currentX, startY + index * (board.width + gap), board.angle, board.width, board.height, dotX, dotY);
//         offsetY += board.height + gap; // Update offset for next board

//     });
// }






// function setPositions() {
//     // Define custom angles and positions for each board
//     const settings = [
//         { width: 180, height: 25, x: 160, y: 300, angle: -40 },
//         { width: 170, height: 25, x: 160, y: 120, angle: 40 },
//         { width: 150, height: 20, x: 140, y: 160, angle: -30 }
//     ];

//     // Apply custom settings to each board
//     boards.forEach((board, index) => {
//         board.width = settings[index].width;
//         board.height = settings[index].height;
//         board.x = settings[index].x;
//         board.y = settings[index].y;
//         board.angle = settings[index].angle;
//     });

//     // Redraw the canvas to reflect the changes
//     redraw();
// }


function setPositions() {
    // Adjust angles and positions to match the second picture
    boards[0].angle = -30;  // Example angle, adjust as necessary
    boards[1].angle = 30; // Example angle, adjust as necessary
    boards[2].angle = -20;  // Example angle, adjust as necessary

    // Update positions if necessary
    boards[0].x = 250; boards[0].y = 80;  // Adjust x, y positions
    boards[1].x = 250; boards[1].y = 180; // Adjust x, y positions
    boards[2].x = 300; boards[2].y = 235;
    

    boards[0].width=200;
    boards[1].width=180;
    boards[2].width=180;// Adjust x, y positions

    draw(); // Redraw with new positions
}



// // Function to relax the boards
function relax() {

    const angles=[0,0,20];
    // Reset the angles of rotation to their initial values
    boards.forEach((board, index) => {


        if(index===0){
        board.angle = 0;
        }
        else if(index===1){
            board.angle = 0;


        }else{
            board.angle = 20;


        }
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
// function redraw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     draw();
// }

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

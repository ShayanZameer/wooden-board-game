// Get canvas element
const canvas = document.getElementById('boardCanvas');
const ctx = canvas.getContext('2d');

let isPositionSet = false;

let showMuscles = false;


let dragging = false; // Flag to check if a board is being dragged
let selectedBoardIndex = null; 
let initialMouseY = 0; // To track the initial mouse Y position for rotation calculations
// To keep track of which board is being selected
let initialAngle = 0;



// Utility function to show popup messages
function showPopup(message) {
    alert(message);
}


function calculateMuscleDotPositions(board) {
    const offset = 30; // Offset from the center of the board to place muscle dots
    const angleRad = board.angle * Math.PI / 180;
    return [
        { x: board.width / 2 * Math.cos(angleRad), y: board.width / 2 * Math.sin(angleRad) }, // Top center
        { x: -board.width / 2 * Math.cos(angleRad), y: -board.width / 2 * Math.sin(angleRad) } // Bottom center
    ];
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
        initialAngle: 90,
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
        initialAngle: 90,
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
        initialAngle: 125,
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

    // Calculate muscle dot positions and draw them if muscles are shown
    if (showMuscles) {
        const muscleDots = calculateMuscleDotPositions(board);
        ctx.fillStyle = 'red';
        muscleDots.forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
        board.muscleDots = muscleDots; // Save the calculated positions to the board for band drawing
    }
    ctx.restore();
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boards.forEach(drawBoard);
    if (showMuscles) {
        drawMuscles();
        drawAdditionalDots();
    }
}

function drawAdditionalDots() {
    boards.forEach(board => {
        const angle = board.angle * Math.PI / 180;
        const muscleDotX = board.x + Math.cos(angle) * (board.width / 2 + 20); // Position offset for demonstration
        const muscleDotY = board.y + Math.sin(angle) * (board.width / 2 + 20); // Position offset for demonstration
        
        ctx.beginPath();
        ctx.arc(muscleDotX, muscleDotY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
    });
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



function calculateMuscleDotPositions(board) {
    // Calculate positions for red dots based on board rotation and position
    const angleRad = board.angle * Math.PI / 180;
    const offset = 30; // Distance from the center of the board
    return [
        { x: Math.cos(angleRad) * offset, y: Math.sin(angleRad) * offset }, // Upper red dot
        { x: -Math.cos(angleRad) * offset, y: -Math.sin(angleRad) * offset } // Lower red dot
    ];
}



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


document.getElementById('relaxBtn').addEventListener('click', function() {
    if (!isPositionSet) {
        alert("Set positions first.");
        return;
    }
    let interval = setInterval(() => {
        let isAnimating = false;
        boards.forEach(board => {
            if (board.angle !== board.initialAngle) {
                isAnimating = true;
                const angleDifference = board.initialAngle - board.angle;
                board.angle += angleDifference * 0.05; // Smoothly adjust the angle

                // Once the angle is close enough to the initial angle, set it exactly to stop the animation
                if (Math.abs(angleDifference) < 0.1) {
                    board.angle = board.initialAngle;
                }
            }
        });

        draw(); // Redraw the boards with the updated angles

        // Stop the animation if no board needs further adjustment
        if (!isAnimating) {
            clearInterval(interval);
        }
    }, 10); // The time interval of 10 ms for smooth animation
});





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


// Helper function to get top or bottom point of a board based on its rotation
function getBoardPoint(board, isTop) {
    const angleRad = board.angle * Math.PI / 180;
    const dx = Math.cos(angleRad) * board.width / 2;
    const dy = Math.sin(angleRad) * board.width / 2;
    return {
        x: board.x + (isTop ? -dx : dx),
        y: board.y + (isTop ? -dy : dy)
    };
}


// function drawMuscles() {
//     ctx.beginPath();
//     ctx.strokeStyle = 'yellow';
//     ctx.lineWidth = 5;
//     boards.forEach((board, index) => {
//         if (index < boards.length - 1 && board.muscleDots && boards[index + 1].muscleDots) {
//             const nextBoard = boards[index + 1];
//             // Draw lines between muscle dots of adjacent boards
//             ctx.moveTo(board.x + board.muscleDots[0].x, board.y + board.muscleDots[0].y);
//             ctx.lineTo(nextBoard.x + nextBoard.muscleDots[0].x, nextBoard.y + nextBoard.muscleDots[0].y);
//             ctx.moveTo(board.x + board.muscleDots[1].x, board.y + board.muscleDots[1].y);
//             ctx.lineTo(nextBoard.x + nextBoard.muscleDots[1].x, nextBoard.y + nextBoard.muscleDots[1].y);
//         }
//     });
//     ctx.stroke();
// }



function drawMuscles() {
    ctx.beginPath();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 5;

    for (let i = 0; i < boards.length - 1; i++) {
        if (boards[i].muscleDots && boards[i + 1].muscleDots) {
            const currentBoardDots = boards[i].muscleDots.map(dot => ({
                x: boards[i].x + dot.x,
                y: boards[i].y + dot.y
            }));
            const nextBoardDots = boards[i + 1].muscleDots.map(dot => ({
                x: boards[i + 1].x + dot.x,
                y: boards[i + 1].y + dot.y
            }));

            // Draw bands from each muscle dot to the corresponding dot on the next board
            currentBoardDots.forEach((dot, index) => {
                ctx.moveTo(dot.x, dot.y);
                ctx.lineTo(nextBoardDots[index].x, nextBoardDots[index].y);
            });
        }
    }
    ctx.stroke();
}


// // Draw dynamic muscles (bands and dots)
// function drawMuscles() {
//     // Draw bands
//     ctx.beginPath();
//     ctx.strokeStyle = 'yellow';
//     ctx.lineWidth = 5;

//     boards.forEach((board, index) => {
//         if (index < boards.length - 1) {
//             const nextBoard = boards[index + 1];
//             const startDot = board.dots[0]; // Use the first dot as connection start
//             const endDot = nextBoard.dots[0]; // Use the first dot of the next board as connection end

//             // Calculate start and end points for the band
//             let startX = board.x + startDot.x;
//             let startY = board.y + startDot.y;
//             let endX = nextBoard.x + endDot.x;
//             let endY = nextBoard.y + endDot.y;

//             ctx.moveTo(startX, startY);
//             ctx.lineTo(endX, endY);
//         }
//     });
//     ctx.stroke();

//     // Draw extra dots for each board
//     boards.forEach(board => {
//         const angle = board.angle * Math.PI / 180;
//         const muscleDotX = board.x + Math.cos(angle) * (board.width / 2 + 20); // Position offset for demonstration
//         const muscleDotY = board.y + Math.sin(angle) * (board.width / 2 + 20); // Position offset for demonstration
        
//         ctx.beginPath();
//         ctx.arc(muscleDotX, muscleDotY, 5, 0, 2 * Math.PI);
//         ctx.fillStyle = 'yellow'; // Extra dot color
//         ctx.fill();
//     });
// }

// Initialize drawing
draw();





function getRotatedDot(board) {
    const angleRad = board.angle * Math.PI / 180;
    return {
        x: board.x + board.width / 2 * Math.cos(angleRad) - board.height / 2 * Math.sin(angleRad),
        y: board.y + board.width / 2 * Math.sin(angleRad) + board.height / 2 * Math.cos(angleRad)
    };
}


function animateMuscles() {
    const duration = 1000; // Duration of the animation in milliseconds
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / duration;

        draw(); // Redraw boards
        drawBands(); // Redraw bands with animation effect
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
}




function animateMuscles() {
    const numberOfDots = 10; // Number of dots per band
    const animationSteps = 100; // Number of animation steps
    let step = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(); // Redraw all static elements
        drawBands(); // Redraw bands

        // Draw dynamic dots along the bands
        boards.forEach((board, index) => {
            if (index < boards.length - 1) {
                const startDot = getRotatedDot(boards[index]);
                const endDot = getRotatedDot(boards[index + 1]);
                
                for (let i = 0; i <= numberOfDots; i++) {
                    const progress = i / numberOfDots + (step / animationSteps) * (1 / numberOfDots);
                    const dotX = startDot.x + (endDot.x - startDot.x) * progress;
                    const dotY = startDot.y + (endDot.y - startDot.y) * progress;
                    
                    ctx.beginPath();
                    ctx.arc(dotX, dotY, 3, 0, 2 * Math.PI); // Smaller dot size for effect
                    ctx.fillStyle = 'yellow';
                    ctx.fill();
                }
            }
        });

        step++;
        if (step < animationSteps) {
            requestAnimationFrame(animate);
        } else {
            step = 0; // Reset animation
        }
    }

    animate();
}

function rotateToInitialPosition() {
    const duration = 2000; // Animation duration in milliseconds
    const start = performance.now();

    function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        boards.forEach(board => {
            const angleDifference = board.initialAngle - board.angle;
            board.angle += angleDifference * timeFraction;
        });

        draw();

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

draw();

function animateToInitialPosition() {
    let interval = setInterval(() => {
        let isAnimating = false;
        boards.forEach(board => {
            const angleDifference = board.initialAngle - board.angle;
            if (Math.abs(angleDifference) > 0.1) {
                isAnimating = true;
                board.angle += angleDifference * 0.05;
            } else {
                board.angle = board.initialAngle;
            }
        });

        draw();

        if (!isAnimating) {
            clearInterval(interval);
        }
    }, 150);
}



document.getElementById('showMusclesBtn').addEventListener('click', function() {
    if (!isPositionSet) {
        alert("Set positions first.");
        return;
    }
    animateMuscles();
});

document.getElementById('showMusclesBtn').addEventListener('click', function() {
    if (!isPositionSet) {
        alert("Set positions first.");
        return;
    }
    showMuscles = !showMuscles;
    animateToInitialPosition();
    // Toggle the display of muscles
    draw(); // Redraw to show/hide muscles
});
// Redraw everything initially
draw();

draw();
// Event listeners for buttons
// document.getElementById('relaxBtn').addEventListener('click', relax);
document.getElementById('returnToSetPositionBtn').addEventListener('click', returnToSetPosition);
// document.getElementById('showMusclesBtn').addEventListener('click', showMuscles);

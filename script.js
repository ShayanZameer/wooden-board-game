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

// function calculateRotationAngle(mouseY) {
//     if (selectedBoardIndex !== null) {
//         const board = boards[selectedBoardIndex];
//         const dy = mouseY - initialMouseY;
//         board.angle += dy * 0.5; // Change 0.5 to adjust sensitivity
//         initialMouseY = mouseY; // Update initialMouseY to the new position after calculation
//         draw(); // Redraw to update board position
//     }
// }



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
        setX: 230,
        setY: 120, 
        dots: [{ x: 10, y: 15 }], // Array of dot positions for the top board
        muscleDots: [], // Muscle dots, initially empty
        muscleDotConfig: [
            { offset: 30, angleOffset: Math.PI, xOffset: 0, yOffset: 0 }, // Left dot
            { offset: 30, angleOffset: 0, xOffset: 80, yOffset: 0 }, // Right dot
            // { offset: 40, angleOffset: Math.PI / 2, xOffset: 0, yOffset: 0 } // Top dot
        ],
        connections: [
            { from: 0, to: 1 } // Connect left dot to right dot
        ]
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
        dots: [{ x: 30, y: 15 }],
        muscleDots: [],
        muscleDotConfig: [
            { offset: 30, angleOffset: Math.PI, xOffset: 0, yOffset: 0 }, // Left dot
            { offset: 30, angleOffset: 0, xOffset: -40, yOffset: -130 }, // Right dot
        ],
        connections: [
            { from: 0, to: 1 } // Connect left dot to right dot
        ]
    },
    { 
        width: 150, 
        height: 18, 
        angle: 125, 
        setAngle: 125,
        initialAngle: 125,
        x: 270, 
        y: 363,
        dots: [{ x: 65, y: 8 }],
        muscleDots: [],
        muscleDotConfig: [
            { offset: 30, angleOffset: Math.PI, xOffset: 0, yOffset: 0 }, // Left dot
            { offset: 30, angleOffset: 0, xOffset: 20, yOffset: -120 }, // Right dot
            // { offset: 40, angleOffset: Math.PI / 2, xOffset: 0, yOffset: 0 } // Top dot
        ],
        connections: [
            { from: 0, to: 1 } // Connect left dot to right dot
        ]
    }
];




function drawBoard(board) {
    ctx.save();
    
    // Translate context to the center of the board
    ctx.translate(board.x + board.width / 2, board.y + board.height / 2);
    
    // Rotate around the center of the board
    ctx.rotate(board.angle * Math.PI / 180);
    
    // Draw the board, considering the translation made the center of the canvas the center of the board
    ctx.fillStyle = '#FFDB58';
    ctx.fillRect(-board.width / 2, -board.height / 2, board.width, board.height);
    
    // Draw original black dots and muscle dots
    ctx.fillStyle = 'black';
    board.dots.forEach(dot => {
        ctx.beginPath();
        // The dot's coordinates need to be offset by the center of the board
        ctx.arc(dot.x - board.width / 2, dot.y - board.height / 2, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw red muscle dots if muscles are shown
    // if (showMuscles) {
    //     const muscleDots = calculateMuscleDotPositions(board);
    //     ctx.fillStyle = 'red';
    //     muscleDots.forEach(dot => {
    //         ctx.beginPath();
    //         // The muscle dot's coordinates need to be offset by the center of the board
            
    //         ctx.arc(dot.x+10, dot.y+20, 5, 0, 2 * Math.PI);
    //         ctx.fill();
    //     });
    //     board.muscleDots = muscleDots; // Save the muscle dot positions for later use in drawing bands
    // }

     if (showMuscles) {
        const muscleDots = calculateMuscleDotPositions(board);
        ctx.fillStyle = 'red';
        muscleDots.forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot.x - (board.x + board.width / 2), dot.y - (board.y + board.height / 2), 5, 0, 2 * Math.PI);
            ctx.fill();
        });
        board.muscleDots = muscleDots; // Save positions for drawing bands
    }

    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boards.forEach(drawBoard);
    if (showMuscles) {
        // drawMuscles();
        // drawAdditionalDots();
        // drawMuscleDots(board);
        boards.forEach(drawMuscleDotsAndBands);

    }
}



// function drawAdditionalDots() {
//     boards.forEach(board => {
//         board.additionalDots.forEach((dot, index) => {
//             // Calculate the angle including the board's current angle and the dot's specific angle offset
//             const angleWithOffset = (board.angle + dot.angleOffset) * Math.PI / 180;
            
//             // Dynamic distance to place dots further apart or based on some logic
//             const dynamicDistance = board.width / 2 + 30 + index * 10; // Adjust spacing based on index

//             // Calculate position based on the board's center, adjusted angle, and dynamic distance
//             const muscleDotX = board.x + Math.cos(angleWithOffset) * dynamicDistance + dot.offsetX;
//             const muscleDotY = board.y + Math.sin(angleWithOffset) * dynamicDistance + dot.offsetY;
            
//             // Draw the dot
//             ctx.beginPath();
//             ctx.arc(muscleDotX, muscleDotY, 5, 0, 2 * Math.PI);
//             ctx.fillStyle = 'red'; // Use red to indicate these are the additional muscle dots
//             ctx.fill();
//         });
//     });
// }



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
        const board = boards[selectedBoardIndex];
        board.angle = calculateRotationAngle(board, mouseY, board.y);
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

function relax() {
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
}

document.getElementById('relaxBtn').addEventListener('click', relax);





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


// // Helper function to get top or bottom point of a board based on its rotation
// function getBoardPoint(board, isTop) {
//     const angleRad = board.angle * Math.PI / 180;
//     const dx = Math.cos(angleRad) * board.width / 2;
//     const dy = Math.sin(angleRad) * board.width / 2;
//     return {
//         x: board.x + (isTop ? -dx : dx),
//         y: board.y + (isTop ? -dy : dy)
//     };
// }

// function getRotatedDot(board) {
//     const angleRad = board.angle * Math.PI / 180;
//     return {
//         x: board.x + board.width / 2 * Math.cos(angleRad) - board.height / 2 * Math.sin(angleRad),
//         y: board.y + board.width / 2 * Math.sin(angleRad) + board.height / 2 * Math.cos(angleRad)
//     };
// }


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


// draw();








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


//this code is okay

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
            showMuscles = false; // Hide muscles and bands after animation

        }

        relax();
    }, 50); 

    
}

// function animateToInitialPosition() {
//     let interval = setInterval(() => {
//         let isAnimating = false;
//         boards.forEach(board => {
//             const angleDifference = board.initialAngle - board.angle;
//             if (Math.abs(angleDifference) > 0.1) {
//                 isAnimating = true;
//                 board.angle += angleDifference * 0.05;
//                 board.muscleDots = calculateMuscleDotPositions(board); // Recalculate positions during animation
//             } else if (isAnimating) {
//                 board.angle = board.initialAngle;
//             }
//         });

//         draw(); // Make sure this draws both boards and muscle dots/bands

//         if (!isAnimating) {
//             clearInterval(interval);
//         }
//     }, 50);
// }




//this code is okay




// function calculateMuscleDotPositions(board) {
//     const muscleDots = [];
//     const angleRad = board.angle * Math.PI / 180; // Convert board angle to radians

//     board.muscleDotConfig.forEach(config => {
//         const totalAngle = angleRad + config.angleOffset;
//         const x = Math.cos(totalAngle) * config.offset + config.xOffset; // Add xOffset
//         const y = Math.sin(totalAngle) * config.offset + config.yOffset; // Add yOffset
//         muscleDots.push({ x, y });
//     });

//     return muscleDots;
// }

// function calculateMuscleDotPositions(board) {
//     const muscleDots = [];
//     const angleRad = board.angle * Math.PI / 180; // Convert board angle to radians

//     board.muscleDotConfig.forEach(config => {
//         const totalAngle = angleRad + config.angleOffset;
//         const x = board.x + Math.cos(totalAngle) * config.offset + config.xOffset; // Calculate x position
//         const y = board.y + Math.sin(totalAngle) * config.offset + config.yOffset; // Calculate y position
//         muscleDots.push({ x, y });
//     });

//     return muscleDots;
// }
// 


function calculateMuscleDotPositions(board) {
    const muscleDots = [];
    const angleRad = board.angle * Math.PI / 180; // Convert board angle to radians

    board.muscleDotConfig.forEach(config => {
        const totalAngle = angleRad + config.angleOffset;
        const x = Math.cos(totalAngle) * config.offset + config.xOffset; // Calculate x position relative to board center
        const y = Math.sin(totalAngle) * config.offset + config.yOffset; // Calculate y position relative to board center
        muscleDots.push({ x: board.x + board.width / 2 + x, y: board.y + board.height / 2 + y });
    });

    return muscleDots;
}

function drawMuscleDotsAndBands(board) {
    const muscleDots = calculateMuscleDotPositions(board);
    board.muscleDots = muscleDots; // Save the calculated positions

    ctx.fillStyle = 'red';
    muscleDots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 5, 0, 2 * Math.PI); // Draw dots at absolute positions
        ctx.fill();
    });

    // Draw connections based on saved muscle dots
    if (board.connections) {
        board.connections.forEach(conn => {
            const fromDot = muscleDots[conn.from];
            const toDot = muscleDots[conn.to];
            ctx.beginPath();
            ctx.moveTo(fromDot.x, fromDot.y);
            ctx.lineTo(toDot.x, toDot.y);
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }
}








document.getElementById('showMusclesBtn').addEventListener('click', function() {
    if (!isPositionSet) {
        alert("Set positions first.");
        return;
    }
    animateMuscles();
    updateDotPositions(); // Update positions based on the current



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

// draw();
// Event listeners for buttons
// document.getElementById('relaxBtn').addEventListener('click', relax);
document.getElementById('returnToSetPositionBtn').addEventListener('click', returnToSetPosition);
// document.getElementById('showMusclesBtn').addEventListener('click', showMuscles);




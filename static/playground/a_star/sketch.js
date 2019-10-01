const gridCols = 15;
const gridRows = 13;
const grid = [];

let selection = 0; // 0 = obstical, 1 = start, 2 = end
let selectionName = 'obstacle';

let startPos = null;
let endPos = null;

let started = false;
let done = false;

const sleepTime = 25;

let hStep;
let vStep;

function setup() {
    height = windowHeight;
    width = windowWidth;

    hStep = Math.ceil(width / gridCols);
    vStep = Math.ceil(height / gridRows);

    createCanvas(width, height);

    for(let i = 0; i < gridCols; i++) {
        grid.push(new Array(gridRows));

        for(let j = 0; j < gridRows; j++) {
            grid[i][j] = new Node(i, j);
        }
    }
}

let dragging = false;

function mouseClicked() {
    if(started) {
        return;
    }

    ellipse(mouseX, mouseY, 5, 5);
    const col = parseInt(mouseX / hStep);
    const row = parseInt(mouseY / vStep);

    // clear current obj
    grid[col][row]['start'] = false;
    grid[col][row]['end'] = false;

    if(selection !== 0) {
        for(let i = 0; i < gridCols; i++) {
            for(let j = 0; j < gridRows; j++) {
                if(selection === 1) {
                    grid[i][j].start = false;

                } else if(selection === 2) {
                    grid[i][j].end = false;
                }
            }
        }
    }

    if(selection == 0) {
        if(!dragging) {
            grid[col][row][selectionName] = !grid[col][row][selectionName];
        }
    } else {
        grid[col][row][selectionName] = !grid[col][row][selectionName];
    }

    if(selectionName === "start") {
        startPos = [col, row];
    } else if (selectionName === "end") {
        endPos = [col, row];
    } 

    dragging = false;
    // prevent default
    return false;
}

let lastDragX;
let lastDragY;
function mouseDragged() {
    if(started) {
        return;
    }

    dragging = true;
    const col = parseInt(mouseX / hStep);
    const row = parseInt(mouseY / vStep);

    if(selection == 0 && (lastDragX != col || lastDragY != row)) {
        lastDragX = col;
        lastDragY = row;
        grid[col][row][selectionName] = !grid[col][row][selectionName];
    }
}

async function keyPressed() {
    if (keyCode === 32) {
        selection += 1;
        if(selection >= 3) {
            selection = 0;
        }

        switch (selection) {
            case 0:
                selectionName = "obstacle";
                break;
            case 1:
                selectionName = "start";
                break;
            case 2:
                selectionName = "end";
                break;
        }
    }

    if(keyCode === ENTER) {
        if(startPos && endPos) {
            started = true;
            await pathFind();
        }
    }

    if(keyCode === ESCAPE) {
        // clear game
        for(let i = 0; i < gridCols; i++) {
            for(let j = 0; j < gridRows; j++) {
                grid[i][j] = new Node(i, j);
            }
        }

        started = false;
    }
}

function draw() {
    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
            if(grid[i][j].obstacle) {
                fill(0);
            } else if(grid[i][j].start) {
                fill(0, 255, 0);
            } else if(grid[i][j].end) {
                fill(0, 0, 255);
            } else if(grid[i][j].trace) {
                fill(128, 128, 255);
            } else if(grid[i][j].parent) {
                fill(60, 60, 60);
            } else {
                fill(255);
            }

            rect(i * hStep, j * vStep, hStep, vStep);
        }
    }

    textSize(32);
    fill(0, 102, 153);
    text(`Placing: ${selectionName}`, 10, 30);
    textSize(16);
    text(`Controls:`, 10, 55);
    text(`SPACE: Switch selection`, 30, 70);
    text(`ENTER: Start`, 30, 85);
    text(`ESC: Reset`, 30, 100);

    if(done) {
        textSize(32);
        text(`Done!`, width - 100, 30);
    }

    fill(0);
}

function arrayRemove(arr, value) {
    return arr.filter(function(ele){
        return !_.isEqual(ele, value);
    });
} 

function isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return true;
        }
    }
    return false;
}


function findNeighbours(pos) {
    const posX = pos[0];
    const posY = pos[1];

    const neighbourArray = [
        [posX + 1, posY],
        [posX + 1, posY - 1],
        [posX, posY - 1],
        [posX - 1, posY - 1],
        [posX - 1, posY],
        [posX - 1, posY + 1],
        [posX, posY + 1],
        [posX + 1, posY + 1]
    ];

    return neighbourArray.filter((el) => {
        return el[0] >= 0 && el[0] < gridCols && el[1] >= 0 && el[1] < gridRows;
    });
}

async function pathFind() {
    let openNodes = []
    let closedNodes = []

    openNodes.push(startPos);

    while(openNodes.length > 0) {
        let currentNode = grid[openNodes[0][0]][openNodes[0][1]];

        for(let i = 1; i < openNodes.length; i++) {
            const openNode = grid[openNodes[i][0]][openNodes[i][1]];

            if(openNode.fCost() < currentNode.fCost() || openNode.fCost() === currentNode.fCost() && openNode.hCost < currentNode.hCost) {
                currentNode = openNode;
            }
        }

        openNodes = arrayRemove(openNodes, currentNode.array());
        closedNodes.push(currentNode.array());

        if(_.isEqual(currentNode.array(), endPos)) {
            await retracePath(startPos, endPos);
            return;
        }

        const getNeighbours = findNeighbours(currentNode.array())

        for(let neighbourPos of getNeighbours) {
            const neighbour = grid[neighbourPos[0]][neighbourPos[1]];

            if(neighbour.obstacle || isItemInArray(closedNodes, neighbourPos)) {
                continue;
            }

            const newMovementCostToNeighbour = currentNode.gCost + getDistance(currentNode.array(), neighbour.array())

            if(newMovementCostToNeighbour < neighbour.gCost || !isItemInArray(openNodes, neighbour.array())) {
                neighbour.gCost = newMovementCostToNeighbour;
                neighbour.hCost = getDistance(neighbour.array(), endPos);
                neighbour.parent = currentNode;

                if(!isItemInArray(openNodes, neighbour.array())) {
                    openNodes.push(neighbour.array());
                    await sleep(sleepTime);
                }
            }
        }

    }
}

async function retracePath(startPos, endPos) {
    let nodePath = [];
    let currentNode = grid[endPos[0]][endPos[1]];

    while(!_.isEqual(currentNode.array(), startPos)) {
        nodePath.push(currentNode.array());
        currentNode = currentNode.parent;
    }
    
    nodePath = nodePath.reverse();

    await highlightPath(nodePath);
}

async function highlightPath(points) {
    for(let coord of points) {
        grid[coord[0]][coord[1]].trace = true;
        await sleep(sleepTime);
    }

    done = true;
}

function getDistance(posA, posB) {
    const dstX = Math.abs(posA[0] - posB[0]);
    const dstY = Math.abs(posA[1] - posB[1]);

    if(dstX > dstY) {
        return 14*dstY + 10*(dstX - dstY);
    }

    return 14*dstX + 10*(dstY - dstX);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
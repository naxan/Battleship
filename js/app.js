// STATIC VARIABLES
let board;
let shipsSunk;
let shipsLeft;
let cannonballs;

// CACHED ELEMENTS
let table = document.querySelector('table');
let tableData = document.querySelectorAll('td');
let shipsSunkSpan = document.getElementById('ships-sunk');
let shipsLeftSpan = document.getElementById('ships-left');
let cannonballsSpan = document.getElementById('cannonballs');
let message = document.getElementById('message');
let btn = document.getElementById('reset');

// EVENT LISTENERS
btn.addEventListener('click', initialize);
// table 'click' listener in initialize function

// FUNCTIONS
function render() {
    shipsSunkSpan.innerText = shipsSunk;
    shipsLeftSpan.innerText = shipsLeft;
    cannonballsSpan.innerText = cannonballs;

    // TODO: change DOM in render, not handleGuess.

    // Checks for winner
    if (shipsLeft === 0) {
        message.innerHTML = `<strong>Congrats!</strong> You've won! Huzzah and all that.`;
        table.removeEventListener('click', handleGuess);
    } else if (cannonballs === 0) {
        message.innerHTML = `<strong>Sorry!</strong> You've lost. Git gud`;
        table.removeEventListener('click', handleGuess);
    }
}

function shuffle(array) {
    let newPosition;
    let temporaryStorage;

    for (let i = array.length - 1; i > 0; i--) {
        newPosition = Math.floor(Math.random() * (i + 1));

        temporaryStorage = array[i];
        array[i] = array[newPosition];
        array[newPosition] = temporaryStorage;
    }
    return array;
}

function initialize() {
    // sets initial values
    shipsSunk = 0;
    shipsLeft = 7;
    cannonballs = 24;
    message.innerText = `Search for ships!`;

    /*
    // randomize board
    board = Array(64).fill(0);
    for (let i = 0; i < shipsLeft; i++) {
        board[i] = 1;
    }
    shuffle(board);
    */
    board = new Array(64).fill(0);

    // Remove all divs in table.
    let markedSquares = document.querySelectorAll('div .map-mark');
    for (let i = 0; i < markedSquares.length; i++) {
        markedSquares[i].parentNode.removeChild(markedSquares[i]);
    }

    render();
    table.addEventListener('click', selectShips);
}

/*
function handleGuess(event) {

    let index;
    for (let i = 0; i < tableData.length; i++) {
        if (event.target === tableData[i]) {
            index = i;
            break;
        }
    }

    if (board[index] === 1) {
        let div = document.createElement('div');
        div.setAttribute('class', 'map-mark');
        tableData[index].appendChild(div);
        div.style.backgroundColor = 'red';
        board[index] = -1;

        shipsSunk++;
        shipsLeft--;
        cannonballs--;
    } else if (board[index] === 0) {
        let div = document.createElement('div');
        div.setAttribute('class', 'map-mark');
        tableData[index].appendChild(div);
        div.style.backgroundColor = 'grey';
        board[index] = -1;

        cannonballs--;
    }
    render();
}
*/

initialize();

// to create/set battleships larger than 1 block
// no random generation. board starts out all 0
// function that runs on table click
// player selects starting block
// block board value = 1
// starting block stored in variable
// player selects surrounding blocks
// if 2nd selected block has index +1, -1, +8, OR -8 to the original, click event runs
// then next blocks must ALL be in the same vein of +1, -1, +8, or -8 from the previous
// if 2nd block is +1 to starting block, 3rd block must be +1 to 2nd block or -1 to starting block
// if 2nd block is +8 to starting block, 3rd block must be +8 to 2nd block or -8 to starting block, etc etc

// starting block variable is outside the function so it is not overwritten each time the function is run
// starting block will have an initial value
// when square is clicked, if starting block has initial value, initial value now equals current index
// when ship placing is complete, startingBlock returns to initial value (-1)

// blocksUsed will be used to count how many blocks have been and can continue to be used to form the ship
// each time selectShips runs successfully, blocksUsed++
// once blocksUsed === 3 (or once it === 2. after the third block is used, it might add 1 to blocksUsed but not check if its equal to 3 until next the function runs),
// startingBlock's value will be reset to -1
// blocksUsed value will be reset to 0

let startingIndex = -1;
let secondIndex = -1;
//let blocksUsed = 0;

function selectShips(event) {
    // finds index of square clicked
    let index;
    for (let i = 0; i < tableData.length; i++) {
        if (event.target === tableData[i]) {
            index = i;
            break;
        }
    }

    if (board[index] === 0) {
        if (startingIndex === -1) {
            startingIndex = index;
        } else if (secondIndex === -1) {
            secondIndex = index;
        }
    }

    // if its the first click and the space is free, create first mark of ship
    if (index === startingIndex && board[index] === 0) {
        let div = document.createElement('div');
        div.setAttribute('class', 'map-mark');
        tableData[index].appendChild(div);
        div.style.backgroundColor = 'red';

        board[index] = 1;
        console.log(startingIndex);

        // if on second click and space is free, AND space is +1, -1, +8, or -8 spaces away from startingIndex, create second mark
    } else if (index === secondIndex && board[index] === 0) {
        if ([startingIndex - 1, startingIndex + 1, startingIndex - 8, startingIndex + 8].indexOf(index) > -1) {

            let div = document.createElement('div');
            div.setAttribute('class', 'map-mark');
            tableData[index].appendChild(div);
            div.style.backgroundColor = 'red';

            board[index] = 1;
            console.log(startingIndex, secondIndex);
        }
        // on third click and space is free, AND space is + or - 1 spaces away from secondIndex, create third mark
    } else if (index != startingIndex && index != secondIndex && board[index] === 0) {
        console.log(startingIndex, secondIndex);
        if (
            ((index === secondIndex - 1 || index === secondIndex + 1) && (secondIndex === startingIndex - 1 || secondIndex === startingIndex + 1)) ||
            ((index === secondIndex - 8 || index === secondIndex + 8) && (secondIndex === startingIndex - 8 || secondIndex === startingIndex + 8))
        ) {

            let div = document.createElement('div');
            div.setAttribute('class', 'map-mark');
            tableData[index].appendChild(div);
            div.style.backgroundColor = 'red';

            board[index] = 1;
            startingIndex = -1;
            secondIndex = -1;

        }
    }

    /*
    if (board[index] === 0) {
        let div = document.createElement('div');
        div.setAttribute('class', 'map-mark');
        tableData[index].appendChild(div);
        div.style.backgroundColor = 'red';
    }
    */
}
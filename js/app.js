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

// if [8, 16, 24, 32, 40, 48, 56].indexOf(startingIndex) or (secondIndex) then index should not be equal to startingIndex - 1 or secondIndex - 1
// [ditto].indexOf(secondIndex)

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

    // test zone. trying to keep ships from separating around the edges of the board

    // if first or second click is on an edge of the board
    // next click cannot be + or - previous click index depending on which side of the board its on

    // if startingIndex or secondIndex === 7, 15, 23, 31, 39, 47, or 55, then current index should return nothing if it === 8, 16, 24, 32, 40, 48, or 56
    // if startingIndex or secondIndex === 8, 16, 24, 32, 40, 48, or 56, then current index should return nothing if it === 7, 15, 23, 31, 39, 47, or 55

    // if ((startingIndex or secondIndex) + 1) % 8 === 0 AND current index % 8 === 0, return nothing
    // if (startingIndex or secondIndex) % 8 === 0 AND (current inedx + 1) % 8 === 0, return nothing
    console.log(index);
    console.log((startingIndex + 1) % 8 === 0 && index % 8 === 0 && startingIndex != -1);
    console.log(startingIndex % 8 === 0 && (index + 1) % 8 === 0);

    if (
        ((startingIndex + 1) % 8 === 0 && index % 8 === 0 && startingIndex != -1) ||
        (startingIndex % 8 === 0 && (index + 1) % 8 === 0) ||
        ((secondIndex + 1) % 8 === 0 && index % 8 === 0 && secondIndex != -1) ||
        (secondIndex % 8 === 0 && (index + 1) % 8 === 0)
    ) {
        return;
    }

    // if clicked square is free and there has been no first click, store this click index as starting index
    if (board[index] === 0 && startingIndex === -1) {
        startingIndex = index;
    }

    // if its the first click and the space is free, create first mark of ship
    if (index === startingIndex && board[index] === 0) {
        let div = document.createElement('div');
        div.setAttribute('class', 'map-mark');
        tableData[index].appendChild(div);
        div.style.backgroundColor = 'red';

        board[index] = 1;

        // if on second click and space is free, AND space is +1, -1, +8, or -8 spaces away from startingIndex, create second mark
    } else if (secondIndex === -1 && board[index] === 0) {
        if ([startingIndex - 1, startingIndex + 1, startingIndex - 8, startingIndex + 8].indexOf(index) > -1) {

            let div = document.createElement('div');
            div.setAttribute('class', 'map-mark');
            tableData[index].appendChild(div);
            div.style.backgroundColor = 'red';

            board[index] = 1;
            secondIndex = index;
        }
        // on third click and space is free, AND space is adequate spaces away from starting or second index (so first, second, and third index are all in the same direction, ie horizontal or vertical), create third mark
    } else if (index != startingIndex && index != secondIndex && board[index] === 0) {
        if (
            ((index === secondIndex - 1 || index === secondIndex + 1) && (secondIndex === startingIndex - 1 || secondIndex === startingIndex + 1)) ||
            ((index === secondIndex - 8 || index === secondIndex + 8) && (secondIndex === startingIndex - 8 || secondIndex === startingIndex + 8)) ||
            ((index === startingIndex - 1 || index === startingIndex + 1) && (secondIndex === startingIndex + 1 || secondIndex === startingIndex - 1)) ||
            ((index === startingIndex - 8 || index === startingIndex + 8) && (secondIndex === startingIndex + 8 || secondIndex === startingIndex - 8))
        ) {

            let div = document.createElement('div');
            div.setAttribute('class', 'map-mark');
            tableData[index].appendChild(div);
            div.style.backgroundColor = 'red';

            board[index] = 1;
            startingIndex = -1;
            secondIndex = -1;

            console.log('ship complete!');

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

// allow player to placd ships on grid
// allow player to choose a ship to place (have buttons of ships on the side. when ship is selected, add event listener for that ship's placement function, then once ship is placed, remove event listener)
// have "finish ship placement"/'next' button that only appears once all ships are placed. removes all divs from the board and saves board array to player1's board variable
// allow player 2 to place ships
// player1's turn. display a board taking aim at player 2's ships to click on, as well as a smaller reference board to see how their ships are faring and whats been hit
// handle click event to check if theres a ship
// change div color and display message if ship has been hit. remove event listener. add next button
// player 2's turn
// player 2's reference board should update with player 1's move
// player 1's reference board should update with player 2's move
// check for winner (remaining ships to sink === 0) at the end of every turn
// if player has won, show message and do not show a next button
// start new game button
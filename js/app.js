console.log('sanity check');

// create a game board
// hide ships in game board
// add click event to table
// when clicked, check if square has ship
// if square has ship, turn square red
// if square does not have ship, turn square grey
// when square is selected, tries remaining goes down
// when ship is hit, ships sunk goes up and ships left to find goes down
// when all ships sunk OR all tries are used, game ends
// when game is over
// message (and score) should be displayed (win or loss)
// no more clicks on board should be accepted
// reset button resets entire game ie:
// game board and hidden ships are reshuffled
// game board circles/ui go back to neutral (no red or gray dots)
// sunk ships, ships left, and tries left should return to initialized values
// sunk ships = 0
// tries left = 24
// ships left = num of ships i decide to shuffle into the board


// handle click events on table
// check if board index is equal to whatever value i want to store ships as (1 for testing)
// if the index is equal to 1, color the div red and set board[index] equal to -1
// if the index is null, color div gray and set board[index] equal to -1 (counts as being clicked)
// else if -1, return nothing as its already been clicked

// STATIC VARIABLES
let board;
let boatsSunk;
let boatsLeft;
let cannonballs;

// CACHED ELEMENTS
let table = document.querySelector('table');
let tableData = document.querySelectorAll('td');
let squares = document.querySelectorAll('td div');

function initialize() {
    board = Array(64).fill(null);
}

table.addEventListener('click', handleGuess);

function handleGuess(event) {
    initialize();
    board[0] = 1;
    board[3] = 1;
    // ^ for testing

    let index = -1;
    for (let i = 0; i < tableData.length; i++) {
        if (event.target === tableData[i]) {
            index = i;
            break;
        }
    }

    if (board[index] === 1) {
        let div = document.createElement('div');
        tableData[index].appendChild(div);
        div.style.backgroundColor = 'red';
        board[index] = -1;

        // TODO: update ships sunk, ships left, and cannonballs left
    } else if (!board[index]) {
        let div = document.createElement('div');
        tableData[index].appendChild(div);
        div.style.backgroundColor = 'grey';
        board[index] = -1;

        // TODO: ditto ^
    } else {
        return;
    }
}
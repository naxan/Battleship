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


// time to set initial variables for everything except the board (will stay null for  now)
// boatsSunk = 0
// boatsLeft = 7
// cannonballs = 24;


// checking for win/loss
// game ends if
// cannonballs === 0
// shipsLeft === 0
// if shipsLeft === 0, win
// if cannonballs === 0 && shipsLeft > 0, lose

// when game is over
// show message ('you won!' or 'you lost')
// disable click event. reenable with reset button.

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

    // TODO: check for winner
    if (shipsLeft === 0) {
        message.innerHTML = `<strong>Congrats!</strong> You've won! Huzzah and all that.`;
        table.removeEventListener('click', handleGuess);
    } else if (cannonballs === 0) {
        message.innerHTML = `<strong>Sorry!</strong> You've lost. Git gud`;
        table.removeEventListener('click', handleGuess);
    }
}

function initialize() {
    // TODO: randomize board
    board = Array(64).fill(null);

    shipsSunk = 0;
    shipsLeft = 7;
    cannonballs = 24;

    render();
    table.addEventListener('click', handleGuess);
}

function handleGuess(event) {

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

        shipsSunk++;
        shipsLeft--;
        cannonballs--;

        console.log(shipsSunk, shipsLeft, cannonballs);
    } else if (!board[index]) {
        let div = document.createElement('div');
        tableData[index].appendChild(div);
        div.style.backgroundColor = 'grey';
        board[index] = -1;

        cannonballs--;
    }
    render();
}

initialize();
board[0] = 1;
board[3] = 1;
// ^ for testing
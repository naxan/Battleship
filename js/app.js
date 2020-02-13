// VARIABLES
let board;
let shipsSunk;
let shipsLeft;

let pOneShipsSunk;
let pTwoShipsSunk;
let pOneShipsLeft;
let pTwoShipsLeft;
let turn;
let shipsToPlace;
let startingIndex = -1;
let secondIndex = -1;
let placeShips;
let pOneBoard;
let pTwoBoard;

// CACHED ELEMENTS
let table = document.querySelector('table');
let tableData = document.querySelectorAll('td');
let shipsSunkSpan = document.getElementById('ships-sunk');
let shipsLeftSpan = document.getElementById('ships-left');
let message = document.getElementById('message');
let turnMessage = document.getElementById('player-turn');
let resetBtn = document.getElementById('reset');
let nextBtn = document.getElementById('next');
let squares = document.querySelectorAll('td div');
let markedSquares = document.querySelectorAll('div .map-mark');

// EVENT LISTENERS
resetBtn.addEventListener('click', initializeShips);
// table 'click' listener in initialize function

// LOOK UP TURN
const lookup = {
    '1': 'Player 1',
    '-1': 'Player 2'
}

// FUNCTIONS
function render() {
    shipsSunkSpan.innerText = shipsSunk;
    shipsLeftSpan.innerText = shipsLeft;
    turnMessage.innerText = `${lookup[turn]}'s turn`;

    // TODO: change DOM in render, not handleGuess.
    for (let i = 0; i < board.length; i++) {
        if (board[i] === 0) {
            document.querySelectorAll('td div')[i].removeAttribute('class');
        }
    }

    // Checks for winner
    if (shipsLeft === 0) {
        message.innerHTML = `<strong>Congrats!</strong> You've won! Huzzah and all that.`;
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

// game starts with initializeShips
// message reads "place your ships!"
// player sets ships
// when shipsToPlace === 0, 'next' button appears
// next button should
// lookup turn. if player 1 turn, save board to variable pOneBoard. if player 2 turn, save board to pTwoBoard
// set shipsToPlace back to initial value (ie 4)
// clear board back to 0's
// switch player turn

function initializeShips() {
    placeShips = true;
    board = new Array(64).fill(0);
    nextBtn.style.display = 'none';

    // hide all divs
    let amountOfDivs = document.querySelectorAll('td div').length;
    for (let i = 0; i < amountOfDivs.length; i++) {
        document.querySelectorAll('td div')[i].style.width = '0px';
        document.querySelectorAll('td div')[i].style.length = '0px';
    }

    if (!turn) {
        turn = 1;
    } else {
        turn *= -1;
    }
    message.innerText = `Place your ships!`;

    shipsToPlace = 4;
    table.addEventListener('click', selectShips);
    nextBtn.removeEventListener('click', initializeShips);
    render();
}

function initializePlay() {
    placeShips = false;
    // sets initial values
    shipsSunk = 0;
    shipsLeft = 16;
    message.innerText = `Attack ye enemy!`;

    board = new Array(64).fill(0);
    render();
    board = pOneBoard;

    table.addEventListener('click', handleGuess);
    nextBtn.removeEventListener('click', initializePlay);
    nextBtn.style.display = 'none';
}

function handleGuess(event) {

    let index;
    for (let i = 0; i < tableData.length; i++) {
        if (event.target === tableData[i]) {
            index = i;
            break;
        }
    }

    let div = document.querySelectorAll('td div')[index];
    if (board[index] === 1) {
        div.setAttribute('class', 'map-mark');
        board[index] = -1;

        shipsSunk++;
        shipsLeft--;
    } else if (board[index] === 0) {
        div.setAttribute('class', 'map-miss');
        board[index] = -1;
    }
    render();
}

initializeShips();

function selectShips(event) {
    // finds index of square clicked
    let index;
    for (let i = 0; i < tableData.length; i++) {
        if (event.target === tableData[i]) {
            index = i;
            break;
        }
    }
    // keeps ships from being able to wrap around the edges of the board when placed
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

    let div = document.querySelectorAll('td div')[index];
    // if its the first click and the space is free, create first mark of ship
    if (index === startingIndex && board[index] === 0) {
        div.setAttribute('class', 'map-mark');

        board[index] = 1;
        render();

        // if on second click and space is free, AND space is +1, -1, +8, or -8 spaces away from startingIndex, create second mark
    } else if (secondIndex === -1 && board[index] === 0) {
        if ([startingIndex - 1, startingIndex + 1, startingIndex - 8, startingIndex + 8].indexOf(index) > -1) {
            div.setAttribute('class', 'map-mark');

            board[index] = 1;
            secondIndex = index;
            render();
        }
        // on third click and space is free, AND space is adequate spaces away from starting or second index (so first, second, and third index are all in the same direction, ie horizontal or vertical), create third mark
    } else if (index != startingIndex && index != secondIndex && board[index] === 0) {
        if (
            ((index === secondIndex - 1 || index === secondIndex + 1) && (secondIndex === startingIndex - 1 || secondIndex === startingIndex + 1)) ||
            ((index === secondIndex - 8 || index === secondIndex + 8) && (secondIndex === startingIndex - 8 || secondIndex === startingIndex + 8)) ||
            ((index === startingIndex - 1 || index === startingIndex + 1) && (secondIndex === startingIndex + 1 || secondIndex === startingIndex - 1)) ||
            ((index === startingIndex - 8 || index === startingIndex + 8) && (secondIndex === startingIndex + 8 || secondIndex === startingIndex - 8))
        ) {

            div.setAttribute('class', 'map-mark');

            board[index] = 1;
            startingIndex = -1;
            secondIndex = -1;

            console.log('ship complete!');
            shipsToPlace--;
            render();

            if (turn === 1) {
                pOneBoard = board;
            } else {
                pTwoBoard = board;
            }

            if (shipsToPlace === 0) {
                message.innerText = `Your ships have been placed!`;
                nextBtn.style.display = 'block';
                table.removeEventListener('click', selectShips);
                if (turn === 1) {
                    nextBtn.addEventListener('click', initializeShips);
                } else {
                    nextBtn.addEventListener('click', initializePlay);
                }
            }
        }
    }
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

// BUG LOG
// 1. ships cannot be placed all in one line or the game will forever freeze because the last ship cannot fit in the line and thus cant be completed
// ships sunk refers to how many hits (red divs) are on the board, not in terms of the ships as they were placed
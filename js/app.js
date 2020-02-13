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
let pOneBoard;
let pTwoBoard;

let placeShips;

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
resetBtn.addEventListener('click', initialize);
// table 'click' listener in initialize function

// LOOK UP TURN
const lookup = {
    '1': 'Player 1',
    '-1': 'Player 2'
}

// FUNCTIONS
function render() {
    if (!placeShips) {
        shipsSunkSpan.innerText = `Ships sunk: ${shipsSunk}`;
        shipsLeftSpan.innerText = `Ships left to find: ${shipsLeft}`;
    } else if (placeShips) {
        shipsSunkSpan.innerText = '';
        shipsLeftSpan.innerText = '';
    }

    turnMessage.innerText = `${lookup[turn]}'s turn`;

    // updates divs
    for (let i = 0; i < board.length; i++) {
        if (board[i] === 0 || (board[i] === 1 && !placeShips)) {
            document.querySelectorAll('td div')[i].removeAttribute('class');
        } else if (board[i] === -1) {
            document.querySelectorAll('td div')[i].setAttribute('class', 'map-mark');
        } else if (board[i] === -2) {
            document.querySelectorAll('td div')[i].setAttribute('class', 'map-miss');
        }
    }

    // Checks for winner
    if (shipsLeft === 0) {
        message.innerHTML = `<strong>Congrats!</strong> You've won! Huzzah and all that.`;
        nextBtn.style.display = 'none';
    }
}

/*
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
*/

function initialize() {
    turn = -1;
    nextBtn.style.display = 'none';

    shipsSunk = 0;
    shipsLeft = 12;

    pOneShipsSunk = 0;
    pOneShipsLeft = 12;

    pTwoShipsSunk = 0;
    pTwoShipsLeft = 12;

    nextBtn.removeEventListener('click', play);
    initializeShips();
}

function initializeShips() {
    placeShips = true;
    board = new Array(64).fill(0);
    turn *= -1;
    message.innerText = `Place your ships!`;

    shipsToPlace = 4;
    table.addEventListener('click', selectShips);
    nextBtn.removeEventListener('click', initializeShips);
    render();
}

// 

function play() {
    turn *= -1;
    placeShips = false;
    // sets initial values
    if (turn === 1) {
        shipsSunk = pOneShipsSunk;
        shipsLeft = pOneShipsLeft;
    } else {
        shipsSunk = pTwoShipsSunk;
        shipsLeft = pTwoShipsLeft;
    }
    message.innerText = `Attack ye enemy!`;

    if (turn === 1) {
        board = pTwoBoard;
    } else {
        board = pOneBoard;
    }
    render();

    table.addEventListener('click', handleGuess);
    nextBtn.removeEventListener('click', play);
    nextBtn.style.display = 'none';
}

function handleGuess(event) {
    console.log('handleGuess running');
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

        message.innerText = 'Hit!';
        if (turn === 1) {
            pTwoBoard = board;

            pOneShipsSunk++;
            pOneShipsLeft--;

            shipsSunk = pOneShipsSunk;
            shipsLeft = pOneShipsLeft;
        } else {
            pOneBoard = board;

            pTwoShipsSunk++;
            pTwoShipsLeft--;

            shipsSunk = pTwoShipsSunk;
            shipsLeft = pTwoShipsLeft;
        }
        render();
    } else if (board[index] === 0) {
        div.setAttribute('class', 'map-miss');
        board[index] = -2;

        if (turn === 1) {
            pTwoBoard = board;
        } else {
            pOneBoard = board;
        }

        message.innerText = 'Miss!';
    }
    table.removeEventListener('click', handleGuess);
    nextBtn.style.display = 'block';
    nextBtn.addEventListener('click', play);
    render();
}

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

            if (shipsToPlace === 0) {

                if (turn === 1) {
                    pOneBoard = board;
                } else {
                    pTwoBoard = board;
                }

                message.innerText = `Your ships have been placed!`;
                nextBtn.style.display = 'block';
                table.removeEventListener('click', selectShips);

                if (turn === 1) {
                    console.log('hello');
                    nextBtn.addEventListener('click', initializeShips);
                } else {
                    nextBtn.addEventListener('click', play);
                }
            }
        }
    }
}

initialize();

// BUG LOG
// 1. ships cannot be placed all in one line or the game will forever freeze because the last ship cannot fit in the line and thus cant be completed
// ships sunk refers to how many hits (red divs) are on the board, not in terms of the ships as they were placed
// if uer clicks a previously used space when battling, the eventlistener will be removed and it will act like it was selected and theyll lose their turn
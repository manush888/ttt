// script.js

const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty-level');
const boardSizeSelect = document.getElementById('board-size');
let gameBoard = [];
const human = 'O';
const ai = 'X';
let currentPlayer = human;

if (window.Worker) {
    const workerX = new Worker('workerX.js');
    const workerO = new Worker('workerO.js');

    workerX.onmessage = function(e) {
        const bestMove = e.data;
        makeMove(bestMove, ai);
        currentPlayer = human;
    };

    workerO.onmessage = function(e) {
        const bestMove = e.data;
        makeMove(bestMove, human);
        currentPlayer = ai;
    };

    function handleCellClick(event) {
        const index = event.target.getAttribute('data-index');
        if (!gameBoard[index] && !isGameOver(gameBoard) && currentPlayer === human) {
            makeMove(index, human);
            if (!isGameOver(gameBoard)) {
                currentPlayer = ai;
                setTimeout(() => {
                    const difficulty = difficultySelect.value;
                    workerX.postMessage({ gameBoard, player: ai, size, difficulty });
                }, 500); // AI waits 500ms before making a move
            }
        }
    }

    function makeMove(index, player) {
        gameBoard[index] = player;
        boardElement.children[index].textContent = player;
        if (checkWin(gameBoard, player, size)) {
            message.textContent = `${player} wins!`;
        } else if (gameBoard.every(cell => cell)) {
            message.textContent = "It's a tie!";
        }
    }

    function restartGame() {
        size = parseInt(boardSizeSelect.value);
        createBoardUI(size);
        gameBoard = Array(size * size).fill(null);
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
        message.textContent = '';
        currentPlayer = human;
    }

    restartButton.addEventListener('click', restartGame);
    boardSizeSelect.addEventListener('change', restartGame);

    restartGame();
}

function isGameOver(board) {
    return checkWin(board, human, size) || checkWin(board, ai, size) || board.every(cell => cell);
}

function checkWin(board, player, size) {
    const winPatterns = [];

    // Rows
    for (let i = 0; i < size; i++) {
        winPatterns.push([...Array(size).keys()].map(j => i * size + j));
    }

    // Columns
    for (let i = 0; i < size; i++) {
        winPatterns.push([...Array(size).keys()].map(j => i + j * size));
    }

    // Diagonals
    winPatterns.push([...Array(size).keys()].map(i => i * (size + 1)));
    winPatterns.push([...Array(size).keys()].map(i => (i + 1) * (size - 1)));

    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}

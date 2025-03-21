import GameLogic from './game-logic.js';
import Board from './board.js';

// Initialize socket connection
const socket = io();

// Initialize game components
const canvas = document.getElementById('gameCanvas');
const startBtn = document.getElementById('startBtn');
const hintBtn = document.getElementById('hintBtn');
const messageDiv = document.getElementById('message');

const gameLogic = new GameLogic();
const board = new Board(canvas, gameLogic);

let currentGameId = null;

// Event Listeners
startBtn.addEventListener('click', () => {
    socket.emit('createGame');
    messageDiv.textContent = 'Starting new game...';
});

hintBtn.addEventListener('click', () => {
    if (!currentGameId || !gameLogic.gameStarted) {
        alert('Please start a game first!');
        return;
    }
    socket.emit('requestHint', currentGameId);
});

canvas.addEventListener('click', (event) => {
    if (!gameLogic.gameStarted) {
        alert('Please start a game first!');
        return;
    }

    const coords = board.getTileCoordinates(event.clientX, event.clientY);
    if (!coords) return;

    const result = gameLogic.selectTile(coords.row, coords.col);
    if (!result) return;

    if (result.type === 'select') {
        board.drawBoard(gameLogic.board);
    } else if (result.type === 'move') {
        socket.emit('makeMove', {
            gameId: currentGameId,
            start: result.start,
            end: result.end
        });
    }
});

// Socket event handlers
socket.on('gameCreated', ({ gameId, board: initialBoard }) => {
    currentGameId = gameId;
    gameLogic.initGame(initialBoard);
    board.drawBoard(gameLogic.board);
    messageDiv.textContent = 'Game started! Find matching pairs to connect.';
});

socket.on('moveResult', ({ success, board: newBoard }) => {
    if (success) {
        gameLogic.board = newBoard;
        gameLogic.clearSelection();
        board.drawBoard(gameLogic.board);

        if (gameLogic.isGameOver()) {
            messageDiv.textContent = 'Congratulations! You won!';
            currentGameId = null;
            gameLogic.reset();
        }
    } else {
        gameLogic.clearSelection();
        board.drawBoard(gameLogic.board);
        messageDiv.textContent = 'Invalid move. Try again!';
    }
});

socket.on('hintResult', (hint) => {
    gameLogic.showHint(hint);
    if (hint) {
        board.drawBoard(gameLogic.board);
    } else {
        messageDiv.textContent = 'No available moves found!';
    }
});

socket.on('error', (message) => {
    messageDiv.textContent = `Error: ${message}`;
});
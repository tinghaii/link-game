const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const Game = require('./game');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Static file service
app.use(express.static(path.join(__dirname, '../client')));

// Game state
const games = new Map();

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected with ID:', socket.id);

    // Create new game
    socket.on('createGame', () => {
        const gameId = Math.random().toString(36).substring(7);
        const game = new Game();
        console.log('Creating new game:', gameId);
        console.log('Initial board:', game.board);
        
        games.set(gameId, {
            id: gameId,
            players: [socket.id],
            game: game,
            status: 'playing'
        });
        socket.join(gameId);
        socket.emit('gameCreated', gameId);
        
        // Immediately start the game for single player
        socket.emit('gameStart', {
            board: game.board,
            currentPlayer: socket.id
        });
        
        console.log('Game created and started for single player');
    });

    // Handle hint request
    socket.on('requestHint', (gameId) => {
        console.log('Hint requested for game:', gameId);
        const gameData = games.get(gameId);
        if (gameData && gameData.game) {
            const hint = gameData.game.findHint();
            console.log('Found hint:', hint);
            socket.emit('hintResult', hint);
        } else {
            console.log('Failed to find hint. Game data:', gameData);
        }
    });

    // Handle player move
    socket.on('makeMove', (data) => {
        console.log('Move requested:', data);
        const { gameId, start, end } = data;
        const gameData = games.get(gameId);
        if (gameData && gameData.game) {
            const result = gameData.game.makeMove(start, end);
            console.log('Move result:', result);
            console.log('Updated board:', gameData.game.board);
            
            io.to(gameId).emit('moveMade', {
                success: result,
                board: gameData.game.board,
                start,
                end
            });

            // Check if game is over
            if (gameData.game.isGameOver()) {
                console.log('Game over! Winner:', socket.id);
                io.to(gameId).emit('gameOver', {
                    winner: socket.id
                });
                games.delete(gameId);
            }
        } else {
            console.log('Failed to make move. Game data:', gameData);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Clean up game state
        games.forEach((gameData, gameId) => {
            if (gameData.players.includes(socket.id)) {
                console.log('Cleaning up game:', gameId);
                io.to(gameId).emit('playerDisconnected');
                games.delete(gameId);
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
class Game {
    constructor(rows = 8, cols = 8) {
        this.rows = rows;
        this.cols = cols;
        this.board = [];
        this.initBoard();
    }

    initBoard() {
        // Create empty board
        this.board = Array(this.rows).fill(null)
            .map(() => Array(this.cols).fill(null));
        
        // Generate matching patterns
        const totalPairs = (this.rows * this.cols) / 2;
        const items = [];
        
        // Create pairs array
        for (let i = 0; i < totalPairs; i++) {
            items.push(i);
            items.push(i);
        }

        // Shuffle array randomly
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }

        // Fill the board
        let index = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = items[index++];
            }
        }
    }

    isValidPosition(x, y) {
        return x >= 0 && x < this.rows && y >= 0 && y < this.cols;
    }

    canConnect(start, end) {
        if (!this.isValidPosition(start.x, start.y) || 
            !this.isValidPosition(end.x, end.y)) {
            return false;
        }

        // Check if patterns match
        if (this.board[start.x][start.y] !== this.board[end.x][end.y]) {
            return false;
        }

        return this.findPath(start, end);
    }

    findPath(start, end) {
        // Implement A* pathfinding algorithm
        const visited = new Set();
        const queue = [{
            pos: start,
            path: [start],
            turns: 0
        }];

        while (queue.length > 0) {
            const current = queue.shift();
            const {x, y} = current.pos;

            // Reached destination
            if (x === end.x && y === end.y && current.turns <= 2) {
                return true;
            }

            // Check all four directions
            const directions = [
                {dx: 0, dy: 1},  // right
                {dx: 0, dy: -1}, // left
                {dx: 1, dy: 0},  // down
                {dx: -1, dy: 0}  // up
            ];

            for (const dir of directions) {
                let newX = x + dir.dx;
                let newY = y + dir.dy;
                
                // Check if we can continue moving in this direction
                while (this.isValidPosition(newX, newY)) {
                    const key = `${newX},${newY}`;
                    if (!visited.has(key)) {
                        visited.add(key);
                        const newTurns = current.path.length >= 2 &&
                            (current.path[current.path.length-1].x - current.path[current.path.length-2].x) * dir.dx +
                            (current.path[current.path.length-1].y - current.path[current.path.length-2].y) * dir.dy === 0
                            ? current.turns + 1 : current.turns;

                        if (newTurns <= 2) {
                            queue.push({
                                pos: {x: newX, y: newY},
                                path: [...current.path, {x: newX, y: newY}],
                                turns: newTurns
                            });
                        }
                    }
                    
                    // Stop if we hit a non-empty tile
                    if (this.board[newX][newY] !== null) {
                        break;
                    }
                    
                    newX += dir.dx;
                    newY += dir.dy;
                }
            }
        }

        return false;
    }

    makeMove(start, end) {
        if (this.canConnect(start, end)) {
            // Clear matching patterns
            this.board[start.x][start.y] = null;
            this.board[end.x][end.y] = null;
            return true;
        }
        return false;
    }

    isGameOver() {
        // Check if any patterns remain
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] !== null) {
                    return false;
                }
            }
        }
        return true;
    }

    findHint() {
        // Search the entire board for connectable matching patterns
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] === null) continue;
                
                // Look for matching patterns from current position
                for (let x = i; x < this.rows; x++) {
                    for (let y = (x === i ? j + 1 : 0); y < this.cols; y++) {
                        if (this.board[x][y] === null) continue;
                        
                        // Check if patterns match and can be connected
                        if (this.board[i][j] === this.board[x][y]) {
                            const start = { x: i, y: j };
                            const end = { x, y };
                            if (this.canConnect(start, end)) {
                                return { start, end };
                            }
                        }
                    }
                }
            }
        }
        return null; // No connectable patterns found
    }
}

module.exports = Game;
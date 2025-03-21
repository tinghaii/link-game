class GameLogic {
    constructor() {
        this.board = [];
        this.rows = 8;
        this.cols = 8;
        this.selectedTile = null;
        this.gameStarted = false;
        this.hintTiles = null;
        this.hintTimer = null;
    }

    initGame(board) {
        this.board = board;
        this.selectedTile = null;
        this.gameStarted = true;
        this.clearHint();
    }

    reset() {
        this.board = [];
        this.selectedTile = null;
        this.gameStarted = false;
        this.clearHint();
    }

    isValidPosition(x, y) {
        return x >= 0 && x < this.rows && y >= 0 && y < this.cols;
    }

    selectTile(x, y) {
        if (!this.isValidPosition(x, y) || this.board[x][y] === null) {
            return null;
        }

        if (this.selectedTile === null) {
            this.selectedTile = { x, y };
            return { type: 'select', tile: this.selectedTile };
        } else {
            const move = {
                type: 'move',
                start: this.selectedTile,
                end: { x, y }
            };
            this.selectedTile = null;
            return move;
        }
    }

    clearSelection() {
        this.selectedTile = null;
    }

    getSelectedTile() {
        return this.selectedTile;
    }

    showHint(hint) {
        this.clearHint();
        if (hint) {
            this.hintTiles = hint;
            // Clear hint after 3 seconds
            this.hintTimer = setTimeout(() => {
                this.clearHint();
            }, 3000);
        }
    }

    clearHint() {
        if (this.hintTimer) {
            clearTimeout(this.hintTimer);
            this.hintTimer = null;
        }
        this.hintTiles = null;
    }

    getHintTiles() {
        return this.hintTiles;
    }

    updateBoard(x, y, value) {
        if (this.isValidPosition(x, y)) {
            this.board[x][y] = value;
        }
    }

    isGameOver() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] !== null) {
                    return false;
                }
            }
        }
        return true;
    }
}

export default GameLogic;
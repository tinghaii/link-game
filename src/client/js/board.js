class Board {
    constructor(canvas, gameLogic) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameLogic = gameLogic;
        this.tileSize = 60;
        this.padding = 10;
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
            '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
            '#E74C3C', '#2ECC71', '#F1C40F', '#1ABC9C'
        ];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const boardWidth = this.gameLogic.cols * (this.tileSize + this.padding) + this.padding;
        const boardHeight = this.gameLogic.rows * (this.tileSize + this.padding) + this.padding;
        
        this.canvas.width = boardWidth;
        this.canvas.height = boardHeight;
    }

    drawBoard(board) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        this.ctx.fillStyle = '#F0F0F0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw tiles
        for (let i = 0; i < this.gameLogic.rows; i++) {
            for (let j = 0; j < this.gameLogic.cols; j++) {
                const value = board[i][j];
                if (value !== null) {
                    this.drawTile(i, j, value);
                }
            }
        }

        // Draw selected tile
        const selectedTile = this.gameLogic.getSelectedTile();
        if (selectedTile) {
            this.drawSelection(selectedTile.x, selectedTile.y, '#4CAF50');
        }

        // Draw hint tiles if available
        const hintTiles = this.gameLogic.getHintTiles();
        if (hintTiles) {
            this.drawSelection(hintTiles.start.x, hintTiles.start.y, '#FFA500');
            this.drawSelection(hintTiles.end.x, hintTiles.end.y, '#FFA500');
        }
    }

    drawTile(row, col, value) {
        const x = col * (this.tileSize + this.padding) + this.padding;
        const y = row * (this.tileSize + this.padding) + this.padding;

        // Draw tile background
        this.ctx.fillStyle = this.colors[value % this.colors.length];
        this.ctx.fillRect(x, y, this.tileSize, this.tileSize);

        // Draw tile border
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, this.tileSize, this.tileSize);

        // Draw tile value
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            value.toString(),
            x + this.tileSize / 2,
            y + this.tileSize / 2
        );
    }

    drawSelection(row, col, color) {
        const x = col * (this.tileSize + this.padding) + this.padding;
        const y = row * (this.tileSize + this.padding) + this.padding;

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(
            x - 2,
            y - 2,
            this.tileSize + 4,
            this.tileSize + 4
        );
    }

    getTileCoordinates(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const col = Math.floor((x - this.padding) / (this.tileSize + this.padding));
        const row = Math.floor((y - this.padding) / (this.tileSize + this.padding));

        if (this.gameLogic.isValidPosition(row, col)) {
            return { row, col };
        }
        return null;
    }
}

export default Board;
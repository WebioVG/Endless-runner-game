export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Creepster';
    }

    draw() {
        this.game.ctx.save();

        this.game.ctx.shadowOffsetX = 2;
        this.game.ctx.shadowOffsetY = 2;
        this.game.ctx.shadowColor = 'white';
        this.game.ctx.shadowBlur = 0;
        this.game.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        this.game.ctx.textAlign = 'left';
        this.game.ctx.fillStyle = this.game.fontColor;

        // Score
        this.game.ctx.fillText(`Score: ${this.game.score}`, 20, 50);
        // Timer
        this.game.ctx.font = `${this.fontSize * 0.8}px ${this.fontFamily}`;
        this.game.ctx.fillText(`Time left: ${(this.game.timeLeft * 0.001).toFixed(1)}s`, 20, 80);
        // Lives
        for (let i = 0; i < this.game.lives; i++) {
            this.game.ctx.drawImage(lives, 25 * i + 20, 95, 25, 25);
        }
        // Game Over
        if (this.game.gameOver) {
            this.game.ctx.textAlign = 'center';
            this.game.ctx.font = `${this.fontSize * 2}px ${this.fontFamily}`;
            
            // Game over message
            if (this.game.score > 2) {
                this.game.ctx.fillText('You won!', this.game.width * 0.5, this.game.height * 0.5 - 20);
                this.game.ctx.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
                this.game.ctx.fillText('Night creatures went home!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                this.game.ctx.fillText('Game over', this.game.width * 0.5, this.game.height * 0.5);
            }
        }

        this.game.ctx.restore();
    }
}
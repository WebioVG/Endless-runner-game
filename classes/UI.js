export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Creepster';
    }

    draw() {
        this.game.ctx.save();

        // General UI settings
        this.game.ctx.shadowOffsetX = 2;
        this.game.ctx.shadowOffsetY = 2;
        this.game.ctx.shadowColor = 'white';
        this.game.ctx.shadowBlur = 0;
        this.game.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        this.game.ctx.textAlign = 'left';
        this.game.ctx.fillStyle = this.game.fontColor;

        // Current score
        this.game.ctx.fillText(`Score: ${this.game.score}`, 20, 50);

        // Timer
        this.game.ctx.font = `${this.fontSize * 0.8}px ${this.fontFamily}`;
        this.game.ctx.fillText(`Time: ${(this.game.time * 0.001).toFixed(1)}s`, 20, 80);

        // Lives
        for (let i = 0; i < this.game.player.lives; i++) {
            this.game.ctx.drawImage(lives, 25 * i + 20, 95, 25, 25);
        }

        // Winning score
        this.game.ctx.fillText(`Winning score: ${this.game.winningScore}`, this.game.width - 200, 50);

        // Game Over
        if (this.game.gameOver) {
            // Game over general settings
            this.game.ctx.textAlign = 'center';
            this.game.ctx.font = `${this.fontSize * 2}px ${this.fontFamily}`;
            
            // Game over message
            if (this.game.score >= this.game.winningScore) {
                this.game.ctx.fillText('You won!', this.game.width * 0.5, this.game.height * 0.5 - 20);
                this.game.ctx.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
                this.game.ctx.fillText('Night creatures went home', this.game.width * 0.5, this.game.height * 0.5 + 20);
                this.game.ctx.fillText(`after you eliminated ${this.game.score} of them!`, this.game.width * 0.5, this.game.height * 0.5 + 45);
            } else {
                this.game.ctx.fillText('Game over', this.game.width * 0.5, this.game.height * 0.5);
            }
        }

        this.game.ctx.restore();
    }
}
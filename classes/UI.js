export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Helvetica';
    }

    draw() {
        this.game.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        this.game.ctx.textAlign = 'left';
        this.game.ctx.fillStyle = this.game.fontColor;

        // Score
        this.game.ctx.fillText(`Score: ${this.game.score}`, 20, 50);
    }
}
class Particle {
    constructor(game) {
        this.game = game;
        this.markedForDeletion = false;
    }

    update() {
        this.x -= this.speedX + this.game.speed;
        this.y -= this.speedY;
        this.size *= 0.95;
        if (this.size < 0.5) this.markedForDeletion = true;
    }
}

export class Dust extends Particle {
    constructor(game, x, y) {
        super(game, x, y);
        this.size = Math.random() * (10 - 3) + 3;
        this.x = x;
        this.y = y;
        this.speedX = Math.random();
        this.speedY = Math.random();
        this.color = 'rgba(20, 20, 20, 0.3)';
    }

    draw() {
        this.game.ctx.beginPath();
        this.game.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.fill();
    }
}

export class Splash extends Particle {
    constructor(game) {
        super(game);
    }
}

export class Fire extends Particle {
    constructor(game) {
        super(game);
    }
}
class Particle {
    constructor(game) {
        this.game = game;
        this.markedForDeletion = false;
    }

    update() {
        this.x -= this.speedX + this.game.speed;
        this.y -= this.speedY;
        this.size *= 0.97;
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
    constructor(game, x, y) {
        super(game, x, y);
    }
}

export class Fire extends Particle {
    constructor(game, x, y) {
        super(game, x, y);
        this.image = fire;
        this.size = Math.random() * 100 + 50;
        this.x = x;
        this.y = y;
        this.speedX = 1;
        this.speedY = 1;
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1;
    }

    update() {
        super.update();
        this.angle += this.va;
        this.x += Math.sin(this.angle * 5);
    }

    draw() {
        this.game.ctx.save();
        this.game.ctx.translate(this.x, this.y);
        this.game.ctx.rotate(this.angle)
        this.game.ctx.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
        this.game.ctx.restore();
    }
}
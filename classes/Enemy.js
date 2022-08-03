class Enemy {
    constructor(game) {
        this.game = game;
        this.markedForDeletion = false;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 5;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
    }

    update(deltaTime) {
        // Check if the enemy is off screen
        if (this.x < 0 - this.width) {this.markedForDeletion = true; return;};

        // Sprite animation
        if (this.frameTimer > this. frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw() {
        this.game.ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

////////////////////
// FLYING ENEMIES //
////////////////////

class FlyingEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.4;
    }
}

export class Ghost extends FlyingEnemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 87;
        this.spriteHeight = 70;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.maxFrame = 5;
        this.image = enemy_ghost_3;
        this.vx = Math.random() * 0.12 + 0.07;
        this.angle = 0;
        this.va = Math.random() * 0.04 + 0.02;
        this.curve = Math.random() * 2 + 0.5;
    }

    update(deltaTime) {
        // Horizontal movement
        this.x -= this.vx * deltaTime + this.game.speed;

        // Vertical movement
        this.angle += this.va;
        this.y += Math.sin(this.angle) * this.curve;
        
        super.update(deltaTime);
    }

    draw() {
        // Add transparency to the ghost
        this.game.ctx.save();
        this.game.ctx.globalAlpha = 0.7;

        super.draw(this.game.ctx);

        this.game.ctx.restore();
    }
}

export class Fly extends FlyingEnemy {
    constructor(game){
        super(game);
        this.spriteWidth = 60;
        this.spriteHeight = 44;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.image = enemy_fly;
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.maxFrame = 5;
        this.angle = 0;
        this.va = Math.random() * 0.01 + 0.03;
    }

    update(deltaTime) {
        // Horizontal Movement
        this.x -= this.speedX + this.game.speed;

        // Vertical movement
        this.angle += this.va;
        this.y += Math.sin(this.angle);

        super.update(deltaTime);
    }
}

////////////////////
// GROUND ENEMIES //
////////////////////

class GroundEnemy extends Enemy {
    constructor(game){
        super(game);
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = this.game.height - this.game.groundMargin;
    }
}

export class Worm extends GroundEnemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 80;
        this.spriteHeight = 60;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.y -= this.height;
        this.maxFrame = 5;
        this.image = enemy_worm;
        this.vx = Math.random() * 0.08 + 0.03;
    }

    update(deltaTime) {
        // Horizontal movement
        this.x -= this.vx * deltaTime + this.game.speed;
        
        super.update(deltaTime);
    }
}

//////////////////////
// CLIMBING ENEMIES //
//////////////////////

class ClimbingEnemy extends Enemy {
    constructor(game){
        super(game);
    }
}

export class Spider extends ClimbingEnemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 310;
        this.spriteHeight = 175;
        this.width = this.spriteWidth * 0.3;
        this.height = this.spriteHeight * 0.3;
        this.x = Math.random() * this.game.width;
        this.y = Math.random() * (this.height - 100) - this.height;
        this.image = enemy_spider;
        this.vx = 0;
        this.vy = Math.random() * 0.1 + 0.1;
        this.maxLength = Math.random() * (this.game.height * 0.45) + this.game.height * 0.2;
    }

    update(deltaTime) {
        // Vertical movement
        this.y += this.vy * deltaTime;
        if (this.y > this.maxLength) this.vy *= -1;

        // Check if the enemy is off screen
        if (this.y < 0 - this.height * 2) this.markedForDeletion = true;

        super.update(deltaTime);
    }

    draw(ctx) {
        // Spider web
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, 0);
        ctx.lineTo(this.x + this.width/2, this.y + 10);
        ctx.stroke();

        super.draw(ctx);
    }
}
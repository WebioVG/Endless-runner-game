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
        this.sizeModifier = Math.random() * (1.05 - 0.95) + 0.95;
    }

    update(deltaTime) {
        // Check if the enemy is off screen
        if (this.x < 0 - this.width) {this.markedForDeletion = true; return;};

        // Sprite animation
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw() {
        if (this.game.debug) {
            this.game.ctx.strokeStyle = 'red';
            this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);
            this.game.ctx.strokeStyle = 'black';
        }

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
        this.y = Math.random() * (this.game.height * 0.6 - this.game.height * 0.2) + this.game.height * 0.2;
    }
}

export class Ghost extends FlyingEnemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 87;
        this.spriteHeight = 70;
        this.width = this.spriteWidth * 1.2 * this.sizeModifier;
        this.height = this.spriteHeight * 1.2 * this.sizeModifier;
        this.maxFrame = 5;
        this.image = enemy_ghost_3;
        this.vx = Math.random() * 0.12 + 0.07;
        this.angle = 0;
        this.va = Math.random() * 0.04 + 0.02;
        this.curve = Math.random() * 2 + 0.5;
    }

    update(deltaTime) {
        // Horizontal movement
        if (this.game.speed >= 1) this.x -= this.vx * deltaTime * this.game.speed;
        else this.x -= this.vx * deltaTime;

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
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.image = enemy_fly;
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.maxFrame = 5;
        this.angle = 0;
        this.va = Math.random() * 0.01 + 0.03;
    }

    update(deltaTime) {
        // Horizontal Movement
        if (this.game.speed >= 1) this.x -= this.speedX * this.game.speed;
        else this.x -= this.speedX;

        // Vertical movement
        this.angle += this.va;
        this.y += Math.sin(this.angle);

        super.update(deltaTime);
    }
}

export class Bat1 extends FlyingEnemy {
    constructor(game){
        super(game);
        this.spriteWidth = 83;
        this.spriteHeight = 44;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.image = enemy_bat_1;
        this.speedX = Math.random() * (3 - 2) + 1;
        this.speedY = Math.random() * (5 - 2) + 2;
        this.boundaryYPlus = this.y - Math.random() * (5 - 1) + 2;
        this.boundaryYMinus = this.y + this.height + Math.random() * (5 - 1) + 2;
        this.maxFrame = 5;
        this.flapSpeed = Math.round(Math.random() * (50 - 5) + 5);
    }

    update(deltaTime) {
        // Horizontal Movement
        if (this.game.speed >= 1) this.x -= this.speedX * this.game.speed;
        else this.x -= this.speedX;

        // Vertical movement
        this.y += this.speedY;
        if (this.y < this.boundaryYPlus) this.speedY = -this.speedY;
        if (this.y > this.boundaryYMinus) this.speedY = -this.speedY;
    
        super.update(deltaTime);

        // Randomize flap speed
        this.frameTimer += this.flapSpeed;
    }
}

////////////////////
// GROUND ENEMIES //
////////////////////

class GroundEnemy extends Enemy {
    constructor(game){
        super(game);
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.boundaryYPlus = this.game.height - this.game.groundMargin + 10;
        this.boundaryYMinus = this.game.height - 10;
    }
}

export class Worm extends GroundEnemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 80;
        this.spriteHeight = 60;
        this.width = this.spriteWidth * 1.1 * this.sizeModifier;
        this.height = this.spriteHeight * 1.1 * this.sizeModifier;
        this.boundaryYPlus -= this.height;
        this.boundaryYMinus -= this.height;
        this.y = Math.random() * (this.boundaryYPlus - this.boundaryYMinus) + this.boundaryYMinus;
        this.maxFrame = 5;
        this.image = enemy_worm;
        this.vx = Math.random() * (0.08 - 0.03) + 0.03;
    }

    update(deltaTime) {
        // Horizontal movement
        this.x -= this.vx * deltaTime + this.game.speed;
        
        super.update(deltaTime);
    }
}

export class Zombie extends GroundEnemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 292;
        this.spriteHeight = 410;
        this.width = this.spriteWidth * 0.3 * this.sizeModifier;
        this.height = this.spriteHeight * 0.3 * this.sizeModifier;
        this.boundaryYPlus -= this.height;
        this.boundaryYMinus -= this.height;
        this.y = Math.random() * (this.boundaryYPlus - this.boundaryYMinus) + this.boundaryYMinus;
        this.maxFrame = 7;
        this.image = enemy_zombie;
        this.vx = (Math.random() * (0.13 - 0.07) + 0.07);
    }

    update(deltaTime) {
        // Horizontal movement
        if (this.game.speed >= 1) this.x -= this.vx * deltaTime * this.game.speed;
        else this.x -= this.vx * deltaTime;
        
        super.update(deltaTime);
    }
}

export class BigZombie extends GroundEnemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 292;
        this.spriteHeight = 410;
        this.sizeBoost = Math.random() * (2.5 - 2) + 2;
        this.width = this.spriteWidth * 0.3 * this.sizeModifier * this.sizeBoost;
        this.height = this.spriteHeight * 0.3 * this.sizeModifier * this.sizeBoost;
        this.boundaryYPlus -= this.height;
        this.boundaryYMinus -= this.height;
        this.y = Math.random() * (this.boundaryYPlus - this.boundaryYMinus) + this.boundaryYMinus;
        this.maxFrame = 7;
        this.image = enemy_zombie;
        this.vx = (Math.random() * (0.13 - 0.07) + 0.07);
    }

    update(deltaTime) {
        // Horizontal movement
        if (this.game.speed >= 1) this.x -= this.vx * deltaTime * this.game.speed;
        else this.x -= this.vx * deltaTime;
        
        super.update(deltaTime);
    }
}

export class Plant extends GroundEnemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 60;
        this.spriteHeight = 87;
        this.width = this.spriteWidth * 1.2 * this.sizeModifier;
        this.height = this.spriteHeight * 1.2 * this.sizeModifier;
        this.boundaryYPlus -= this.height;
        this.boundaryYMinus -= this.height;
        this.y = Math.random() * (this.boundaryYPlus - this.boundaryYMinus) + this.boundaryYMinus;
        this.maxFrame = 1;
        this.image = enemy_plant;
    }
    update(deltaTime) {
        // Horizontal movement
        this.x -= this.game.speed;

        super.update(deltaTime);
    }
}

export class Hand extends GroundEnemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 56;
        this.spriteHeight = 80;
        this.width = this.spriteWidth * 1.65 * this.sizeModifier;
        this.height = this.spriteHeight * 1.65 * this.sizeModifier;
        this.boundaryYPlus -= this.height;
        this.boundaryYMinus -= this.height;
        this.y = Math.random() * (this.boundaryYPlus - this.boundaryYMinus) + this.boundaryYMinus;
        this.maxFrame = 7;
        this.image = enemy_hand;
    }
    update(deltaTime) {
        // Horizontal movement
        this.x -= this.game.speed;

        super.update(deltaTime);
    }
}

//////////////////////
// CLIMBING ENEMIES //
//////////////////////

class ClimbingEnemy extends Enemy {
    constructor(game){
        super(game);
        this.vx = 0;
    }

    update(deltaTime) {
        // Vertical movement
        this.y += this.vy * deltaTime;
        if (this.y > this.maxLength) this.vy *= -1;

        // Check if the enemy is off screen
        if (this.y < 0 - this.height) this.markedForDeletion = true;

        super.update(deltaTime);
    }

    draw() {
        // Spider web
        this.game.ctx.beginPath();
        this.game.ctx.moveTo(this.x + this.width * 0.5, 0);
        this.game.ctx.lineTo(this.x + this.width * 0.5, this.y + 10);
        this.game.ctx.stroke();

        super.draw(this.game.ctx);
    }
}

export class Spider extends ClimbingEnemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 310;
        this.spriteHeight = 175;
        this.width = this.spriteWidth * 0.35 * this.sizeModifier;
        this.height = this.spriteHeight * 0.35 * this.sizeModifier;
        this.maxFrame = 5;
        this.image = enemy_spider;
        this.x = Math.random() * ((this.game.width - this.width) - this.width) + this.width;
        this.y = -this.height;
        this.vy = Math.random() * 0.1 + 0.1;
        this.maxLengthMinimum = this.game.height * 0.25;
        this.maxLengthMaximum = this.game.height * 0.6;
        this.maxLength = Math.random() * (this.maxLengthMaximum - this.maxLengthMinimum) + this.maxLengthMinimum;
    }
}

export class BigSpider extends ClimbingEnemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 120;
        this.spriteHeight = 144;
        this.width = this.spriteWidth * 1.5 * this.sizeModifier;
        this.height = this.spriteHeight * 1.5 * this.sizeModifier;
        this.maxFrame = 5;
        this.image = enemy_spider_big;
        this.x = Math.random() * ((this.game.width - this.width) - this.width) + this.width;
        this.y = -this.height;
        this.vy = Math.random() * 0.1 + 0.1;
        this.maxLengthMinimum = this.game.height * 0.15;
        this.maxLengthMaximum = this.game.height * 0.4;
        this.maxLength = Math.random() * (this.maxLengthMaximum - this.maxLengthMinimum) + this.maxLengthMinimum;
    }
}
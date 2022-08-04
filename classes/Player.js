import { CollisionAnimation } from "./CollisionAnimation.js";
import { Diving, Falling, Hit, Jumping, Rolling, Running, Sitting } from "./State.js";

export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.5;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = playerImage;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 5;
        this.states = [ new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game) ];
        this.currentState = this.states[0];
    }

    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input);

        // Horizontal movement
        this.x += this.speed;
        if (this.tryMovingTo(input, 'right') && !(this.currentState instanceof Hit)) this.speed = this.maxSpeed;
        else if (this.tryMovingTo(input, 'left') && !(this.currentState instanceof Hit)) this.speed = -this.maxSpeed;
        else this.speed = 0;
        // Horizontal boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // Vertical movement
        if (this.tryMovingTo(input, 'up') && this.onGround()) this.vy -= 20;
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy= 0;
        // Vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;
        if (this.y < 0) this.y = 0;

        // Sprite animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw() {
        if (this.game.debug) this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);

        this.game.ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x && 
                enemy.y < this.y + this.height && 
                enemy.y + enemy.height > this.y
            ) {
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
                if (this.currentState instanceof Rolling || this.currentState instanceof Diving) this.game.score++;
                else {
                    this.setState(6, 0);
                    this.game.lives--;
                    if (this.game.lives <= 0) this.game.gameOver = true;
                }
            }
        });
    }

    /**
     * Expects the input and the movement ('up', 'right', 'down', 'left'). Returns true or false whether the input includes the rights keys or not.
     */
     tryMovingTo (input, movement) {
        switch (movement) {
            case 'up': return (input.includes('ArrowUp') || input.includes('z') || input.includes('Z'));
            case 'right': return (input.includes('ArrowRight') || input.includes('d') || input.includes('D'));
            case 'down': return (input.includes('ArrowDown') || input.includes('s') || input.includes('S'));
            case 'left': return (input.includes('ArrowLeft') || input.includes('q') || input.includes('Q'));
            default: return false;
        }
    }
}
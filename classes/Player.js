import { Falling, Jumping, Running, Sitting } from "./State.js";

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
        this.states = [ new Sitting(this), new Running(this), new Jumping(this), new Falling(this) ];
        this.currentState = this.states[0];
    }

    update(input, deltaTime) {
        this.currentState.handleInput(input);

        // horizontal movement
        this.x += this.speed;
        if (input.includes('ArrowRight')) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
        else this.speed = 0;
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // vertical movement
        if (input.includes('ArrowUp') && this.onGround()) this.vy -= 20;
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy= 0;

        // sprite animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw() {
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
}
import { StandingLeft, StandingRight, SittingLeft, SittingRight, RunningLeft, RunningRight, JumpingLeft, JumpingRight, FallingLeft, FallingRight } from "./State.js";

export default class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.states = [
            new StandingLeft(this),
            new StandingRight(this),
            new SittingLeft(this),
            new SittingRight(this),
            new RunningLeft(this),
            new RunningRight(this),
            new JumpingLeft(this),
            new JumpingRight(this),
            new FallingLeft(this),
            new FallingRight(this),
        ];
        this.currentState = this.states[0];
        this.image = new Image();
        this.image.src = '../img/shadow_dog.png';
        this.width = 575;
        this.height = 523;
        this.x = this.gameWidth/2 - this.width/2;
        this.y = this.gameHeight - this.height;
        this.vy = 0;
        this.weight = 0.5;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 6
        this.speed = 0;
        this.maxSpeed = 5;
        this.fps = 30;
        this.frameTimer = 0;
        this.frameInterval = 1000 / this.fps;
    }

    draw(context, deltaTime) {
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y + 300, this.width/4, this.height/4);
    }

    update(input) {
        this.currentState.handleInput(input);

        this.x += this.speed;
        if (this.x <= 0) this.x = 0;
        else if (this.x >= this.gameWidth - this.width/4) this.x = this.gameWidth - this.width;

        this.y += this.vy;
        if (!this.onGround()) {
            this.vy += this.weight;
        } else {
            this.vy = 0;
        }
        if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
    }
    
    setState(state) {
        this.currentState = this.states[state];
        this.currentState.enter();
    }

    onGround() {
        return this.y >= this.gameHeight - this.height;
    }
}

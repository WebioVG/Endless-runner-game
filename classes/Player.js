import { CollisionAnimation } from "./CollisionAnimation.js";
import { BigSpider, BigZombie } from "./Enemy.js";
import { FloatingMessage } from "./FloatingMessage.js";
import { Diving, Lowering, Hit, Idle, Jumping, Rolling, Running, Sitting, Falling, Dizzy } from "./State.js";

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
        this.states = [ new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Lowering(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game), new Idle(this.game), new Falling(this.game), new Dizzy(this.game) ];
        this.currentState = null;
        this.lives = parseInt(document.getElementById('livesInput').value) ?? 5;
        this.energy = parseInt(document.getElementById('energyInput').value) ?? 5;
        this.allowRollingEvery = 50;
        this.isInvicible = false;
    }

    update(input, deltaTime) {
        this.currentState.handleInput(input);
        this.handleCollision();

        // Horizontal movement
        this.x += this.speed;
        if (this.tryMovingTo(input, 'right') && !(this.currentState instanceof Hit)) this.speed = this.maxSpeed;
        else if (this.tryMovingTo(input, 'left') && !(this.currentState instanceof Hit)) this.speed = -this.maxSpeed;
        else this.speed = 0;
        // Horizontal boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // Vertical movement
        if (this.tryMovingTo(input, 'up') && this.onGround() && !(this.currentState instanceof Sitting)) this.vy -= 20;
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
        if (this.game.debug) {
            this.game.ctx.strokeStyle = 'red';
            this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);
            this.game.ctx.strokeStyle = 'black';
        };

        this.game.ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    /**
     * Checks if the player is on the ground.
     */
    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    /**
     * Sets a new state to the player and adapts game speed.
     */
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    /**
     * Checks if the player is currently in collision with an enemy and returns it or null.
     */
    checkCollision() {
        let enemyColliding = null;
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x && 
                enemy.y < this.y + this.height && 
                enemy.y + enemy.height > this.y
            ) {
                enemyColliding = enemy;
            }
        });
        return enemyColliding;
    }

    /**
     *  Checks if the player is in collision and handles it.
     */
    handleCollision() {
        if (this.checkCollision() === null) return;
        let enemyColliding = this.checkCollision();

        // Delete the colliding enemy
        enemyColliding.markedForDeletion = true;
        // Add a new collision animation
        this.game.collisions.push(new CollisionAnimation(this.game, enemyColliding.x + enemyColliding.width * 0.5, enemyColliding.y + enemyColliding.height * 0.5))    
        // Collision outputs
        if (this.currentState instanceof Rolling || this.currentState instanceof Diving) this.#handleSuccess(enemyColliding);
        else this.#handleFailure(enemyColliding);
    }

    /**
     * Increases the current score and adds a '+1' floating message.
     */
    #handleSuccess(enemyColliding) {
        // Score
        if (enemyColliding instanceof BigZombie || enemyColliding instanceof BigSpider) {
            this.game.score += 3;
            this.game.floatingMessages.push(new FloatingMessage('+3', enemyColliding.x, enemyColliding.y, 120, 50));
        }
        else {
            this.game.score++;
            this.game.floatingMessages.push(new FloatingMessage('+1', enemyColliding.x, enemyColliding.y, 120, 50));
        }
        
        // Energy
        if (Math.random() > 0.85) {
            if (enemyColliding instanceof BigZombie || enemyColliding instanceof BigSpider) {
                this.game.player.energy += 3;
                this.game.floatingMessages.push(new FloatingMessage('+3', enemyColliding.x, enemyColliding.y, 120, 150));
            } else {
                this.game.player.energy++;
                this.game.floatingMessages.push(new FloatingMessage('+1', enemyColliding.x, enemyColliding.y, 120, 150));
            }
        }
    }

    /**
     * Sets the player state to hit or falling, decreases its lives number and sets game over if the player is out of lives.
     */
    #handleFailure(enemyColliding) {
        if (!this.isInvicible) {
            if (enemyColliding instanceof BigZombie || enemyColliding instanceof BigSpider) this.game.player.lives -= 3;
            else this.game.player.lives--;
        }
        if (this.game.player.lives <= 0) this.game.gameOver = true;

        if (this.game.player.onGround()) this.setState(6, 0); // sets state to Hit
        else this.setState(8, 0); // sets state to Falling
        
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
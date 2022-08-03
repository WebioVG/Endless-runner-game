import { Ghost, Spider, Worm } from "./Enemy.js";
import InputHandler from "./Input.js";
import { Background } from "./Layer.js";
import Player from "./player.js";

export default class Game {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.groundMargin = 80;
        this.speed = 0;
        this.maxSpeed = 3;
        this.background = new Background(this);
        this.player = new Player(this);
        this.input = new InputHandler();
        this.enemies = [];
        this.enemyInterval = 1000;
        this.enemyTimer = 0;
        this.enemyTypes = ['worm', 'ghost', 'spider'];
    }

    update(deltaTime) {
        // Background
        this.background.update();

        // Enemies
        this.enemies = this.enemies.filter(object => !object.markedForDeletion);
        if (this.enemyTimer < this.enemyInterval) this.enemyTimer+= deltaTime;
        else { this.#addNewEnemy(); this.enemyTimer = 0; };
        this.enemies.forEach(object => object.update(deltaTime));

        // Player
        this.player.update(this.input.keys, deltaTime);
    }

    draw() {
        this.background.draw(this.ctx);
        
        this.enemies.forEach(object => object.draw(this.ctx));

        this.player.draw();
    }

    #addNewEnemy() {
        const randomEnemy = this.enemyTypes[Math.round(Math.random() * this.enemyTypes.length)];
        if (randomEnemy === 'worm') this.enemies.push(new Worm(this));
        else if (randomEnemy === 'ghost') this.enemies.push(new Ghost(this));
        else if (randomEnemy === 'spider') this.enemies.push(new Spider(this));

        this.enemies.sort((a, b) => {
            return a.y - b.y;
        } );
    }
}
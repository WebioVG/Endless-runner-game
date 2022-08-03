import { Fly, Ghost, Plant, Spider, Worm } from "./Enemy.js";
import InputHandler from "./Input.js";
import Background from "./Layer.js";
import Player from "./player.js";
import { UI } from "./UI.js";

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
        this.input = new InputHandler(this);
        this.UI = new UI(this);
        this.enemies = [];
        this.enemyInterval = 1000;
        this.enemyTimer = 0;
        this.enemyTypes = ['ghost', 'fly', 'worm', 'spider', 'plant'];
        this.score = 0;
        this.debug = false;
        this.fontColor = 'black';
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
        this.UI.draw();
    }

    #addNewEnemy() {
        const randomEnemy = this.enemyTypes[Math.round(Math.random() * this.enemyTypes.length)];
        if (randomEnemy === 'fly') this.enemies.push(new Fly(this));
        else if (randomEnemy === 'ghost') this.enemies.push(new Ghost(this));
        else if (randomEnemy === 'worm') this.enemies.push(new Worm(this));
        else if (randomEnemy === 'spider') this.enemies.push(new Spider(this));
        else if (randomEnemy === 'plant' && this.speed > 0 && Math.random() * 0.5) this.enemies.push(new Plant(this));

        // if (this.speed > 0 && Math.random() * 0.5) this.enemies.push(new Plant(this));
        // console.log(this.enemies);

        this.enemies.sort((a, b) => {
            return a.y - b.y;
        } );
    }
}
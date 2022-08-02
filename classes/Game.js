import { Ghost, Spider, Worm } from "./Enemy.js";

export class Game {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.enemies = [];
        this.enemyInterval = 1000;
        this.enemyTimer = 0;
        this.enemyTypes = ['worm', 'ghost', 'spider'];
    }

    update(deltaTime) {
        this.enemies = this.enemies.filter(object => !object.markedForDeletion);

        // Check enemyTimer to add a knew enemy depending on enemyInterval
        if (this.enemyTimer < this.enemyInterval) this.enemyTimer+= deltaTime;
        else { this.#addNewEnemy(); this.enemyTimer = 0; };

        this.enemies.forEach(object => object.update(deltaTime));
    }

    draw() {
        this.enemies.forEach(object => object.draw(this.ctx));
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
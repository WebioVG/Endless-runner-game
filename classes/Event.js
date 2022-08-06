import { BigSpider, BigZombie } from "./Enemy.js";

class Event {
    constructor(game) {
        this.game = game;
        this.duration = 3000;
        this.messageUI = '';
    }
}

export class BigZombieSpawn extends Event {
    constructor(game) {
        super(game);
        this.messageUI = 'Big zombie noticed in the forest...';
    }

    enter() {
        this.game.enemies.push(new BigZombie(this.game));
    }
}

export class MassiveAttack extends Event {
    constructor(game) {
        super(game);
        this.enemiesNumber = Math.round(Math.random() * (12 - 8) + 8);
        this.messageUI = 'They gathered, be careful!';
    }

    enter() {
        for (let i = 0; i < this.enemiesNumber; i++) {
            this.game.addNewEnemy();
        }
    }
}

export class IncreaseEnemyNumber extends Event {
    constructor(game) {
        super(game);
        this.enemiesNumberMofidier = (Math.random() * (1.5 - 1.2) + 1.2).toFixed(1);
        this.messageUI = 'Seems like more enemies are spawning.';
    }

    enter() {
        this.game.enemyInterval = Math.round(this.game.enemyInterval / this.enemiesNumberMofidier);
    }
}

export class BigSpiderSpawn extends Event {
    constructor(game) {
        super(game);
        this.messageUI = 'Wow! What\'s that? ...';
    }

    enter() {
        console.log(this.game.enemies);
        this.game.enemies.push(new BigSpider(this.game));
        console.log(this.game.enemies);
    }
}
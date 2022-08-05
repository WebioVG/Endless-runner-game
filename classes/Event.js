import { Zombie } from "./Enemy.js";

class Event {
    constructor(game) {
        this.game = game;
    }
}

export class BigZombie extends Event {
    constructor(game) {
        super(game);
        this.sizeModifier = Math.random() * (2.5 - 2) + 2;
    }

    enter() {
        this.game.enemies.push(new Zombie(this.game, this.sizeModifier));
    }
}

export class MassiveAttack extends Event {
    constructor(game) {
        super(game);
        this.enemiesNumber = Math.round(Math.random() * (12 - 8) + 8);
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
    }

    enter() {
        this.game.enemyInterval = Math.round(this.game.enemyInterval / this.enemiesNumberMofidier);
    }
}
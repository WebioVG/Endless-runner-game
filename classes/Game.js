import { Fly, Ghost, Plant, Spider, Worm } from "./Enemy.js";
import InputHandler from "./Input.js";
import Background from "./Layer.js";
import Player from "./player.js";
import { UI } from "./UI.js";

export default class Game {
    constructor(ctx, width, height) {
        // Drawing parameters
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.groundMargin = 40;
        this.fontColor = 'black';

        // Features
        this.background = new Background(this);
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.UI = new UI(this);

        // Objects in the current game
        this.enemies = [];
        this.particles = [];
        this.collisions = [];

        // Game properties
        this.debug = false;
        this.speed = 0;
        this.maxSpeed = 3;
        this.maxParticles = 200;
        this.enemyTypes = ['ghost', 'fly', 'worm', 'spider', 'plant'];
        this.enemyInterval = 1000; // one enemy every enemyInterval ms
        this.enemyTimer = 0;
        this.time = 0;
        this.maxTime = 60000;
        this.timeLeft = this.maxTime - this.time;
        this.lives = 5;
        this.winningScore = 30;
        this.gameOver = false;

        // Outputs
        this.score = 0;
    }

    update(deltaTime) {
        // Time
        this.time += deltaTime;
        if (this.timeLeft > deltaTime) this.timeLeft -= deltaTime;
        else this.timeLeft = 0;
        if (this.time > this.maxTime) this.gameOver = true;

        // Background
        this.background.update();

        // Enemies
        this.enemies = this.enemies.filter(object => !object.markedForDeletion);
        if (this.enemyTimer < this.enemyInterval) this.enemyTimer+= deltaTime;
        else { this.#addNewEnemy(); this.enemyTimer = 0; };
        this.enemies.forEach(object => object.update(deltaTime));

        // Player
        this.player.update(this.input.keys, deltaTime);

        // Particles
        this.particles.forEach((particle, index) => {
            particle.update();
            if (particle.markedForDeletion) this.particles.splice(index, 1);
        });
        if (this.particles.length > this.maxParticles) this.particles.length = this.maxParticles;

        // Collisions
        this.collisions.forEach((collision, index) => {
            collision.update(deltaTime);
            if (collision.markedForDeletion) this.collisions.splice(index, 1);
        })
    }

    draw() {
        this.background.draw(this.ctx);
        this.enemies.forEach(object => object.draw(this.ctx));
        this.player.draw();
        this.particles.forEach(particle => particle.draw());
        this.collisions.forEach(collision => collision.draw());
        this.UI.draw();
    }

    #addNewEnemy() {
        const randomEnemy = this.enemyTypes[Math.round(Math.random() * this.enemyTypes.length)];
        if (randomEnemy === 'fly') this.enemies.push(new Fly(this));
        else if (randomEnemy === 'ghost') this.enemies.push(new Ghost(this));
        else if (randomEnemy === 'worm') this.enemies.push(new Worm(this));
        else if (randomEnemy === 'spider') this.enemies.push(new Spider(this));
        else if (randomEnemy === 'plant' && this.speed > 0 && Math.random() * 0.5) this.enemies.push(new Plant(this));

        // Debugger: add only one enemy type
        // if (this.speed > 0 && Math.random() * 0.5) this.enemies.push(new Plant(this));
        // console.log(this.enemies);

        this.enemies.sort((a, b) => {
            return a.y - b.y;
        } );
    }
}
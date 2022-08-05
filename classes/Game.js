import { Bat1, Fly, Ghost, Hand, Plant, Spider, Worm, Zombie } from "./Enemy.js";
import InputHandler from "./Input.js";
import Background from "./Background.js";
import Player from "./player.js";
import { UI } from "./UI.js";
import { BigZombie } from "./Event.js";

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
        this.player.currentState = this.player.states[0];
        this.player.currentState.enter();
        this.input = new InputHandler(this);
        this.UI = new UI(this);

        // Objects in the current game
        this.enemies = [];
        this.particles = [];
        this.collisions = [];
        this.floatingMessages = [];
        this.event = null;

        // Game properties
        this.debug = false;
        this.speed = 0;
        this.maxSpeed = parseInt(document.getElementById('maxSpeedInput').value) ?? 3;
        this.maxParticles = parseInt(document.getElementById('maxParticlesInput').value) ?? 100;
        this.eventTypes = ['bigZombie'];
        this.eventInterval = 60000;
        this.eventTimer = 0;
        this.enemyTypes = ['ghost', 'fly', 'worm', 'spider', 'plant', 'hand', 'zombie', 'bat1'];
        this.enemyInterval = parseInt(document.getElementById('enemyIntervalInput').value) ?? 1000; // one enemy every enemyInterval ms
        this.enemyTimer = 0;
        this.time = 1;
        this.winningScore = parseInt(document.getElementById('winningScoreInput').value) ?? 35;
        this.gameOver = false;

        // Outputs
        this.score = 0;
    }

    update(deltaTime) {
        // Time
        this.time += deltaTime;

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
        this.particles = this.particles.filter(particle => !particle.markedForDeletion);
        this.particles.forEach(particle => particle.update());
        if (this.particles.length > this.maxParticles) this.particles.length = this.maxParticles;
        
        // Collisions
        this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
        this.collisions.forEach(collision => collision.update(deltaTime))

        // Floating messages
        this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        this.floatingMessages.forEach(message => message.update());
        
        // Event
        if (this.eventTimer < this.eventInterval) this.eventTimer += deltaTime;
        else { this.#addNewEvent(); this.eventTimer = 0}
    }

    draw() {
        this.background.draw(this.ctx);
        this.enemies.forEach(object => object.draw(this.ctx));
        this.player.draw();
        this.particles.forEach(particle => particle.draw());
        this.collisions.forEach(collision => collision.draw());
        this.floatingMessages.forEach(message => message.draw(this.ctx));
        this.UI.draw();
    }

    /**
     * Adds a new random enemy to the game.
     */
    #addNewEnemy() {
        const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
        if (randomEnemy === 'fly') this.enemies.push(new Fly(this));
        else if (randomEnemy === 'bat1') this.enemies.push(new Bat1(this));
        else if (randomEnemy === 'ghost') this.enemies.push(new Ghost(this));
        else if (randomEnemy === 'worm') this.enemies.push(new Worm(this));
        else if (randomEnemy === 'zombie') this.enemies.push(new Zombie(this));
        else if (randomEnemy === 'spider') this.enemies.push(new Spider(this));
        else if (randomEnemy === 'plant' && this.speed > 0 && Math.random() * 0.5) this.enemies.push(new Plant(this));
        else if (randomEnemy === 'hand' && this.speed > 0 && Math.random() * 0.5) this.enemies.push(new Hand(this));

        // @debugger: add only one enemy type
        // if (this.speed > 0 && Math.random() * 0.5) this.enemies.push(new Bat1(this));
        // console.log(this.enemies);

        this.enemies.sort((a, b) => { return (a.y - b.y) });
    }

    /**
     * Adds a new event object to the game.
     */
    #addNewEvent() {
        const randomEvent = this.eventTypes[Math.floor(Math.random() * this.eventTypes.length)];
        if (randomEvent === 'bigZombie') this.event = new BigZombie(this);
        this.event.enter();
    }
}
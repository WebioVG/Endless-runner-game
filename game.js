/** @type {HTMLCanvasElement} */

import InputHandler from './classes/Input.js';
import Layer from './classes/Layer.js';
import Player from './classes/player.js';

///////////////////////
// Initialize canvas //
///////////////////////

const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

/////////////////////
// GAME PARAMETERS //
/////////////////////

let gameSpeed = 5;
let gameFrame= 0;

///////////////////////
// BACKGROUND LAYERS //
///////////////////////

const gameLayers = [
    new Layer('img/backgroundLayers/layer-1.png', 0.2, gameSpeed),
    new Layer('img/backgroundLayers/layer-2.png', 0.4, gameSpeed),
    new Layer('img/backgroundLayers/layer-3.png', 0.6, gameSpeed),
    new Layer('img/backgroundLayers/layer-4.png', 0.8, gameSpeed),
    new Layer('img/backgroundLayers/layer-5.png', 1, gameSpeed)
];

//////////////
// ENNEMIES //
//////////////

let enemiesArray = [
    {
        name: 'enemy1',
        numberOfEnemies: 1,
        numberOfFramesInSpritesheet: 6,
        enemiesArray: []
    },
    {
        name: 'enemy2',
        numberOfEnemies: 1,
        numberOfFramesInSpritesheet: 6,
        enemiesArray: []
    },
    {
        name: 'enemy3',
        numberOfEnemies: 1,
        numberOfFramesInSpritesheet: 6,
        enemiesArray: []
    },
    {
        name: 'enemy4',
        numberOfEnemies: 1,
        numberOfFramesInSpritesheet: 9,
        enemiesArray: []
    },
];

class Enemy1 {
    constructor() {
        this.image = new Image();
        this.image.src = 'img/enemies/enemy1.png';
        this.spriteWidth = 293;
        this.spriteHeight = 155;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height - 150);
        this.frame = 0;
        this.framesPlayed = 5;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    }

    update() {
        this.x += Math.random() * this.framesPlayed - (this.framesPlayed * 0.5);
        this.y += Math.random() * this.framesPlayed - (this.framesPlayed * 0.5);

        if (gameFrame % this.flapSpeed === 0) {
            this.frame > enemiesArray[0].numberOfFramesInSpritesheet - 2 ? this.frame = 0 : this.frame++;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

class Enemy2 {
    constructor() {
        this.image = new Image();
        this.image.src = 'img/enemies/enemy2.png';
        this.speed = Math.random() * 4 + 1;
        this.spriteWidth = 266;
        this.spriteHeight = 188;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height - 150);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.2;
        this.curve = Math.random() * 3 + 1;
    }

    update() {
        this.x -= this.speed;
        this.y += this.curve * Math.sin(this.angle);
        this.angle += this.angleSpeed;

        if (this.x + this.width < 0) this.x = canvas.width;

        if (gameFrame % this.flapSpeed === 0) {
            this.frame > enemiesArray[1].numberOfFramesInSpritesheet - 2 ? this.frame = 0 : this.frame++;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

class Enemy3 {
    constructor() {
        this.image = new Image();
        this.image.src = 'img/enemies/enemy3.png';
        this.speed = Math.random() * 4 + 1;
        this.spriteWidth = 218;
        this.spriteHeight = 177;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height - 150);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.angle = Math.random() * 500;
        this.angleSpeed = Math.random() * 0.8 + 0.3;
        this.curve = Math.random() * 200 + 50;
    }

    update() {
        this.x = canvas.width/3 * Math.sin(this.angle * Math.PI / 90) + canvas.width/2 - this.width/2;
        this.y = canvas.height/6 * Math.cos(this.angle * Math.PI / 360) + canvas.height/2 - this.height/2 - 150;
        this.angle += this.angleSpeed;

        if (this.x + this.width < 0) this.x = canvas.width;

        if (gameFrame % this.flapSpeed === 0) {
            this.frame > enemiesArray[1].numberOfFramesInSpritesheet - 2 ? this.frame = 0 : this.frame++;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

class Enemy4 {
    constructor() {
        this.image = new Image();
        this.image.src = 'img/enemies/enemy4.png';
        this.speed = Math.random() * 4 + 1;
        this.spriteWidth = 213;
        this.spriteHeight = 212;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height - 150);
        this.newX = Math.random() * (canvas.width - this.width);
        this.newY = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.interval = Math.round(Math.random() * 200 + 50);
    }

    update() {
        if (gameFrame % this.interval === 0) {
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this.height);    
        }
        let dx = this.x - this.newX;
        let dy = this.y - this.newY;
        this.x -= dx/70;
        this.y -= dy/70;

        if (this.x + this.width < 0) this.x = canvas.width;

        if (gameFrame % this.flapSpeed === 0) {
            this.frame > enemiesArray[1].numberOfFramesInSpritesheet - 2 ? this.frame = 0 : this.frame++;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

// Fill enemiesArray with all enemies instances
enemiesArray.forEach(enemy => {
    for (let i = 0; i < enemy.numberOfEnemies; i++) {
        switch (enemy.name) {
            case 'enemy1': enemy.enemiesArray.push(new Enemy1()); break;
            case 'enemy2': enemy.enemiesArray.push(new Enemy2()); break;
            case 'enemy3': enemy.enemiesArray.push(new Enemy3()); break;
            case 'enemy4': enemy.enemiesArray.push(new Enemy4()); break;
            default: console.log('Error during the filling of enemiesArray variable (enemies instanciations)'); break;
        }
    }
});

//////////
// MAIN //
//////////

const input = new InputHandler();
const player1 = new Player(600, 600);
let lastTime = 0;

function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    gameLayers.forEach(layer => {
        layer.update(gameSpeed);
        layer.draw(ctx);
    });

    player1.update(input.lastKey);
    player1.draw(ctx, deltaTime);

    enemiesArray.forEach(enemy => {
        enemy.enemiesArray.forEach(enemy => {
            enemy.update();
            enemy.draw();
        });
    });
    
    gameFrame++;
    requestAnimationFrame(animate);
};

animate(0);

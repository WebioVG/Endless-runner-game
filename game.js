// Initialize canvas
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;
let gameSpeed = 4;

////////////
// PLAYER //
////////////

const playerImage = new Image();
playerImage.src = 'img/shadow_dog.png';
const spriteWidth = 575;
const spriteHeight = 523;
let playerState = 'run';

// Get the players states with a keybord event
window.addEventListener('keydown', e => {
    if (e.keyCode === 40) { playerState = 'sit'; } // down arrow
    if (e.keyCode === 39) { playerState = 'roll'; } // right arrow
    if (e.keyCode === 38) { playerState = 'jump'; } // up arrow
    if (e.keyCode === 37) { playerState = 'idle'; } // left arrow
});
window.addEventListener('keyup', e => {
    playerState = 'run';
});

// Get the player state thanks to the HTML input
const dropdown = document.body.querySelector('#animations');
dropdown.addEventListener('change', (e) => {
    playerState = e.target.value;
});

let gameFrame= 0;
const staggerFrames = 6;
const spriteAnimations = [];
const animationStates = [
    {
        name: 'idle',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'sit',
        frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'ko',
        frames: 12,
    },
    {
        name: 'getHit',
        frames: 4,
    }
];
// Index each sprite animation positions
animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for (let j = 0; j < state.frames; j++) {
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x: positionX, y: positionY});
    }
    spriteAnimations[state.name] = frames;
});

///////////////////////
// BACKGROUND LAYERS //
///////////////////////

class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 600;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }

    update() {
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width) {
            this.x = 0;
        }
        this.x = Math.floor(this.x - this.speed);
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}


// Create the different background layers
backgroundLayer1 = new Image();
backgroundLayer1.src = 'img/backgroundLayers/layer-1.png';
backgroundLayer2 = new Image();
backgroundLayer2.src = 'img/backgroundLayers/layer-2.png';
backgroundLayer3 = new Image();
backgroundLayer3.src = 'img/backgroundLayers/layer-3.png';
backgroundLayer4 = new Image();
backgroundLayer4.src = 'img/backgroundLayers/layer-4.png';
backgroundLayer5 = new Image();
backgroundLayer5.src = 'img/backgroundLayers/layer-5.png';

const layer1 = new Layer(backgroundLayer1, 0.2);
const layer2 = new Layer(backgroundLayer2, 0.4);
const layer3 = new Layer(backgroundLayer3, 0.6);
const layer4 = new Layer(backgroundLayer4, 0.8);
const layer5 = new Layer(backgroundLayer5, 1);

const gameObjects = [layer1, layer2, layer3, layer4, layer5];

//////////
// MAIN //
//////////

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length;
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;

    gameObjects.forEach(layer => {
        layer.update();
        layer.draw();
    });

    ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 100, 400, 100, 100);

    gameFrame++;
    requestAnimationFrame(animate);
};

animate();

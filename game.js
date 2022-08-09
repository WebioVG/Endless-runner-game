/** @type {HTMLCanvasElement} */

import Game from './classes/Game.js';

window.addEventListener('load', () => {  
    ///////////////////////////
    // Initialize parameters //
    ///////////////////////////

    // Canvas settings
    const canvas = document.querySelector('#canvas1');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 1000;
    const CANVAS_HEIGHT = canvas.height = 600;
    canvas.style.width = CANVAS_WIDTH.toString() + 'px';
    let lastTime = 0;

    // Game
    let game = new Game(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
    game.enter();

    ///////////////
    // FUNCTIONS //
    ///////////////

    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        game.update(deltaTime);
        game.draw();
        
        if (!game.gameOver) requestAnimationFrame(animate);
    };

    //////////
    // MAIN //
    //////////
    
    animate(0);
})


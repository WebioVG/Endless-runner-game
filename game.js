/** @type {HTMLCanvasElement} */

import Game from './classes/Game.js';

window.addEventListener('load', () => {
        
    ///////////////////////
    // Initialize canvas //
    ///////////////////////
    
    const canvas = document.querySelector('#canvas1');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 600;
    const CANVAS_HEIGHT = canvas.height = 600;
    
    //////////
    // MAIN //
    //////////
    
    let lastTime = 0;
    const game = new Game(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
    
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        game.update(deltaTime);
        game.draw();
        
        requestAnimationFrame(animate);
    };
    
    animate(0);
})


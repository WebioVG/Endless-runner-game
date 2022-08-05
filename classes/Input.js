export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        
        // Keyboard inputs
        window.addEventListener('keydown', e => {
            if ((   e.key === 'ArrowUp' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'ArrowDown' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'z' ||
                    e.key === 'd' ||
                    e.key === 's' ||
                    e.key === 'q' ||
                    e.key === 'Z' ||
                    e.key === 'D' ||
                    e.key === 'S' ||
                    e.key === 'Q' ||
                    e.key === 'Enter'
                ) && this.keys.indexOf(e.key) === -1) {
                e.preventDefault();
                this.keys.push(e.key);
            } else if (e.key === 'p' || e.key ==='P') this.game.debug = !this.game.debug;
        });
        window.addEventListener('keyup', e => {
            if ((   e.key === 'ArrowUp' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'ArrowDown' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'z' ||
                    e.key === 'd' ||
                    e.key === 's' ||
                    e.key === 'q' ||
                    e.key === 'Z' ||
                    e.key === 'D' ||
                    e.key === 'S' ||
                    e.key === 'Q' ||
                    e.key === 'Enter'
                ) && this.keys.indexOf(e.key) !== -1) {
                e.preventDefault();
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });

        // HTML inputs
        document.getElementById('maxSpeedInput').addEventListener('change', e => {
            this.game.maxSpeed = parseInt(e.target.value);
        })
        document.getElementById('winningScoreInput').addEventListener('change', e => {
            this.game.winningScore = parseInt(e.target.value);
        })
        document.getElementById('livesInput').addEventListener('change', e => {
            this.game.player.lives = parseInt(e.target.value);
        })
        document.getElementById('enemyIntervalInput').addEventListener('change', e => {
            this.game.enemyInterval = parseInt(e.target.value);
        })
        document.getElementById('maxParticlesInput').addEventListener('change', e => {
            this.game.maxParticles = parseInt(e.target.value);
        })
    }
}
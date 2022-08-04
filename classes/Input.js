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
        document.getElementById('maxSpeed').addEventListener('change', e => {
            this.game.maxSpeed = e.target.value;
        })
        document.getElementById('winningScore').addEventListener('change', e => {
            this.game.winningScore = e.target.value;
        })
        document.getElementById('maxTime').addEventListener('change', e => {
            this.game.maxTime = e.target.value;
        })
    }
}
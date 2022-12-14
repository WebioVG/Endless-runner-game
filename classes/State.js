import { Dust, Fire, Splash } from "./Particle.js";

const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    LOWERING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6,
    IDLE: 7,
    FALLING: 8,
    DIZZY: 9
}

class State {
    constructor(state, game) {
        this.state = state;
        this.game = game;
        this.stateTimer = 0;
    }
}

export class Sitting extends State {
    constructor(game) {
        super('SITTING', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 4;
        this.game.player.frameY = 5;
        this.stateTimer = 0;
    }

    handleInput(input) {
        this.stateTimer++;
       
        if (this.game.player.tryMovingTo(input, 'right')) this.game.player.setState(states.RUNNING, 1);
        else if (this.game.player.tryMovingTo(input, 'left')) this.game.player.setState(states.IDLE, 1);
        else if (input.includes('Enter') && this.game.player.energy > 0 && this.stateTimer >= this.game.player.allowRollingEvery) this.game.player.setState(states.ROLLING, 2);
    }
}

export class Running extends State {
    constructor(game) {
        super('RUNNING', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.frameY = 3;
        this.game.player.maxFrame = 8;
        this.stateTimer = 0;
    }

    handleInput(input) {
        this.stateTimer++;
        
        this.game.particles.push(new Dust(this.game, this.game.player.x + this.game.player.width * 0.45, this.game.player.y + this.game.player.height));
        if (this.game.player.tryMovingTo(input, 'down')) this.game.player.setState(states.SITTING, 0);
        else if (this.game.player.tryMovingTo(input, 'up')) this.game.player.setState(states.JUMPING, 1);
        else if (this.game.player.tryMovingTo(input, 'left') && this.game.player.onGround()) this.game.player.setState(states.IDLE, 1);
        else if (input.includes('Enter') && this.game.player.energy > 0 && this.stateTimer >= this.game.player.allowRollingEvery) this.game.player.setState(states.ROLLING, 2);
    }
}

export class Jumping extends State {
    constructor(game) {
        super('JUMPING', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        if (this.game.player.onGround()) this.game.player.vy -= 5;
        this.game.player.frameY = 1;
        this.stateTimer = 0;
    }

    handleInput(input) {       
        if (this.game.player.vy > this.game.player.weight) this.game.player.setState(states.LOWERING, 1);
        else if (input.includes('Enter') && this.game.player.energy > 0) this.game.player.setState(states.ROLLING, 2);
        else if (this.game.player.tryMovingTo(input, 'down')) this.game.player.setState(states.DIVING, 0);
    }
}

export class Lowering extends State {
    constructor(game) {
        super('LOWERING', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2;
        this.stateTimer = 0;
    }

    handleInput(input) {        
        if (this.game.player.onGround()) this.game.player.setState(states.RUNNING, 1);
        else if (this.game.player.tryMovingTo(input, 'down')) this.game.player.setState(states.DIVING, 0);
    }
}

export class Rolling extends State {
    constructor(game) {
        super('ROLLING', game);
        this.rollingLength = 100;
        this.rollingJumpHeight = 40;
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
        this.stateTimer = 0;

        this.game.player.energy--;
        this.game.sounds.roll.play();
    }

    handleInput(input) {
        this.stateTimer++;

        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (this.stateTimer % this.rollingLength === 0 && this.game.player.energy <= 0) this.game.player.setState(states.DIZZY, 1);
        else if (this.stateTimer % this.rollingLength === 0) this.game.player.setState(states.RUNNING, 1);
        else if (!input.includes('Enter') && this.game.player.onGround()) this.game.player.setState(states.RUNNING, 1);
        else if (!input.includes('Enter') && !this.game.player.onGround()) this.game.player.setState(states.LOWERING, 1);
        else if (!input.includes('Enter') && this.game.player.tryMovingTo(input, 'up') && this.game.player.onGround()) this.game.player.vy -= this.rollingJumpHeight;
        else if (this.game.player.tryMovingTo(input, 'down') && !this.game.player.onGround()) this.game.player.setState(states.DIVING, 0);
    }
}

export class Diving extends State {
    constructor(game) {
        super('DIVING', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
        this.stateTimer = 0;
        
        this.game.player.vy = 15;
    }

    handleInput(input) {        
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (this.game.player.onGround()) {
            this.game.sounds.explosion.play();
            this.game.player.setState(states.RUNNING, 1);
            for (let i = 0; i < 30; i++) {
                this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height));
            }
        }
        else if (input.includes('Enter') && this.game.player.onGround() && this.game.player.energy > 0) this.game.player.setState(states.ROLLING, 2);
    }
}

export class Hit extends State {
    constructor(game) {
        super('HIT', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 3;
        this.game.player.frameY = 9;
        this.stateTimer = 0;
        this.game.player.isInvicible = true;
    }

    handleInput(input) {        
        if (this.game.player.frameX >= this.game.player.maxFrame) {
            this.game.player.setState(states.IDLE, 1);
            this.game.player.isInvicible = false;
        }
    }
}

export class Idle extends State {
    constructor(game) {
        super('IDLE', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 0;
        this.stateTimer = 0;
    }

    handleInput(input) {
        this.stateTimer++;

        if (this.game.player.tryMovingTo(input, 'right')) this.game.player.setState(states.RUNNING, 1);
        else if (this.game.player.tryMovingTo(input, 'up') && this.game.player.onGround()) this.game.player.setState(states.JUMPING, 1);
        else if (this.game.player.tryMovingTo(input, 'down') && this.game.player.onGround()) this.game.player.setState(states.SITTING, 0);
        else if (input.includes('Enter') && this.stateTimer >= this.game.player.allowRollingEvery) this.game.player.setState(states.ROLLING, 2);
    }
}

export class Falling extends State {
    constructor(game) {
        super('FALLING', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 11;
        this.game.player.frameY = 8;
        this.stateTimer = 0;
        this.game.player.isInvicible = true;
    }
    
    handleInput(input) {
        if (this.game.player.frameX >= this.game.player.maxFrame) {
            this.game.player.setState(states.IDLE, 1);
            this.game.player.isInvicible = false;
        }
    }
}

export class Dizzy extends State {
    constructor(game) {
        super('DIZZY', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 10;
        this.game.player.frameY = 4;
        this.stateTimer = 0;
    }
    
    handleInput(input) {
        if (this.game.player.frameX >= this.game.player.maxFrame) this.game.player.setState(states.IDLE, 1);
    }
}
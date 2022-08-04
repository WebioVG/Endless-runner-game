class Layer {
    constructor(game, width, height, speedModifier, image) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = this.game.speed * this.speedModifier;
    }

    update() {
        if (this.x <= -this.width) this.x = 0;
        else this.x -= this.game.speed * this.speedModifier;
    }

    draw(ctx) {
        ctx.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.game.height);
        ctx.drawImage(this.image, 0, 0, this.width, this.height, this.x + this.width, this.y, this.width, this.game.height);
    }
}

export default class Background {
    constructor(game) {
        this.game = game;
        this.width = 1667;
        this.height = 500;
        this.layer1 = new Layer(this.game, this.width, this.height, 0.2, layer1);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.4, layer2);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.6, layer3);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, layer4);
        this.layer5 = new Layer(this.game, this.width, this.height, 1, layer5);
        this.backroundLayers = [ this.layer1, this.layer2, this.layer3, this.layer4, this.layer5 ];
    }

    update() {
        this.backroundLayers.forEach(layer => {
            layer.update();
        })
    }

    draw(ctx) {
        this.backroundLayers.forEach(layer => {
            layer.draw(ctx);
        })
    }
}
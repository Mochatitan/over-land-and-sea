import { ctx, canvas } from './main.js';

const EMPTY = function() {};

class Scene {
    constructor(objects = [], settings = {}, draw = EMPTY, update = EMPTY) {
        this.objects = objects;
        for (let o of this.objects) {
            o.parentScene = this;
        }
        this.onDraw = draw;
        this.onUpdate = update;
        this.settings = settings;
        settings.background = settings.background ?? "white";
        this.data = {};
    }

    draw() {
        ctx.fillStyle = this.settings.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.onDraw();
        for (let o of this.objects) {
            o.draw();
        }
    }
    
    update(elapsed) {
        this.onUpdate(elapsed);
        for (let o of this.objects) {
            o.update(elapsed);
        }
    }

    handleClick(mx, my) {
        // Add some logic here later, probably when I make a proper button class
    }

    addObject(object) {
        this.objects.push(object);
    }
}

class Object {
    constructor(x, y, draw = EMPTY, update = EMPTY) {
        this.x = x;
        this.y = y;
        this.onDraw = draw;
        this.onUpdate = update;
        this.data = {};
    }

    draw() {
        this.onDraw();
    }

    update(elapsed) {
        this.onUpdate(elapsed);
    }
}

class ImageObject extends Object {
    constructor(x, y, path, update = EMPTY) {
        super(x, y, function() {
            ctx.drawImage(this.image, this.x, this.y);
        }, update)
        this.image = new Image();
        this.image.src = path;
    }
}

export { Scene, Object, ImageObject }

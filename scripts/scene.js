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
        for (let o of this.objects) {
            if (o.handleClick) {o.handleClick(mx, my)}
        }
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

class ButtonObject extends Object {
    constructor(x, y, w, h, draw = EMPTY, click = EMPTY, update = EMPTY) {
        super(x, y, draw, update)
        this.w = w
        this.h = h
        this.onClick = click
    }
    handleClick(mx, my) {
        if (mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h) {
            this.click()
        }
    }
    click() {
        this.onClick()
    }
}

export { Scene, Object, ImageObject, ButtonObject }

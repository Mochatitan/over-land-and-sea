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
    constructor(pos, draw = EMPTY, update = EMPTY) {
        this.position = pos
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
    constructor(pos, path, update = EMPTY) {
        super(pos, function() {
            const [x, y] = this.position()
            ctx.drawImage(this.image, x, y);
        }, update)
        this.image = new Image();
        this.image.src = path;
    }
}

class ButtonObject extends Object {
    constructor(pos, dimensions, draw = EMPTY, click = EMPTY, update = EMPTY) {
        super(pos, draw, update)
        this.dimensions = dimensions
        this.onClick = click
    }
    handleClick(mx, my) {
        const [x, y] = this.position()
        const [w, h] = this.dimensions()
        if (mx > x && mx < x + w && my > y && my < y + h) {
            this.click()
        }
    }
    click() {
        this.onClick()
    }
}

export { Scene, Object, ImageObject, ButtonObject }

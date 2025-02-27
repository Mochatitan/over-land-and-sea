import { ctx, canvas } from './main.js';

const EMPTY = function () { };

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
            if (o.handleClick) { o.handleClick(mx, my) }
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
        super(pos, function () {
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

class TextObject extends Object {
    constructor(text, pos, dimensions, update = EMPTY) {
        super(pos, function () {
            ctx.font = "80px Candela";
            const [x, y] = this.position();
            ctx.fillText(this.text, x, y);
        }, update);
        this.text = text;
    }
}

class InputObject extends Object {
    #inputElement;

    constructor(pos, dimensions, text, allowSpaces, maxDigits, update = EMPTY) {
        super(pos, function () {


            ctx.font = "80px Candela";
            ctx.textBaseline = "hanging"
            const [x, y] = this.position();
            const [w, h] = this.dimensions()
            ctx.textAlign = "left";
            ctx.fillStyle = "gray";
            ctx.fillRect(x - 15, y - 5, w + 30, h + 10);
            ctx.fillStyle = "red";
            ctx.fillText(this.text, x, y);
        }, update)
        this.maxDigits = maxDigits;
        this.allowSpaces = allowSpaces;
        this.dimensions = dimensions;
        this.text = text;
        this.selected = false;
    }
    handleClick(mx, my) {
        const [x, y] = this.position();
        const [w, h] = this.dimensions();
        if (mx > x && mx < x + w && my > y && my < y + h) {
            this.selected = true;
            if (!this.#inputElement) {
                this.#inputElement = document.createElement("input");
                this.#inputElement.style = `opacity: 0;
                    left: ${x * (innerWidth / canvas.width)}px;
                    top: ${y * (innerHeight / canvas.height)}px;
                    width: ${w * (innerWidth / canvas.width)}px;
                    height: ${h * (innerHeight / canvas.height)}px;`;
                this.#inputElement.value = this.text;
                const input = (e) => {
                    let value = e.target.value.slice(0, this.maxDigits);
                    if (!this.allowSpaces) {
                        value = value.replace(/\s/g, ""); // Remove spaces
                    }
                    e.target.value = value;
                    this.text = value;
                }
                this.#inputElement.oninput = input;
                this.#inputElement.onkeydown = input;
                this.#inputElement.onblur = (e) => {
                    this.selected = false;
                    this.#inputElement.remove();
                    this.#inputElement = null;
                }
                document.body.append(this.#inputElement);
                this.#inputElement.focus();
            }
        }

    }
    getInput() {
        return this.text;
    }
}

export { Scene, Object, ImageObject, ButtonObject, TextObject, InputObject }

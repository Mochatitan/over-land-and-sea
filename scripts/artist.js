import { WIDTH, HEIGHT, ctx, canvas } from './main.js';

export class Artist {


    //could reroute ctx drawings to use this instead so we can automate the graphic offsets and centering of stuff
    constructor() {
    }

    drawRect(x, y, width, height) {
        ctx.fillRect(x, y, width, height);
    }

}
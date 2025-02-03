import { Scene, Object, ImageObject, ButtonObject } from "../scene";
import { ctx, canvas } from '../main.js';

export const MultiplayerLobbiesScene = new Scene([new Object(() => [10, 10],
    function () {
        const [x, y] = this.position()
        ctx.fillStyle = "yellow";
        ctx.fillRect(x, y, canvas.width, canvas.height);
    },
    function () { }
),
new ButtonObject(() => [10, 10], () => [300, canvas.height / 2], function () {
    const [x, y] = this.position()
    const [w, h] = this.dimensions()
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, w, h);
}, function () {
    socket.emit("test", "if you can read this, the test worked  ");
    alert("emitting test...");
})]);
import { Scene, Object, ImageObject, ButtonObject, TextObject, InputObject } from "../scene";
import { ctx, canvas } from '../main.js';
import { io } from "socket.io-client";

const socket = io("ws://localhost:3000");

export const MultiplayerLobbiesScene = new Scene([new Object(() => [10, 10],
    function () {
        const [x, y] = this.position()
        ctx.fillStyle = "yellow";
        ctx.fillRect(x, y, canvas.width, canvas.height);
    },
    function () {
    }
),
new ButtonObject(() => [10, 10], () => [300, canvas.height / 2], function () {
    const [x, y] = this.position()
    const [w, h] = this.dimensions()
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, w, h);
}, function () {
    // typingCode = true;
    // console.log(typingCode);
    socket.emit("join-lobby", "JKLM");
    //socket.emit("test", "if you can read this, the test worked  ");
}),
new InputObject(() => [(100), (800)], () => [100, 100], "g"),
new ButtonObject(() => [350, 10], () => [300, canvas.height / 2], function () {
    const [x, y] = this.position()
    const [w, h] = this.dimensions()
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, w, h);
}, function () {
    //socket.emit("test", "if you can read this, the test worked  ");
    console.log(this.parentScene.objects[2].text)
}),

]);

// socket.on('test-two', (msg) => {
//     console.log("SECOND TEST: " + msg);
// });
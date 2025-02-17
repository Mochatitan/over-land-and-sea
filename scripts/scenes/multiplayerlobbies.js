import { Scene, Object, ImageObject, ButtonObject, TextObject, InputObject } from "../scene";
import { ctx, canvas } from '../main.js';
import { io } from "socket.io-client";

const socket = io("ws://localhost:3000");

const codebox = new InputObject(() => [((canvas.width / 2) - 150) - 110, (325)], () => [150, 100], "g");

export const MultiplayerLobbiesScene = new Scene([new Object(() => [10, 10],
    function () {
        const [x, y] = this.position()
        ctx.fillStyle = "yellow";
        ctx.fillRect(x, y, canvas.width, canvas.height);
    },
    function () {
    }
),
new ButtonObject(() => [((canvas.width / 2) - 150) + 110, 300], () => [300, 150], function () {
    const [x, y] = this.position()
    const [w, h] = this.dimensions()
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, w, h);
    ctx.font = "80px Candela";
    ctx.fillStyle = "blue";
    ctx.textAlign = "center";
    ctx.fillText("Join", x + 150, 338);
}, function () {
    // typingCode = true;
    // console.log(typingCode);
    socket.emit("join-lobby", codebox.getInput());
    //socket.emit("test", "if you can read this, the test worked  ");
}),

    codebox,

new ButtonObject(() => [((canvas.width / 2) - 200), 500], () => [400, 150], function () {
    const [x, y] = this.position()
    const [w, h] = this.dimensions()
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, w, h);
}, function () {
    //socket.emit("test", "if you can read this, the test worked  ");
    console.log(this.parentScene.objects[2].text)
}),

]);


socket.on("suckies-join", (lobby) => {
    console.log("im joining the lobby! can you say lobby in spanish?");
    console.log(lobby.code);
})
// socket.on('test-two', (msg) => {
//     console.log("SECOND TEST: " + msg);
// });
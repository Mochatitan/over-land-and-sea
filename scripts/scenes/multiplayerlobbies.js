import { Scene, Object, ImageObject, ButtonObject, TextObject, InputObject } from "../scene";
import { ctx, canvas } from '../main.js';
import { io } from "socket.io-client";
import { SceneManager } from "../main.js";
import { LobbyScene } from "./lobbyScene.js";
import { Lobby } from "../Lobby.js";
import {
    Player

} from "../Player.js";


export const socket = io("ws://localhost:3000");

const codebox = new InputObject(() => [((canvas.width / 2) - 150) - 110, (325)], () => [150, 100], "g", false, 4);
const namebox = new InputObject(() => [((canvas.width / 2) - 150) - 200, (125)], () => [690, 100], "John", true, 15);
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
    socket.emit("join-lobby", codebox.getInput(), namebox.getInput());
    //socket.emit("test", "if you can read this, the test worked  ");
}),

    codebox, namebox,

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

socket.on("suckies-join", (lobbyData) => {
    console.log("im joining the lobby! can you say lobby in spanish?");
    console.log(lobbyData.code);

    let lobby = new Lobby(lobbyData.code, lobbyData.password);
    //convert player list into a player list
    lobby.players = lobbyData.players.map(p => new Player(p.name, p.id, p.index));
    lobby.printPlayers();

    SceneManager.currentScene = LobbyScene;
});
socket.on('test-room', (msg) => {
    console.log("SECOND TEST: " + msg);
});

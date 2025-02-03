import { Scene, Object, ImageObject, ButtonObject } from "../scene";
import { ctx, canvas } from '../main.js';
import { MultiplayerLobbiesScene } from "./multiplayerlobbies.js";
import { SceneManager } from "../main.js";

export const MainScene = new Scene([new Object(() => [10, 10],
    function () {
        const [x, y] = this.position()
        ctx.fillStyle = "yellow";
        ctx.fillRect(x, y, canvas.width, canvas.height);
    },
    function () { }
),
new ButtonObject(() => [canvas.width / 2, canvas.height / 2], () => [300, 100], function () {
    const [x, y] = this.position()
    const [w, h] = this.dimensions()
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, w, h);
}, function () {
    SceneManager.currentScene = MultiplayerLobbiesScene;
})]);
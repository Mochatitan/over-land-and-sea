import { Scene, Object, ImageObject, ButtonObject } from "../scene";
import { ctx, canvas } from '../main.js';
import { SceneManager } from "../main.js";
import { MainScene } from "./mainScreen.js";

export const LoadingScene = new Scene([
    new Object(() => [120, 780], function () {
        const [x, y] = this.position()
        ctx.fillStyle = "orange";
        ctx.fillRect(x, y, this.data.loadingProgress, 120);
    }, function (elapsed) {

        let x = 0;

        if (x == 1) { //this will run once
            document.fonts.load("10pt Candela").then(() => {
                this.data.loadingProgress += 200;
            });
        }
        x++;
        this.data.loadingProgress = this.data.loadingProgress ?? 0
        this.data.loadingProgress += elapsed;
        if (this.data.loadingProgress >= 760) {
            this.data.loadingProgress = 760;
            SceneManager.currentScene = MainScene;
        }

    }),
    new ImageObject(() => [20, 20], "/img/test.png")
]);
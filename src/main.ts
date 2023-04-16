// src/main.ts
import { config } from "./config";
import { Game } from "./game";

window.onload = () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  canvas.width = config.world.width;
  canvas.height = config.world.height;

  const game = new Game(canvas, context);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      game.pause();
    } else {
      game.unpause();
    }
  });

  document.body.appendChild(canvas);

  game.start();
};

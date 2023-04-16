// src/main.ts
import { World } from "./world";
import { Point } from "./point";
import { Camera } from "./camera";
import { PhysicsObject } from "./physics_object";
import { Player } from "./player";
import { Ball } from "./ball";
import { config } from "./config";
import { Goal } from "./goal";
import { Game } from "./game";

window.onload = () => {
  let isPaused = false;

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

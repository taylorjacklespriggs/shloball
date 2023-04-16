// src/main.ts
import { World } from "./world";
import { Camera } from "./camera";
import { PhysicsObject } from "./physics_object";
import { Player } from "./player";
import { Ball } from "./ball";
import { config } from "./config";

window.onload = () => {
  let isPaused = false;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      isPaused = true;
    } else {
      isPaused = false;
    }
  });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  canvas.width = config.world.width;
  canvas.height = config.world.height;

  document.body.appendChild(canvas);

  const world = new World(config.world.width, config.world.height, config.world.gravity);
  const camera = new Camera(
    world,
    context,
    Math.min(canvas.width / world.width, canvas.height / world.height)
  );

  const objects: PhysicsObject[] = []; // List of physics objects to render and update

  const player1 = new Player(world, 40, 20);
  const player2 = new Player(world, world.width - Player.WIDTH - 40, 20);
  const ball = new Ball(world, world.width / 2 - 15, world.width / 2 - 15);

  objects.push(player1);
  objects.push(player2);
  objects.push(ball);

  let lastTimestamp = 0;

  function gameLoop(timestamp: number): void {
    const deltaTime = Math.min((timestamp - lastTimestamp) / 1000, 1 / 20); // Convert to seconds
    lastTimestamp = timestamp;

    if (!isPaused) {
      // Update physics objects
      objects.forEach((object) => {
        object.acceleration.x += world.gravity.x; // Apply gravity as acceleration
        object.acceleration.y += world.gravity.y;
        object.update(deltaTime);
        object.handleBoundaryCollision();
      });
    }

    camera.render(objects);

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
};

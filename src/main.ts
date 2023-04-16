// src/main.ts
import { World } from "./world";
import { Camera } from "./camera";
import { PhysicsObject } from "./physics_object";
import { config } from "./config";

const worldWidth = config.world.width;
const worldHeight = config.world.height;

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

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.body.appendChild(canvas);

  const world = new World(worldWidth, worldHeight, config.world.gravity);
  const camera = new Camera(
    world,
    context,
    Math.min(canvas.width / worldWidth, canvas.height / worldHeight)
  );

  const objects: PhysicsObject[] = []; // List of physics objects to render and update

  // Populate objects array with instances of PhysicsObject as needed
  // Example:
  objects.push(
    new PhysicsObject(
      world,
      config.player.mass,
      100,
      100,
      config.player.width,
      config.player.height
    )
  );
  objects.push(
    new PhysicsObject(
      world,
      config.ball.mass,
      200,
      200,
      config.ball.width,
      config.ball.height
    )
  );

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

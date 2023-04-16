// src/main.ts
import { World } from "./world";
import { Camera } from "./camera";
import { PhysicsObject } from "./physics_object";

window.onload = () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.body.appendChild(canvas);

  const worldWidth = 2000;
  const worldHeight = 1000;

  const world = new World(worldWidth, worldHeight, { x: 0, y: -10 });
  const camera = new Camera(
    world,
    context,
    Math.min(canvas.width / worldWidth, canvas.height / worldHeight)
  );

  const objects: PhysicsObject[] = []; // List of physics objects to render and update

  // Populate objects array with instances of PhysicsObject as needed
  // Example:
  objects.push(new PhysicsObject(world, 1, 100, 100, 50, 50));
  objects.push(new PhysicsObject(world, 1, 200, 200, 50, 50));

  let lastTimestamp = 0;

  function gameLoop(timestamp: number): void {
    const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
    lastTimestamp = timestamp;

    // Update physics objects
    objects.forEach((object) => {
      object.acceleration.x += world.gravity.x; // Apply gravity as acceleration
      object.acceleration.y += world.gravity.y;
      object.update(deltaTime);
      object.handleBoundaryCollision();
    });

    camera.render(objects);

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
};

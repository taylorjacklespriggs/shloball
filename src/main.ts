// src/main.ts
import { PhysicsObject } from "./physics_object";

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);

const objects: PhysicsObject[] = []; // List of physics objects to render and update

// Populate objects array with instances of PhysicsObject as needed
// Example:
objects.push(new PhysicsObject(1, 100, 100, 50, 50));
objects.push(new PhysicsObject(1, 200, 200, 50, 50));

let lastTimestamp = 0;

function gameLoop(timestamp: number): void {
  if (context === null) {
    return;
  }

  const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
  lastTimestamp = timestamp;

  // Update physics objects
  objects.forEach((object) => object.update(deltaTime));

  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Render physics objects
  objects.forEach((object) => {
    context.fillRect(
      object.position.x,
      object.position.y,
      object.boundingBox.width,
      object.boundingBox.height
    );
  });

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

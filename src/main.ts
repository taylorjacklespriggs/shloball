// src/main.ts
import { World } from "./world";
import { Camera } from "./camera";
import { PhysicsObject } from "./physics_object";
import { Player } from "./player";
import { Ball } from "./ball";
import { config } from "./config";
import { Goal } from "./goal";

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

  const world = new World(
    config.world.width,
    config.world.height,
    config.world.gravity
  );
  const camera = new Camera(
    world,
    context,
    Math.min(canvas.width / world.width, canvas.height / world.height)
  );

  const objects: PhysicsObject[] = []; // List of physics objects to render and update

  const boundaryWidth = config.boundary.width;

  const player1 = new Player(world, 4 * boundaryWidth, config.player.height + 2 * boundaryWidth, 1);
  const player2 = new Player(world, world.width - Player.WIDTH - 4 * boundaryWidth, config.player.height + 2 * boundaryWidth, 2);
  const ball = new Ball(world, world.width / 2 - 15, world.width / 2 - 15);

  // Create goals
  const goalHeight = config.goal.height;
  const goalWidth = config.goal.width;
  const goalY = (world.height - goalHeight) / 2;
  const leftGoal = new Goal(world, 0, goalY, goalWidth, goalHeight, 1);
  const rightGoal = new Goal(world, world.width - goalWidth, goalY, goalWidth, goalHeight, 2);

  // Create boundaries
  const topBoundary = new PhysicsObject(world, 0, 0, world.height - boundaryWidth, world.width, boundaryWidth, true);
  const bottomBoundary = new PhysicsObject(world, 0, 0, 0, world.width, boundaryWidth, true);
  const goalBoundaryHeight = (world.height - 2 * boundaryWidth - goalHeight) / 2;
  const leftBottomBoundary = new PhysicsObject(world, 0, 0, boundaryWidth, 3 * boundaryWidth, (world.height - 2 * boundaryWidth - goalHeight) / 2, true);
  const leftTopBoundary = new PhysicsObject(world, 0, 0, world.height - boundaryWidth - goalBoundaryHeight, 3 * boundaryWidth, (world.height - 2 * boundaryWidth - goalHeight) / 2, true);
  const rightBottomBoundary = new PhysicsObject(world, 0, world.width - 3 * boundaryWidth, boundaryWidth, 3 * boundaryWidth, (world.height - 2 * boundaryWidth - goalHeight) / 2, true);
  const rightTopBoundary = new PhysicsObject(world, 0, world.width - 3 * boundaryWidth, world.height - boundaryWidth - goalBoundaryHeight, 3 * boundaryWidth, (world.height - 2 * boundaryWidth - goalHeight) / 2, true);

  objects.push(player1);
  objects.push(player2);
  objects.push(ball);

  objects.push(leftGoal);
  objects.push(rightGoal);

  objects.push(topBoundary);
  objects.push(bottomBoundary);
  objects.push(leftTopBoundary);
  objects.push(leftBottomBoundary);
  objects.push(rightTopBoundary);
  objects.push(rightBottomBoundary);

  let lastTimestamp = 0;
  let accumulator = 0;
  const fixedDeltaTime = 1 / 60;

  function gameLoop(timestamp: number): void {
    const frameTime = Math.min((timestamp - lastTimestamp) / 1000, 1 / 20); // Convert to seconds
    lastTimestamp = timestamp;
    accumulator += frameTime;

    if (!isPaused) {
      while (accumulator >= fixedDeltaTime) {
        // Update physics objects
        objects.forEach((object) => {
          if (!object.isStatic) {
            object.acceleration.x += world.gravity.x; // Apply gravity as acceleration
            object.acceleration.y += world.gravity.y;
          }
          object.update(fixedDeltaTime);
          object.handleBoundaryCollision();
        });

        // Check for collisions between the players and the ball
        [player1, player2].forEach((player) => {
          player.checkCollisionWithBall(ball);
        });

        accumulator -= fixedDeltaTime;
      }
    }

    camera.render(objects, accumulator / fixedDeltaTime);

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
};

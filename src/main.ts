// src/main.ts
import { World } from "./world";
import { Point } from "./point";
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

  const player1 = new Player(world, 40, config.player.height + 2 * boundaryWidth, 1);
  const player2 = new Player(world, world.width - Player.WIDTH - 40, config.player.height + 2 * boundaryWidth, 2);
  const ball = new Ball(world, world.width / 2 - 15, world.width / 2 - 15);

  // Create goals
  const goalHeight = config.goal.height;
  const goalWidth = config.goal.width;
  const goalY = (world.height - goalHeight) / 2;
  const leftGoal = new Goal(world, boundaryWidth, goalY, goalWidth, goalHeight, 1);
  const rightGoal = new Goal(world, world.width - goalWidth - boundaryWidth, goalY, goalWidth, goalHeight, 2);

  // Create boundaries
  const topBoundary = new PhysicsObject(world, 0, 0, world.height - boundaryWidth, world.width, boundaryWidth, true);
  const bottomBoundary = new PhysicsObject(world, 0, 0, 0, world.width, boundaryWidth, true);
  const leftBoundary = new PhysicsObject(world, 0, 0, 0, boundaryWidth, world.height, true);
  const rightBoundary = new PhysicsObject(world, 0, world.width - boundaryWidth, 0, boundaryWidth, world.height, true);

  objects.push(player1);
  objects.push(player2);
  objects.push(ball);

  objects.push(leftGoal);
  objects.push(rightGoal);

  objects.push(topBoundary);
  objects.push(bottomBoundary);
  objects.push(leftBoundary);
  objects.push(rightBoundary);

  let lastTimestamp = 0;
  let accumulator = 0;
  const fixedDeltaTime = 1 / 60;

  const keyStates: { [key: string]: boolean } = {}; // Object to keep track of key states

  document.addEventListener("keydown", (event) => {
    keyStates[event.key] = true; // Set the key state to true when it's pressed
  });

  document.addEventListener("keyup", (event) => {
    keyStates[event.key] = false; // Set the key state to false when it's released
  });

  function calculatePlayerForceX(player: Player, direction: number): number {
    if (direction === 0) {
      return 0;
    }
    const speedLimitFraction =
      (player.velocity.x * direction) / config.player.maxVelocityX;
    if (speedLimitFraction >= 1) {
      return 0;
    }
    if (speedLimitFraction < 0) {
      return direction * config.player.maxForceX;
    }
    return (1 - speedLimitFraction) * direction * config.player.maxForceX;
  }

  function updatePlayerMovement(): void {
    // Update player movement based on keyboard input
    [
      { player: player1, keys: [keyStates.a, keyStates.d] },
      { player: player2, keys: [keyStates.ArrowLeft, keyStates.ArrowRight] },
    ].forEach(({ player, keys: [leftKey, rightKey] }) => {
      let direction = 0;
      if (leftKey) {
        direction -= 1;
      }
      if (rightKey) {
        direction += 1;
      }
      const forceX = calculatePlayerForceX(player, direction);
      player.applyForce({ x: forceX, y: 0 });
    });
  }

  function gameLoop(timestamp: number): void {
    const frameTime = Math.min((timestamp - lastTimestamp) / 1000, 1 / 20); // Convert to seconds
    lastTimestamp = timestamp;
    accumulator += frameTime;

    if (!isPaused) {
      while (accumulator >= fixedDeltaTime) {
        updatePlayerMovement();

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

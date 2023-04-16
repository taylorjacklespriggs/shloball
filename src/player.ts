// src/player.ts
import { PhysicsObject } from "./physics_object";
import { Game } from "./game";
import { World } from "./world";
import { Bubble } from "./bubble";
import { config } from "./config";
import { Input } from "./types";
import { Ball } from "./ball";

export class Player extends PhysicsObject {
  static readonly CROUCHED_HEIGHT = config.player.crouchedHeight;
  static readonly STANDING_HEIGHT = config.player.standingHeight;
  game: Game;
  bubble?: Bubble;
  crouched: boolean;
  canJump: boolean;
  id: number;

  constructor(game: Game, x: number, y: number, id: number) {
    const mass = config.player.mass;
    super(game.getWorld(), mass, x, y, config.player.width, Player.STANDING_HEIGHT);
    this.game = game;
    this.crouched = false;
    this.canJump = true;
    this.id = id;
  }

  getWorld(): World {
    return this.game.getWorld();
  }

  update(deltaTime: number, input: Input): void {
    super.update(deltaTime);
    this.updatePlayerMovement(input);
    this.handleInput(deltaTime, input);
    const gravity = this.game.getWorld().gravity;
    this.acceleration.x += gravity.x;
    this.acceleration.y += gravity.y;
  }

  handleInput(deltaTime: number, input: Input): void {
    // Implement input handling based on your game's specific requirements
  }

  jump(): void {
    // Implement jump behavior

    // Spawn a bubble if one does not already exist
    if (!this.bubble) {
      const bubbleX = this.position.x + this.boundingBox.width / 2;
      const bubbleY = this.position.y + this.boundingBox.height / 2;
      this.bubble = new Bubble(this, bubbleX, bubbleY);
    }
  }

  crouch(): void {
    this.crouched = true;
    this.boundingBox.height = Player.CROUCHED_HEIGHT;
  }

  standUp(): void {
    this.crouched = false;
    this.boundingBox.height = Player.STANDING_HEIGHT;
  }

  checkCollisionWithBall(ball: Ball): void {
    if (this.collidesWith(ball)) {
      this.resolveCollision(ball);
    }
  }

  calculatePlayerForceX(direction: number): number {
    if (direction === 0) {
      return 0;
    }
    const speedLimitFraction =
      (this.velocity.x * direction) / config.player.maxVelocityX;
    if (speedLimitFraction >= 1) {
      return 0;
    }
    if (speedLimitFraction < 0) {
      return direction * config.player.maxForceX;
    }
    return (1 - speedLimitFraction) * direction * config.player.maxForceX;
  }

  private updatePlayerMovement(input: Input): void {
    let direction = 0;
    if (input.left) {
      direction -= 1;
    }
    if (input.right) {
      direction += 1;
    }
    const forceX = this.calculatePlayerForceX(direction);
    this.applyForce({ x: forceX, y: 0 });
  }

  resolveCollision(ball: Ball): void {
    // Calculate the relative velocities
    const relVelX = ball.velocity.x - this.velocity.x;
    const relVelY = ball.velocity.y - this.velocity.y;

    // Calculate the normal vector
    const normalX =
      ball.position.x +
      ball.boundingBox.width / 2 -
      (this.position.x + this.boundingBox.width / 2);
    const normalY =
      ball.position.y +
      ball.boundingBox.height / 2 -
      (this.position.y + this.boundingBox.height / 2);
    const normalLength = Math.sqrt(normalX * normalX + normalY * normalY);
    const normalUnitX = normalX / normalLength;
    const normalUnitY = normalY / normalLength;

    // Calculate the dot product of the relative velocities and the normal vector
    const dotProduct = relVelX * normalUnitX + relVelY * normalUnitY;

    // Check if the objects are moving away from each other
    if (dotProduct > 0) {
      return;
    }

    // Calculate the impulse
    const restitution = 0.8;
    const totalMass = this.mass + ball.mass;
    const impulseMagnitude = (-(1 + restitution) * dotProduct) / totalMass;

    // Apply the impulse to the velocities of the player and the ball
    this.velocity.x -= impulseMagnitude * ball.mass * normalUnitX;
    this.velocity.y -= impulseMagnitude * ball.mass * normalUnitY;
    ball.velocity.x += impulseMagnitude * this.mass * normalUnitX;
    ball.velocity.y += impulseMagnitude * this.mass * normalUnitY;
  }
}

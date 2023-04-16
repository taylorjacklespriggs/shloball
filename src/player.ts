// src/player.ts
import { PhysicsObject } from "./physics_object";
import { World } from "./world";
import { Bubble } from "./bubble";
import { config } from "./config";
import { Ball } from "./ball";

export class Player extends PhysicsObject {
  static readonly WIDTH = config.player.width;
  static readonly HEIGHT = config.player.height;
  static readonly CROUCHED_HEIGHT = config.player.crouchedHeight;
  bubble?: Bubble;
  crouched: boolean;
  canJump: boolean;

  constructor(world: World, x: number, y: number) {
    const mass = config.player.mass;
    super(world, mass, x, y, Player.WIDTH, Player.HEIGHT);
    this.crouched = false;
    this.canJump = true;
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
    this.handleInput(deltaTime);
  }

  handleInput(deltaTime: number): void {
    // Implement input handling based on your game's specific requirements
  }

  jump(): void {
    // Implement jump behavior

    // Spawn a bubble if one does not already exist
    if (!this.bubble) {
      const bubbleX = this.position.x + this.boundingBox.width / 2;
      const bubbleY = this.position.y + this.boundingBox.height / 2;
      this.bubble = new Bubble(this.world, bubbleX, bubbleY);
      this.world.addObject(this.bubble);
    }
  }

  crouch(): void {
    this.crouched = true;
    this.boundingBox.height = Player.CROUCHED_HEIGHT;
  }

  standUp(): void {
    this.crouched = false;
    this.boundingBox.height = Player.HEIGHT;
  }

  checkCollisionWithBall(ball: Ball): void {
    if (this.collidesWith(ball)) {
      this.resolveCollision(ball);
    }
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

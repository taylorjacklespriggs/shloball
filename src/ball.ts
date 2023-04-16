// src/ball.ts
import { PhysicsObject } from "./physics_object";
import { World } from "./world";
import { config } from "./config";
import { Input } from "./types";

export class Ball extends PhysicsObject {
  radius: number;

  constructor(world: World, x: number, y: number) {
    const mass = config.ball.mass;
    const radius = config.ball.radius;
    super(world, mass, x, y, radius * 2, radius * 2, false, 1);
    this.radius = radius;
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
    const gravity = this.world.gravity;
    this.acceleration.x += gravity.x;
    this.acceleration.y += gravity.y;
  }

  handleBoundaryCollision(): void {
    if (this.world.isOutOfBounds(this)) {
      if (
        this.position.x < this.radius ||
        this.position.x + this.radius > this.world.width
      ) {
        this.velocity.x = -this.bounceElasticity * this.velocity.x;
        if (this.position.x < 0) {
          this.position.x = 0;
        } else {
          this.position.x = this.world.width - this.boundingBox.width;
        }
      }
      if (
        this.position.y < this.radius ||
        this.position.y + this.radius > this.world.height
      ) {
        this.velocity.y = -this.bounceElasticity * this.velocity.y;
        if (this.position.y < 0) {
          this.position.y = 0;
        } else {
          this.position.y = this.world.height - this.boundingBox.height;
        }
      }
    }
  }
}

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
}

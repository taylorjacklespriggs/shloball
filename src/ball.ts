// src/ball.ts
import { PhysicsObject } from "./physics_object";
import { World } from "./world";
import { config } from "./config";

export class Ball extends PhysicsObject {
  constructor(world: World, x: number, y: number) {
    const mass = config.ball.mass;
    const width = config.ball.radius * 2;
    const height = config.ball.radius * 2;
    super(world, mass, x, y, width, height);
  }
}

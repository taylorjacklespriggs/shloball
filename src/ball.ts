// src/ball.ts
import { PhysicsObject } from "./physics_object";
import { World } from "./world";

export class Ball extends PhysicsObject {
  constructor(world: World, x: number, y: number) {
    const mass = 1;
    const width = 30;
    const height = 30;
    super(world, mass, x, y, width, height);
  }
}
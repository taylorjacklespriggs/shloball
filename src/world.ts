import { PhysicsObject } from "./physics_object";
import { Point } from "./point";

export class World {
  width: number;
  height: number;
  gravity: Point;

  constructor(width: number, height: number, gravity: Point) {
    this.width = width;
    this.height = height;
    this.gravity = { ...gravity };
  }

  // TODO: Implement this method
  removeObject(object: PhysicsObject): void {}
  
  // TODO: Implement this method
  addObject(object: PhysicsObject): void {}
}

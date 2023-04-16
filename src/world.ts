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

  isOutOfBounds(object: PhysicsObject): boolean {
    return (
      object.position.x < 0 ||
      object.position.x + object.boundingBox.width > this.width ||
      object.position.y < 0 ||
      object.position.y + object.boundingBox.height > this.height
    );
  }
}

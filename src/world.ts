import { PhysicsObject } from "./physics_object";

export class World {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
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

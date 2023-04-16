// src/camera.ts
import { World } from "./world";
import { PhysicsObject } from "./physics_object";

export class Camera {
  world: World;
  context: CanvasRenderingContext2D;
  scale: number;

  constructor(world: World, context: CanvasRenderingContext2D, scale: number) {
    this.world = world;
    this.context = context;
    this.scale = scale;
  }

  render(objects: PhysicsObject[]): void {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    objects.forEach((object) => {
      this.context.fillRect(
        object.position.x * this.scale,
        object.position.y * this.scale,
        object.boundingBox.width * this.scale,
        object.boundingBox.height * this.scale
      );
    });
  }
}

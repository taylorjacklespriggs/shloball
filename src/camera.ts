// src/camera.ts
import { World } from "./world";
import { PhysicsObject } from "./physics_object";
import { config } from "./config";

export class Camera {
  world: World;
  context: CanvasRenderingContext2D;
  scale: number;
  fixedDeltaTime: number;

  constructor(world: World, context: CanvasRenderingContext2D, scale: number) {
    this.world = world;
    this.context = context;
    this.scale = scale;
    this.fixedDeltaTime = config.fixedDeltaTime;
  }

  render(objects: PhysicsObject[], alpha: number): void {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.context.save();

    // Flip the y-axis
    this.context.scale(1, -1);
    this.context.translate(0, -this.context.canvas.height);

    objects.forEach((object) => {
      // Interpolate positions between physics updates
      const x =
        object.position.x * alpha +
        (object.position.x - object.velocity.x * this.fixedDeltaTime) *
          (1 - alpha);
      const y =
        object.position.y * alpha +
        (object.position.y - object.velocity.y * this.fixedDeltaTime) *
          (1 - alpha);

      this.context.fillRect(
        x * this.scale,
        y * this.scale,
        object.boundingBox.width * this.scale,
        object.boundingBox.height * this.scale
      );
    });

    this.context.restore();
  }
}

// src/camera.ts
import { World } from "./world";
import { PhysicsObject } from "./physics_object";
import { Ball } from "./ball";
import { Player } from "./player";
import { Goal } from "./goal";
import { Bubble } from "./bubble";
import { config } from "./config";

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
    this.context.save();

    // Flip the y-axis
    this.context.scale(1, -1);
    this.context.translate(0, -this.context.canvas.height);

    const scaledWorldWidth = this.world.width * this.scale;
    const scaledWorldHeight = this.world.height * this.scale;
    this.context.clearRect(0, 0, scaledWorldWidth, scaledWorldHeight);

     // Draw rounded corners
    const cornerRadius = config.boundary.cornerRadius * this.scale;
    const boundaryWidth = config.boundary.width * this.scale;
    this.context.beginPath();
    this.context.fillStyle = 'black'
    this.context.arc(boundaryWidth + cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
    this.context.closePath();
    this.context.fill();

    this.context.beginPath();
    this.context.arc(scaledWorldWidth - cornerRadius - boundaryWidth, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
    this.context.fill();
    this.context.closePath();

    this.context.beginPath();
    this.context.arc(scaledWorldWidth - cornerRadius - boundaryWidth, scaledWorldHeight - cornerRadius, cornerRadius, 0, 0.5 * Math.PI);
    this.context.fill();
    this.context.closePath();

    this.context.beginPath();
    this.context.arc(boundaryWidth + cornerRadius, scaledWorldHeight - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
    this.context.fill();
    this.context.closePath();
    // this.context.clip();

    objects.forEach((object) => {
      console.log('OBJECT', object);
      let color = 'black';
      if (object instanceof Ball) {
        color = 'red';
      } else if (object instanceof Player) {
        if (object.id === 1) {
          color = 'blue';
        } else if (object.id === 2) {
          color = 'green';
        }
      } else if (object instanceof Goal) {
        if (object.player === 1) {
          color = 'blue';
        } else if (object.player === 2) {
          color = 'green';
        }
      }
      this.context.fillStyle = color;
      this.context.fillRect(
        object.position.x * this.scale,
        object.position.y * this.scale,
        object.boundingBox.width * this.scale,
        object.boundingBox.height * this.scale,
      );
    });


    this.context.restore();
  }
}

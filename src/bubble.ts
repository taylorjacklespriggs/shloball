// src/bubble.ts
import { config } from "./config";
import { PhysicsObject } from "./physics_object";
import { World } from "./world";

export class Bubble extends PhysicsObject {
  timer: number;
  static readonly GROWTH_TIME = config.bubble.growthTime;
  static readonly LIFETIME = config.bubble.lifetime;
  static readonly START_RADIUS = config.bubble.startRadius;
  static readonly END_RADIUS = config.bubble.endRadius;

  constructor(world: World, x: number, y: number) {
    const mass = 0; // Bubble doesn't have any mass
    const width = Bubble.START_RADIUS * 2;
    const height = Bubble.START_RADIUS * 2;
    super(world, mass, x, y, width, height, true);
    this.timer = 0;
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
    this.timer += deltaTime * 1000; // Convert to milliseconds

    // Grow the bubble
    if (this.timer < Bubble.GROWTH_TIME) {
      const growthFactor = this.timer / Bubble.GROWTH_TIME;
      this.boundingBox.width =
        (Bubble.START_RADIUS + (Bubble.END_RADIUS - Bubble.START_RADIUS) * growthFactor) * 2;
      this.boundingBox.height = this.boundingBox.width;
    }

    // Remove the bubble after its lifetime
    if (this.timer >= Bubble.LIFETIME) {
      this.world.removeObject(this);
    }
  }
}

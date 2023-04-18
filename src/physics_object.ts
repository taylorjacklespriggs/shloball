import { Point } from "./point";
import { World } from "./world";
import { config } from "./config";
import { Input } from "./types";

export class PhysicsObject {
  mass: number;
  position: Point;
  velocity: Point;
  acceleration: Point;
  boundingBox: { width: number; height: number };
  world: World;
  isStatic: boolean;
  bounceElasticity: number;

  constructor(
    world: World,
    mass: number,
    x: number,
    y: number,
    width: number,
    height: number,
    isStatic = false,
    bounceElasticity = 0
  ) {
    this.mass = mass;
    this.position = { x: x, y: y };
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.boundingBox = { width: width, height: height };
    this.world = world;
    this.isStatic = isStatic;
    this.bounceElasticity = bounceElasticity;
  }

  applyForce(force: { x: number; y: number }): void {
    this.acceleration.x += force.x / this.mass;
    this.acceleration.y += force.y / this.mass;
  }

  update(deltaTime: number, input?: Input): void {
    // Update velocity based on acceleration
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;

    // Apply friction
    this.velocity.x *= 1 - config.world.friction * deltaTime;
    this.velocity.y *= 1 - config.world.friction * deltaTime;

    // Update position based on velocity
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // Reset acceleration
    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }

  lerpPosition(normal: Point, distance: number) {
    this.position.x += normal.x * distance;
    this.position.y += normal.y * distance;
  }

  collideAndResolve(other: PhysicsObject) {
    return false;
  }

  handleBoundaryCollision(): void {
    if (
      this.position.x - this.boundingBox.width / 2 < 0 ||
      this.position.x + this.boundingBox.width / 2 > this.world.width
    ) {
      this.velocity.x = -this.bounceElasticity * this.velocity.x;
      this.position.x = Math.min(
        this.world.width - this.boundingBox.width / 2,
        Math.max(this.position.x, this.boundingBox.width / 2)
      );
    }
    if (
      this.position.y - this.boundingBox.height / 2 < 0 ||
      this.position.y + this.boundingBox.height / 2 > this.world.height
    ) {
      this.velocity.y = -this.bounceElasticity * this.velocity.y;
      this.position.y = Math.min(
        this.world.width - this.boundingBox.height / 2,
        Math.max(this.position.y, this.boundingBox.height / 2)
      );
    }
  }
}

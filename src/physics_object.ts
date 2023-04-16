import { Point } from "./point";

export class PhysicsObject {
  mass: number;
  position: Point;
  velocity: Point;
  acceleration: Point;
  boundingBox: { width: number; height: number };

  constructor(
    mass: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.mass = mass;
    this.position = { x: x, y: y };
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.boundingBox = { width: width, height: height };
  }

  applyForce(force: { x: number; y: number }): void {
    this.acceleration.x += force.x / this.mass;
    this.acceleration.y += force.y / this.mass;
  }

  update(deltaTime: number): void {
    // Update velocity based on acceleration
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;

    // Update position based on velocity
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // Reset acceleration
    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }

  collidesWith(other: PhysicsObject): boolean {
    // AABB collision detection
    return (
      this.position.x < other.position.x + other.boundingBox.width &&
      this.position.x + this.boundingBox.width > other.position.x &&
      this.position.y < other.position.y + other.boundingBox.height &&
      this.position.y + this.boundingBox.height > other.position.y
    );
  }

  resolveCollision(other: PhysicsObject): void {
    // Implement collision resolution based on the specific game object types
  }
}
// src/player.ts
import { PhysicsObject } from "./physics_object";
import { World } from "./world";
import { Bubble } from "./bubble";

export class Player extends PhysicsObject {
  static readonly WIDTH = 60;
  static readonly HEIGHT = 30;
  static readonly CROUCHED_HEIGHT = 20;
  bubble?: Bubble;
  crouched: boolean;
  canJump: boolean;

  constructor(world: World, x: number, y: number) {
    const mass = 1;
    super(world, mass, x, y, Player.WIDTH, Player.HEIGHT);
    this.crouched = false;
    this.canJump = true;
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
    this.handleInput(deltaTime);
  }

  handleInput(deltaTime: number): void {
    // Implement input handling based on your game's specific requirements
  }

  jump(): void {
    // Implement jump behavior

    // Spawn a bubble if one does not already exist
    if (!this.bubble) {
      const bubbleX = this.position.x + this.boundingBox.width / 2;
      const bubbleY = this.position.y + this.boundingBox.height / 2;
      this.bubble = new Bubble(this.world, bubbleX, bubbleY);
      this.world.addObject(this.bubble);
    }
  }

  crouch(): void {
    this.crouched = true;
    this.boundingBox.height = Player.CROUCHED_HEIGHT;
  }

  standUp(): void {
    this.crouched = false;
    this.boundingBox.height = Player.HEIGHT;
  }
}

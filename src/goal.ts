// src/goal.ts
import { PhysicsObject } from "./physics_object";
import { World } from "./world";

export class Goal extends PhysicsObject {
  player: number; // corresponds to player.id

  constructor(world: World, x: number, y: number, width: number, height: number, player: number) {
    super(world, 0, x, y, width, height, true);
    this.player = player;
  }
}

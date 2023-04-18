// src/goal.ts
import { PhysicsObject } from "./physics_object";
import { Ball } from "./ball";
import { Game } from "./game";

export class Goal extends PhysicsObject {
  playerId: number; // corresponds to player.id
  game: Game;

  constructor(
    game: Game,
    x: number,
    y: number,
    width: number,
    height: number,
    player: number
  ) {
    super(game.getWorld(), 0, x, y, width, height, true);
    this.playerId = player;
    this.game = game;
  }

  collideAndResolve(other: PhysicsObject) {
    if (!(other instanceof Ball)) {
      return false;
    }
    let scored = false;
    const ball: Ball = other;
    if (this.playerId === 1) {
      if (
        ball.position.x < this.position.x + this.boundingBox.width &&
        ball.position.y < this.position.y + this.boundingBox.height &&
        ball.position.y > this.position.y
      ) {
        scored = true;
      }
    } else if (this.playerId === 2) {
      if (
        ball.position.x > this.position.x &&
        ball.position.y < this.position.y + this.boundingBox.height &&
        ball.position.y > this.position.y
      ) {
        scored = true;
      }
    }
    if (!scored) {
      return false;
    }
    this.game.playerScored(this.playerId);
    return true;
  }
}

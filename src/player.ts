// src/player.ts
import { PhysicsObject } from "./physics_object";
import { Game } from "./game";
import { World } from "./world";
import { Bubble } from "./bubble";
import { config } from "./config";
import { Input } from "./types";
import { Ball } from "./ball";
import { Point } from "./point";
import { Circle, Rect, getPillCircleCollision } from "./collisions";

export class Player extends PhysicsObject {
  static readonly CROUCHED_HEIGHT = config.player.crouchedHeight;
  static readonly STANDING_HEIGHT = config.player.standingHeight;
  game: Game;
  bubble?: Bubble;
  crouched: boolean;
  canJump: boolean;
  id: number;

  constructor(game: Game, x: number, y: number, id: number) {
    const mass = config.player.mass;
    super(
      game.getWorld(),
      mass,
      x,
      y,
      config.player.width,
      Player.STANDING_HEIGHT
    );
    this.game = game;
    this.crouched = false;
    this.canJump = true;
    this.id = id;
  }

  getWorld(): World {
    return this.game.getWorld();
  }

  update(deltaTime: number, input: Input): void {
    super.update(deltaTime);
    this.updatePlayerMovement(input);
    this.handleInput(deltaTime, input);
    const gravity = this.game.getWorld().gravity;
    this.acceleration.x += gravity.x;
    this.acceleration.y += gravity.y;
  }

  handleInput(deltaTime: number, input: Input): void {
    // Implement input handling based on your game's specific requirements
  }

  jump(): void {
    // Implement jump behavior

    // Spawn a bubble if one does not already exist
    if (!this.bubble) {
      const bubbleX = this.position.x + this.boundingBox.width / 2;
      const bubbleY = this.position.y + this.boundingBox.height / 2;
      this.bubble = new Bubble(this, bubbleX, bubbleY);
    }
  }

  crouch(): void {
    this.crouched = true;
    this.boundingBox.height = Player.CROUCHED_HEIGHT;
  }

  standUp(): void {
    this.crouched = false;
    this.boundingBox.height = Player.STANDING_HEIGHT;
  }

  calculatePlayerForceX(direction: number): number {
    if (direction === 0) {
      return 0;
    }
    const speedLimitFraction =
      (this.velocity.x * direction) / config.player.maxVelocityX;
    if (speedLimitFraction >= 1) {
      return 0;
    }
    if (speedLimitFraction < 0) {
      return direction * config.player.maxForceX;
    }
    return (1 - speedLimitFraction) * direction * config.player.maxForceX;
  }

  private updatePlayerMovement(input: Input): void {
    let direction = 0;
    if (input.left) {
      direction -= 1;
    }
    if (input.right) {
      direction += 1;
    }
    const forceX = this.calculatePlayerForceX(direction);
    this.applyForce({ x: forceX, y: 0 });
  }
  private getCollisionNormal(other: PhysicsObject): Point | null {
    if (other instanceof Player) {
      // Pill-Pill collision
      const dx =
        this.position.x +
        this.boundingBox.width / 2 -
        (other.position.x + other.boundingBox.width / 2);
      const dy =
        this.position.y +
        this.boundingBox.height / 2 -
        (other.position.y + other.boundingBox.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < (this.boundingBox.width + other.boundingBox.width) / 2) {
        return { x: dx, y: dy };
      }
      return null;
    } else if (other instanceof Ball) {
      // Pill-Ball collision
      const circleX = other.position.x + other.boundingBox.width / 2;
      const circleY = other.position.y + other.boundingBox.height / 2;
      const rectX = this.position.x;
      const rectY = this.position.y;
      const rectWidth = this.boundingBox.width;
      const rectHeight = this.boundingBox.height;
      const pillAspectRatio = 2;
      const halfPillWidth = rectHeight / pillAspectRatio / 2;
      const halfPillHeight = rectHeight / 2;
      const circleDistanceX = Math.abs(
        circleX - rectX - rectWidth / 2 - halfPillWidth
      );
      const circleDistanceY = Math.abs(circleY - rectY - rectHeight / 2);
      if (circleDistanceX > halfPillWidth + other.boundingBox.width / 2) {
        return null;
      }
      if (circleDistanceY > halfPillHeight + other.boundingBox.height / 2) {
        return null;
      }
      if (circleDistanceX <= halfPillWidth) {
        return { x: 0, y: circleY - rectY - rectHeight / 2 };
      }
      if (circleDistanceY <= halfPillHeight) {
        return { x: circleX - rectX - rectWidth / 2 - halfPillWidth, y: 0 };
      }
      const cornerDistanceSq =
        (circleDistanceX - halfPillWidth) ** 2 +
        (circleDistanceY - halfPillHeight) ** 2;
      if (cornerDistanceSq <= (other.boundingBox.width / 2) ** 2) {
        const cornerDistance = Math.sqrt(cornerDistanceSq);
        return {
          x: circleX - rectX - rectWidth / 2 - halfPillWidth,
          y: circleY - rectY - rectHeight / 2,
        };
      }
      return null;
    } else {
      // Unsupported object type
      return null;
    }
  }

  collideAndResolve(other: PhysicsObject) {
    if (other instanceof Ball) {
      const pill: Rect = {
        position: this.position,
        boundingBox: this.boundingBox,
      };
      const circle: Circle = {
        position: other.position,
        radius: other.boundingBox.width / 2,
      };
      const collision = getPillCircleCollision(pill, circle);

      if (collision) {
        const normal = collision.normal;
        const relativeVelocity = {
          x: other.velocity.x - this.velocity.x,
          y: other.velocity.y - this.velocity.y,
        };

        const speed =
          relativeVelocity.x * normal.x + relativeVelocity.y * normal.y;
        if (speed > 0) {
          return false; // Objects are moving away from each other
        }

        const restitution = 0.8;
        const impulse = (-(1 + restitution) * speed) / (this.mass + other.mass);
        const impulseVector = {
          x: impulse * normal.x,
          y: impulse * normal.y,
        };

        this.velocity.x -= impulseVector.x * other.mass;
        this.velocity.y -= impulseVector.y * other.mass;
        other.velocity.x += impulseVector.x * this.mass;
        other.velocity.y += impulseVector.y * this.mass;

        return true;
      }
    } else if (other instanceof Player) {
      // TODO: Implement pill-pill collision
      return false;
    } else {
      // Unsupported object type
      return false;
    }
    return false;
  }
}

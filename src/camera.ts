// src/camera.ts
import { Game } from "./game";
import { PhysicsObject } from "./physics_object";
import { Ball } from "./ball";
import { Player } from "./player";
import { Goal } from "./goal";
import { Bubble } from "./bubble";
import { config } from "./config";
import { Point } from "./point";

export class Camera {
  game: Game;
  context: CanvasRenderingContext2D;
  scale: number;
  fixedDeltaTime: number;

  constructor(game: Game, context: CanvasRenderingContext2D, scale: number) {
    this.game = game;
    this.context = context;
    this.scale = scale;
    this.fixedDeltaTime = config.fixedDeltaTime;
  }
  private interpolatePosition(
    position: Point,
    velocity: Point,
    alpha: number
  ): Point {
    return {
      x:
        position.x * alpha +
        (position.x - velocity.x * this.fixedDeltaTime) * (1 - alpha),
      y:
        position.y * alpha +
        (position.y - velocity.y * this.fixedDeltaTime) * (1 - alpha),
    };
  }

  render(
    players: Player[],
    goals: Goal[],
    barriers: PhysicsObject[],
    ball: Ball,
    alpha: number
  ): void {
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

    const scaledWorldWidth = this.game.getWorldWidth() * this.scale;
    const scaledWorldHeight = this.game.getWorldHeight() * this.scale;
    this.context.clearRect(0, 0, scaledWorldWidth, scaledWorldHeight);

    players.forEach((player) => {
      const color = player.id === 1 ? "blue" : "green";
      this.context.fillStyle = color;
      // Interpolate positions between physics updates
      const { x, y } = this.interpolatePosition(
        player.position,
        player.velocity,
        alpha
      );
      this.context.fillRect(
        x * this.scale,
        y * this.scale,
        player.boundingBox.width * this.scale,
        player.boundingBox.height * this.scale
      );

      if (player.bubble) {
        // Draw bubbles
        this.context.lineWidth = 1;
        this.context.strokeStyle = color;

        this.context.beginPath();
        this.context.arc(
          player.bubble.position.x,
          player.bubble.position.y,
          player.bubble.radius,
          0,
          2 * Math.PI
        );
        this.context.stroke();
      }
    });

    // Draw the Ball
    this.context.fillStyle = "black";

    this.context.beginPath();
    this.context.arc(
      ball.position.x + ball.radius,
      ball.position.y + ball.radius,
      ball.radius,
      0,
      2 * Math.PI
    );
    this.context.fill();

    barriers.forEach((barrier) => {
      const color = "grey";
      this.context.fillStyle = color;
      // Interpolate positions between physics updates
      this.context.fillRect(
        barrier.position.x * this.scale,
        barrier.position.y * this.scale,
        barrier.boundingBox.width * this.scale,
        barrier.boundingBox.height * this.scale
      );
    });

    goals.forEach((goal) => {
      const color = goal.playerId === 1 ? "blue" : "green";
      this.context.fillStyle = color;
      // Interpolate positions between physics updates
      this.context.fillRect(
        goal.position.x * this.scale,
        goal.position.y * this.scale,
        goal.boundingBox.width * this.scale,
        goal.boundingBox.height * this.scale
      );
    });

    this.context.restore();
  }
}

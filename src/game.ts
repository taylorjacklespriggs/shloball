// src/game.ts
import { World } from "./world";
import { Camera } from "./camera";
import { PhysicsObject } from "./physics_object";
import { Player } from "./player";
import { Ball } from "./ball";
import { config } from "./config";
import { Goal } from "./goal";

export class Game {
  private world: World;
  public camera: Camera;
  private player1: Player;
  private player2: Player;
  private player1Score: number;
  private player2Score: number;
  private goal1: Goal;
  private goal2: Goal;
  private barriers: PhysicsObject[];
  private ball: Ball;
  private keyStates: { [key: string]: boolean } = {};
  public isPaused: boolean;

  private lastTimeStamp: number;
  private accumulator: number;
  private fixedDeltaTime: number;

  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D
  ) {
    this.player1Score = 0;
    this.player2Score = 0;
    this.isPaused = false;

    // this.barriers = barriers;

    this.lastTimeStamp = 0;
    this.accumulator = 0;
    this.fixedDeltaTime = 1 / 60;
    this.keyStates = {};
    this.world = new World(
      config.world.width,
      config.world.height,
      config.world.gravity
    );

    this.camera = new Camera(
      this,
      context,
      Math.min(
        canvas.width / this.world.width,
        canvas.height / this.world.height
      )
    );

    const boundaryWidth = config.boundary.width;
    this.player1 = new Player(
      this,
      0.25 * this.world.width,
      3 * boundaryWidth,
      1
    );
    this.player2 = new Player(
      this,
      0.75 * this.world.width - config.player.width,
      3 * boundaryWidth,
      2
    );
    const goalHeight = config.goal.height;
    const goalWidth = config.goal.width;
    const goalY = (this.world.height - goalHeight) / 2;
    this.goal1 = new Goal(this, 0, goalY, goalWidth, goalHeight, 1);
    this.goal2 = new Goal(
      this,
      this.world.width - goalWidth,
      goalY,
      goalWidth,
      goalHeight,
      2
    );
    this.ball = new Ball(
      this.world,
      this.world.width / 2 - 15,
      this.world.width / 2 - 15
    );

    // Create boundaries
    const topBoundary = new PhysicsObject(
      this.world,
      0,
      0,
      this.world.height - boundaryWidth,
      this.world.width,
      boundaryWidth,
      true
    );
    const bottomBoundary = new PhysicsObject(
      this.world,
      0,
      0,
      0,
      this.world.width,
      boundaryWidth,
      true
    );
    const goalBoundaryHeight =
      (this.world.height - 2 * boundaryWidth - goalHeight) / 2;
    const leftBottomBoundary = new PhysicsObject(
      this.world,
      0,
      0,
      boundaryWidth,
      3 * boundaryWidth,
      (this.world.height - 2 * boundaryWidth - goalHeight) / 2,
      true
    );
    const leftTopBoundary = new PhysicsObject(
      this.world,
      0,
      0,
      this.world.height - boundaryWidth - goalBoundaryHeight,
      3 * boundaryWidth,
      (this.world.height - 2 * boundaryWidth - goalHeight) / 2,
      true
    );
    const rightBottomBoundary = new PhysicsObject(
      this.world,
      0,
      this.world.width - 3 * boundaryWidth,
      boundaryWidth,
      3 * boundaryWidth,
      (this.world.height - 2 * boundaryWidth - goalHeight) / 2,
      true
    );
    const rightTopBoundary = new PhysicsObject(
      this.world,
      0,
      this.world.width - 3 * boundaryWidth,
      this.world.height - boundaryWidth - goalBoundaryHeight,
      3 * boundaryWidth,
      (this.world.height - 2 * boundaryWidth - goalHeight) / 2,
      true
    );
    this.barriers = [
      topBoundary,
      bottomBoundary,
      leftBottomBoundary,
      leftTopBoundary,
      rightBottomBoundary,
      rightTopBoundary,
    ];

    this.world = new World(
      config.world.width,
      config.world.height,
      config.world.gravity
    );
  }

  private initKeyListeners(): void {
    document.addEventListener("keydown", (event) => {
      this.keyStates[event.key] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.keyStates[event.key] = false;
    });
  }

  public pause(): void {
    this.isPaused = true;
  }

  public unpause(): void {
    this.isPaused = false;
  }

  public getWorld(): World {
    return this.world;
  }

  public getWorldHeight(): number {
    return this.world.height;
  }

  public getWorldWidth(): number {
    return this.world.height;
  }

  public getCamera(): World {
    return this.world;
  }

  private gameLoop(timestamp: number): void {
    const frameTime = Math.min((timestamp - this.lastTimeStamp) / 1000, 1 / 20); // Convert to seconds
    this.lastTimeStamp = timestamp;
    this.accumulator += frameTime;

    if (!this.isPaused) {
      while (this.accumulator >= this.fixedDeltaTime) {
        // update players
        this.player1.update(this.fixedDeltaTime, {
          left: this.keyStates.a,
          right: this.keyStates.d,
        });
        this.player1.handleBoundaryCollision();

        this.player2.update(this.fixedDeltaTime, {
          left: this.keyStates.ArrowLeft,
          right: this.keyStates.ArrowRight,
        });
        this.player2.handleBoundaryCollision();

        // update ball
        this.ball.update(this.fixedDeltaTime);
        this.goal1.collideAndResolve(this.ball);
        this.goal2.collideAndResolve(this.ball);

        this.ball.handleBoundaryCollision();

        // Check for collisions between the players and the ball
        [this.player1, this.player2].forEach((player) => {
          player.collideAndResolve(this.ball);
        });

        this.player1.collideAndResolve(this.player2);

        this.accumulator -= this.fixedDeltaTime;
      }
    }

    this.render(this.accumulator / this.fixedDeltaTime);

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  public start(): void {
    this.unpause();
    this.initKeyListeners();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  public playerScored(playerId: number): void {
    if (playerId === 1) this.player1Score++;
    else this.player2Score++;
    this.pause();
    setTimeout(() => this.unpause(), 3000);
  }

  public render(alpha: number): void {
    this.camera.render(
      [this.player1, this.player2],
      [this.goal1, this.goal2],
      this.barriers,
      this.ball,
      alpha
    );
  }
}

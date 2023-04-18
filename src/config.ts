export const config = {
  world: {
    width: 960,
    height: 540,
    gravity: { x: 0, y: -300 },
    friction: 0.01,
  },
  player: {
    mass: 4,
    width: 60,
    standingHeight: 30,
    crouchedHeight: 20,
    maxForceX: 10000,
    maxVelocityX: 300,
    ballCollisionRestitution: 0.95,
  },
  ball: {
    mass: 1,
    radius: 15,
  },
  bubble: {
    mass: 0,
    startRadius: 5,
    endRadius: 30,
    growthTime: 500,
    lifetime: 10000,
  },
  goal: {
    height: 180,
    width: 20,
  },
  boundary: {
    width: 20,
    cornerRadius: 30,
  },
  fixedDeltaTime: 1 / 180, // 180 physics updates per second
};

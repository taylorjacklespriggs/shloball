export const config = {
  world: {
    width: 960,
    height: 540,
    gravity: { x: 0, y: -40 },
    friction: 0.1,
  },
  player: {
    mass: 100,
    width: 60,
    height: 30,
    crouchedHeight: 20,
    maxForceX: 100000,
    maxVelocityX: 300,
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
  fixedDeltaTime: 1 / 60, // 60 physics updates per second
};

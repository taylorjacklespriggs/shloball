export const config = {
  world: {
    width: 960,
    height: 540,
    gravity: { x: 0, y: -40 },
    friction: 0.1,
  },
  player: {
    mass: 2,
    width: 60,
    height: 30,
    crouchedHeight: 20,
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
};

import {
  Circle,
  CollisionResult,
  getCircleCircleCollision,
} from "../collisions";

describe("getCircleCircleCollision", () => {
  it("should return null when the circles do not collide", () => {
    const circle1: Circle = {
      position: { x: 0, y: 0 },
      radius: 1,
    };
    const circle2: Circle = {
      position: { x: 3, y: 0 },
      radius: 1,
    };
    const result = getCircleCircleCollision(circle1, circle2);
    expect(result).toBeNull();
  });

  it("should return a collision when the circles overlap", () => {
    const circle1: Circle = {
      position: { x: 0, y: 0 },
      radius: 2,
    };
    const circle2: Circle = {
      position: { x: 2, y: 0 },
      radius: 2,
    };
    const expected: CollisionResult = {
      normal: { x: 1, y: 0 },
      depth: 2,
    };
    const result = getCircleCircleCollision(circle1, circle2);
    expect(result?.normal.x).toBeCloseTo(expected.normal.x, 5);
    expect(result?.normal.y).toBeCloseTo(expected.normal.y, 5);
    expect(result?.depth).toBeCloseTo(expected.depth, 5);
  });

  it("should return a collision when the circles are tangent", () => {
    const circle1: Circle = {
      position: { x: 0, y: 0 },
      radius: 1,
    };
    const circle2: Circle = {
      position: { x: 2, y: 0 },
      radius: 1,
    };
    const expected: CollisionResult = {
      normal: { x: 1, y: 0 },
      depth: 0,
    };
    const result = getCircleCircleCollision(circle1, circle2);
    expect(result?.normal.x).toBeCloseTo(expected.normal.x, 5);
    expect(result?.normal.y).toBeCloseTo(expected.normal.y, 5);
    expect(result?.depth).toBeCloseTo(expected.depth, 5);
  });
});

import {
  Circle,
  CollisionResult,
  Rect,
  circleRectangleCollision,
} from "../collisions";

describe("circleRectangleCollision", () => {
  it("should return null when the circle is far from the rectangle", () => {
    const farCircle: Circle = {
      position: { x: 10, y: 10 },
      radius: 1,
    };
    const rect: Rect = {
      position: { x: 0, y: 0 },
      boundingBox: { width: 2, height: 2 },
    };
    const result = circleRectangleCollision(farCircle, rect);
    expect(result).toBeNull();
  });

  it("should return a collision when the circle collides with a corner of the rectangle", () => {
    const cornerCircle: Circle = {
      position: { x: 2, y: 2 },
      radius: 2,
    };
    const rect: Rect = {
      position: { x: 0, y: 0 },
      boundingBox: { width: 2, height: 2 },
    };
    const expected: CollisionResult = {
      normal: { x: -0.7071067811865475, y: -0.7071067811865475 },
      depth: 0.5857864376269049,
    };
    const result = circleRectangleCollision(cornerCircle, rect);
    expect(result?.normal.x).toBeCloseTo(expected.normal.x, 5);
    expect(result?.normal.y).toBeCloseTo(expected.normal.y, 5);
    expect(result?.depth).toBeCloseTo(expected.depth, 5);
  });

  it("should return a collision when the circle collides with the flat face of the rectangle", () => {
    const flatFaceCircle: Circle = {
      position: { x: 2, y: 0 },
      radius: 2,
    };
    const rect: Rect = {
      position: { x: 0, y: 0 },
      boundingBox: { width: 2, height: 2 },
    };
    const expected: CollisionResult = {
      normal: { x: -1, y: 0 },
      depth: 1,
    };
    const result = circleRectangleCollision(flatFaceCircle, rect);
    expect(result?.normal.x).toBeCloseTo(expected.normal.x, 5);
    expect(result?.normal.y).toBeCloseTo(expected.normal.y, 5);
    expect(result?.depth).toBeCloseTo(expected.depth, 5);
  });
});

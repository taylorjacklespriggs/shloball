import {
  Circle,
  CollisionResult,
  Rect,
  getPillCircleCollision,
} from "../collisions";

describe("getPillCircleCollision", () => {
  it("should return null when the circle is far from the pill", () => {
    const farCircle: Circle = {
      position: { x: 10, y: 10 },
      radius: 1,
    };
    const pill: Rect = {
      position: { x: 0, y: 0 },
      boundingBox: { width: 2, height: 2 },
    };
    const result: CollisionResult | null = getPillCircleCollision(
      pill,
      farCircle
    );
    expect(result).toBeNull();
  });

  it("should return a collision when the circle collides with the semicircular end of the pill", () => {
    const circle: Circle = {
      position: { x: 2.5, y: 1 },
      radius: 0.5,
    };
    const pill: Rect = {
      position: { x: 0, y: 0 },
      boundingBox: { width: 2, height: 2 },
    };
    const expected: CollisionResult = {
      normal: { x: 1, y: 0 },
      depth: 0,
    };
    const result = getPillCircleCollision(pill, circle);
    expect(result?.normal.x).toBeCloseTo(expected.normal.x, 5);
    expect(result?.normal.y).toBeCloseTo(expected.normal.y, 5);
    expect(result?.depth).toBeCloseTo(expected.depth, 5);
  });

  it("should return a collision when the circle collides with the flat edge of the pill", () => {
    const circle: Circle = {
      position: { x: 1, y: 2.5 },
      radius: 0.5,
    };
    const pill: Rect = {
      position: { x: 0, y: 0 },
      boundingBox: { width: 2, height: 2 },
    };
    const expected: CollisionResult = {
      normal: { x: 0, y: 1 },
      depth: 0,
    };
    const result = getPillCircleCollision(pill, circle);
    expect(result?.normal.x).toBeCloseTo(expected.normal.x, 5);
    expect(result?.normal.y).toBeCloseTo(expected.normal.y, 5);
    expect(result?.depth).toBeCloseTo(expected.depth, 5);
  });
});

import { Point } from "./point";

export interface Circle {
  position: Point;
  radius: number;
}

export interface Box {
  width: number;
  height: number;
}

export interface Rect {
  position: Point;
  boundingBox: Box;
}

export interface CollisionResult {
  normal: Point;
  depth: number;
}

const epsilon = 1e-6;

export function circleRectangleCollision(
  circle: Circle,
  rect: Rect
): CollisionResult | null {
  // Calculate the closest point on the rectangle to the circle
  const closestX = Math.max(
    rect.position.x - rect.boundingBox.width / 2,
    Math.min(circle.position.x, rect.position.x + rect.boundingBox.width / 2)
  );
  const closestY = Math.max(
    rect.position.y - rect.boundingBox.height / 2,
    Math.min(circle.position.y, rect.position.y + rect.boundingBox.height / 2)
  );

  // Calculate the distance between the closest point and the circle's center
  const distanceX = closestX - circle.position.x;
  const distanceY = closestY - circle.position.y;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // Check if the circle intersects the rectangle
  if (distanceSquared > circle.radius ** 2) {
    return null;
  }

  // Calculate the collision normal
  const distance = Math.sqrt(distanceSquared) + epsilon;
  const normal: Point = {
    x: distanceX / distance,
    y: distanceY / distance,
  };

  // Calculate the collision depth
  const depth = circle.radius - distance;

  return { normal, depth };
}

export function getCircleCircleCollision(
  circle1: Circle,
  circle2: Circle
): CollisionResult | null {
  // Calculate the distance between the circles' centers
  const distanceX = circle2.position.x - circle1.position.x;
  const distanceY = circle2.position.y - circle1.position.y;
  const distanceSquared = distanceX ** 2 + distanceY ** 2;

  // Check if the circles intersect
  const radiiSum = circle1.radius + circle2.radius;
  if (distanceSquared > radiiSum ** 2) {
    return null;
  }

  // Calculate the collision normal
  const distance = Math.sqrt(distanceSquared) + epsilon;
  const normal: Point = {
    x: distanceX / distance,
    y: distanceY / distance,
  };

  // Calculate the collision depth
  const depth = radiiSum - distance;

  return { normal, depth };
}

export function getPillCircleCollision(
  pill: Rect,
  circle: Circle
): CollisionResult | null {
  const circleDistanceX = Math.abs(
    circle.position.x - pill.position.x - pill.boundingBox.width / 2
  );
  const circleDistanceY = Math.abs(
    circle.position.y - pill.position.y - pill.boundingBox.height / 2
  );

  if (circleDistanceX > pill.boundingBox.width / 2 + circle.radius) {
    return null;
  }
  if (circleDistanceY > pill.boundingBox.height / 2 + circle.radius) {
    return null;
  }

  if (circleDistanceX <= pill.boundingBox.width / 2) {
    return {
      normal: {
        x: 0,
        y:
          circle.position.y < pill.position.y + pill.boundingBox.height / 2
            ? -1
            : 1,
      },
      depth: pill.boundingBox.height / 2 + circle.radius - circleDistanceY,
    };
  }

  if (circleDistanceY <= pill.boundingBox.height / 2) {
    return {
      normal: {
        x:
          circle.position.x < pill.position.x + pill.boundingBox.width / 2
            ? -1
            : 1,
        y: 0,
      },
      depth: pill.boundingBox.width / 2 + circle.radius - circleDistanceX,
    };
  }

  const cornerDistanceSq =
    (circleDistanceX - pill.boundingBox.width / 2) ** 2 +
    (circleDistanceY - pill.boundingBox.height / 2) ** 2;

  if (cornerDistanceSq <= circle.radius ** 2) {
    const cornerDistance = Math.sqrt(cornerDistanceSq);
    const depth = circle.radius - cornerDistance;

    const normal = {
      x:
        circleDistanceX < circleDistanceY
          ? circle.position.x < pill.position.x + pill.boundingBox.width / 2
            ? -1
            : 1
          : 0,
      y:
        circleDistanceX < circleDistanceY
          ? 0
          : circle.position.y < pill.position.y + pill.boundingBox.height / 2
          ? -1
          : 1,
    };

    return {
      normal,
      depth,
    };
  }

  return null;
}

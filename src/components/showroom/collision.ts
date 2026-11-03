import {
  COLLIDERS,
  WALK_BOUNDS,
  type Collider,
} from "@/components/showroom/showroom-config";

const PLAYER_RADIUS = 0.32;

function intersects(x: number, z: number, collider: Collider, radius: number) {
  return (
    x > collider.minX - radius &&
    x < collider.maxX + radius &&
    z > collider.minZ - radius &&
    z < collider.maxZ + radius
  );
}

export function isBlocked(x: number, z: number, radius = PLAYER_RADIUS) {
  return COLLIDERS.some((collider) => intersects(x, z, collider, radius));
}

/**
 * Axis-separated movement so the player slides along walls and furniture
 * instead of sticking to them. If the player somehow starts inside a collider
 * (for example after a teleport) movement is allowed until they step out.
 */
export function resolveMovement(
  previousX: number,
  previousZ: number,
  nextX: number,
  nextZ: number,
  radius = PLAYER_RADIUS,
) {
  const x = Math.max(
    WALK_BOUNDS.minX,
    Math.min(WALK_BOUNDS.maxX, nextX),
  );
  const z = Math.max(
    WALK_BOUNDS.minZ,
    Math.min(WALK_BOUNDS.maxZ, nextZ),
  );

  if (isBlocked(previousX, previousZ, radius)) {
    return { x, z };
  }

  let resolvedX = x;
  let resolvedZ = z;

  if (isBlocked(x, previousZ, radius)) {
    resolvedX = previousX;
  }

  if (isBlocked(resolvedX, z, radius)) {
    resolvedZ = previousZ;
  }

  return { x: resolvedX, z: resolvedZ };
}

export { PLAYER_RADIUS };

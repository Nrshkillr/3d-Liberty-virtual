import { SPAWN } from "@/components/showroom/showroom-config";

export const EYE_HEIGHT = 1.62;
export const MOVE_SPEED = 2.55;
export const SPRINT_MULTIPLIER = 1.65;
export const PITCH_LIMIT = 1.05;

export interface PlayerState {
  x: number;
  z: number;
  yaw: number;
  pitch: number;
  keys: Set<string>;
  joystickX: number;
  joystickY: number;
  bobPhase: number;
  moving: boolean;
}

export function createPlayerState(): PlayerState {
  return {
    x: SPAWN.x,
    z: SPAWN.z,
    yaw: SPAWN.yaw,
    pitch: -0.05,
    keys: new Set<string>(),
    joystickX: 0,
    joystickY: 0,
    bobPhase: 0,
    moving: false,
  };
}

export function resetPlayer(player: PlayerState) {
  player.x = SPAWN.x;
  player.z = SPAWN.z;
  player.yaw = SPAWN.yaw;
  player.pitch = -0.05;
  player.keys.clear();
  player.joystickX = 0;
  player.joystickY = 0;
}

/**
 * Jump straight to a zone. Teleporting snaps instead of gliding so the location
 * indicator, minimap and deep links always agree with where the visitor stands,
 * even on devices rendering well below 60fps.
 */
export function teleportPlayer(
  player: PlayerState,
  x: number,
  z: number,
  yaw: number,
) {
  player.x = x;
  player.z = z;
  player.yaw = yaw;
  player.pitch = -0.05;
  player.keys.clear();
  player.joystickX = 0;
  player.joystickY = 0;
  player.moving = false;
}

export function clampPitch(value: number) {
  return Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, value));
}

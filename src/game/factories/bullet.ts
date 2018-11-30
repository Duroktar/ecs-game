import { ISystemManager } from "../../lib/types";
import { createProjectile } from "../Domain/projectile";

export function createBullet(
  system: ISystemManager,
  name: string,
  x: number = -100,
  speed: number = 8,
) {

  const entity = createProjectile(system, {
    name,

    health: {
      value: 0,
    },

    momentum: {
      direction: {
        x: 0,
        y: -1,
      },
      speed,
    },

    position: {
      x: x,
      y: 440,
    },

    geometry: {
      width:  2,
      height: 32,
    },
  });

  return entity;
}
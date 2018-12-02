import { ISystemManager, IVector, IDimensions } from "../../lib/types";
import { createMob } from "../Domain/mob";
import { defaultBoundary } from "../../lib/utils";

export function createEnemy(
    system:     ISystemManager,
    name:       string,
    position?:  IVector,
    geometry?:  IDimensions,
    // sprite?: string,
) {

  const entity = createMob(system, {
    name,

    controls: {
      disabled: true,
    },

    health: {
      value: 1,
    },

    position: position || {
      x: -999,
      y: -999,
    },

    geometry: geometry ||{
      width:  64,
      height: 64,
    },

    loot: {
      points: 10,
    },

    boundary: defaultBoundary,

  });

  return entity;
}

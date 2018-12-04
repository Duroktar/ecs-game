import { ISystemManager, IVector, IDimensions } from "../../engine/types";
import { createMob } from "../Domain/mob";
import { defaultBoundary } from "../../engine/utils";

export function createEnemy(
    system:           ISystemManager,
    textureId:        number,
    name:             string,
    position?:        IVector,
    geometry?:        IDimensions,
    collisionGroup:   string = 'hostile',
) {

  const entity = createMob(system, {
    name,

    texture: textureId,

    wiggling: true,

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

    collisionGroup,
  });

  return entity;
}

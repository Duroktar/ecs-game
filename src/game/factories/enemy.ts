import { ISystemManager, IVector, IDimensions } from "../../engine/types";
import { createMob } from "../Domain/mob";
import { defaultBoundary } from "../../engine/utils";
import { SpriteTextureIds } from "../catalogue";

export function createEnemy(
    system:           ISystemManager,
    textureId:        number,
    name:             string,
    position?:        IVector,
    geometry?:        IDimensions,
) {

  const entity = createMob(system, {
    name,

    texture: textureId,

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

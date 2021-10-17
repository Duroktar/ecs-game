import { IVector, IDimensions } from "../../engine/types";
import { ISystemManager } from "../../engine/interfaces/ISystemManager";
import { createMob } from "../Domain/mob";
import { defaultBoundary } from "../../engine/utils";

export function createEnemy(
    system:           ISystemManager,
    textureId:        number,
    name:             string,
    position:         IVector,
    homePosition?:    IVector,
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

    position: position,

    homePosition: homePosition || position,

    geometry: geometry ||{
      width:  64,
      height: 64,
    },

    loot: {
      points: 10,
    },

    boundary: defaultBoundary,

    collisionGroup,

    collidable: true,
  });

  return entity;
}

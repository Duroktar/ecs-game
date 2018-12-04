import { createCharacter } from "../Domain/character";
import { ISystemManager } from "../../engine/types";
import { defaultBoundary } from "../../engine/utils";
import { SpriteTextureIds } from "../catalogue";

export function createPlayer(
  system:           ISystemManager,
  name:             string = 'player 1',
  collisionGroup:   string = 'friendly',
) {

  const playerEntity = createCharacter(system, {
    name,

    texture: SpriteTextureIds.Player,

    health: {
      value: 100,
      immortal: false,
    },

    attackPower: 10,

    speed: {
      y: 0,
      x: 6,
    },
  
    position: {
      x: 400,
      y: 475,
    },
  
    direction: {
      x: 0,
      y: 0,
    },
  
    geometry: {
      width:  64,
      height: 64,
    },
  
    moving: false,
  
    attacking: false,

    boundary: defaultBoundary,

    collisionGroup,
  });

  return playerEntity;
}

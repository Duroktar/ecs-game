import { createCharacter } from "../Domain/character";
import { ISystemManager } from "../../lib/types";

export function createPlayer(
  system: ISystemManager,
  name: string = 'player 1',
) {

  const playerEntity = createCharacter(system, {
    name,
    health: 1,
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
  });

  return playerEntity;
}

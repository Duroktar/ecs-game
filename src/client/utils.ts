import { ISystemManager, IEntity } from "../lib/types";
import { MouseEvent } from "react";
import { createEnemy } from "../game/factories/enemy";
import { withTexture } from "./Hoc/withTexture";
import { ILoadedEnemy } from "./Levels/types";

export function loadLevel(system: ISystemManager, enemyPositions: number[][]): ILoadedEnemy[] {
  let enemies: ILoadedEnemy[] = [];

  let x: number = 0;
  let y: number = 0;

  for (const row of enemyPositions) {
    for (const enemyTypeId of row) {
      if (enemyTypeId !== 0) {
        const geometry = {
          width:    64,
          height:   64,
        }
  
        const position = {
          x:    x * geometry.width,
          y:    y * geometry.height,
        }
  
        const entity = createEnemy(system, enemyTypeId, JSON.stringify(position), position, geometry)
        enemies.push({
          component: withTexture(enemyTypeId),
          entity,
        });
      }

      x++;
    }
    x = 0;
    y++;
  }

  return enemies;
}

export function withBlur(handler: any) {
  return (event: MouseEvent<HTMLButtonElement>): void | undefined => {
    event.currentTarget.blur();
    handler(event);
  }
}

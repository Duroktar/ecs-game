import { ISystemManager, IEntity } from "../lib/types";
import { MouseEvent } from "react";
import { createEnemy } from "../game/factories/enemy";

export function loadLevel(system: ISystemManager, enemyPositions: number[][]): IEntity[] {
  let enemies: IEntity[] = [];

  let x: number = 0;
  let y: number = 0;

  for (const row of enemyPositions) {
    for (const item of row) {
      if (item !== 0) {
        const geometry = {
          width:    64,
          height:   64,
        }
  
        const position = {
          x:    x * geometry.width,
          y:    y * geometry.height,
        }
  
        enemies.push(createEnemy(system, JSON.stringify(position), position, geometry));
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

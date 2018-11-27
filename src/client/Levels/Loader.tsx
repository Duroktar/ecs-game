import * as React from 'react';
import { Levels } from '.';
import { GameState } from '../../types';
import { ISystemManager, IEntity } from '../../lib/types';
import { createEnemy } from '../../game/game';

interface Props {
	levels?:  		Levels;
	current:  		keyof Levels;
	state:    		GameState;
	system:   		ISystemManager;
	onEnemyDeath: (entity: IEntity) => void;
}

export function Loader({
	levels = Levels,
	...rest
}: Props) {
	const ThisLevel = levels[rest.current];
  return (
		<ThisLevel
			onEnemyDeath={rest.onEnemyDeath}
			{...rest}
		/>
  );
}

export function loadLevel(enemyPositions: number[][]) {
  let enemies: IEntity[] = [];
  let x: number = 0;
  let y: number = 0;

  for (const row of enemyPositions) {
    for (const item of row) {
      if (item === 0) { continue; }

      const geometry = {
        width:    64,
        height:   16,
      }

      const position = {
        x:    x * geometry.width,
        y:    y * geometry.height,
      }

      enemies.push(createEnemy(JSON.stringify(position), position, geometry));
      x++;
    }
    x = 0;
    y++;
  }

  return enemies;
}

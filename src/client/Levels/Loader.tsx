import { ISystemManager, IEntity } from '../../lib/types';
import { IGameState } from '../../types';
import { ILevels, ILevel } from './types';
import * as React from 'react';

import { Demo } from './Demo/Demo';
import { Level1 } from './1/Level.1';
import { loadLevel } from '../utils';

export const Levels = {
	demo: 		Demo,
	level1: 	Level1,
}

interface Props {
	levels?:  		ILevels;
	currentLevel: ILevel;
	state:    		IGameState;
	system:   		ISystemManager;
	onEnemyDeath: (entity: IEntity) => void;
}

export function Loader({
	levels = Levels,
	...rest
}: Props) {
  const ThisLevel = levels[rest.currentLevel];
  return (
		<ThisLevel
      onEnemyDeath={rest.onEnemyDeath}
      loadLevel={loadLevel}
			{...rest}
		/>
  );
}

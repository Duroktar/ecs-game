import { ISystemManager, IEntity } from '../../lib/types';
import { IGameState } from '../../game/types';
import { ILevels, ILevel } from './types';
import * as React from 'react';

import { Demo } from './Demo/Demo';
import { Level1 } from './1/Level.1';
import { loadLevel } from '../utils';
import { Level2 } from './2/Level.2';
import { Level3 } from './3/Level.3';

export const Levels = {
	demo: 		{
    level: Demo,
    next: 'level1',
  },
	level1: 	{
    level: Level1,
    next: 'level2',
  },
	level2: 	{
    level: Level2,
    next: 'level3',
  },
	level3: 	{
    level: Level3,
    next: 'demo',
  },
}

export const humanizedLevelNames = {
  demo: 'Demo',
  level1: '1',
  level2: '2',
  level3: '3',
}

interface Props {
	levels?:  		ILevels;
	currentLevel: ILevel;
	state:    		IGameState;
	system:   		ISystemManager;
}

export function Loader({
	levels = Levels,
	...rest
}: Props) {
  const levelObject = levels[rest.currentLevel];
  if (levelObject === undefined) {
    return null;
  }
  const ThisLevel = levelObject.level
  return (
		<ThisLevel
      loadLevel={loadLevel}
			{...rest}
		/>
  );
}

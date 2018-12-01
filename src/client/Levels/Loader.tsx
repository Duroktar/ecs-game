import { ISystemManager } from '../../lib/types';
import { IGameState } from '../../game/types';
import { ILevels, ILevel } from './types';
import * as React from 'react';

import { Levels, getNextLevel } from './Directory';
import { loadLevel } from '../utils';

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
  const GameLevel = getNextLevel(rest.currentLevel);

  if (GameLevel === undefined) {
    return null;
  }

  return (
		<GameLevel.level
      loadLevel={loadLevel}
			{...rest}
		/>
  );
}

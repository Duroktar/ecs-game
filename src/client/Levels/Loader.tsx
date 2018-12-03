import { ISystemManager } from '../../engine/types';
import { IGameState } from '../../game/types';
import { ILevels, ILevel } from './types';
import * as React from 'react';

import { Levels, getThisLevel } from './Directory';
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
  const GameLevel = getThisLevel(rest.currentLevel);

  if (GameLevel === undefined) {
    return null;
  }

  return (
		<GameLevel
      loadLevel={loadLevel}
			{...rest}
		/>
  );
}

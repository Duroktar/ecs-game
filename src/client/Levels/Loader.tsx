import { ISystemManager } from '../../engine/types';
import { IGameState } from '../../game/types';
import { ILevels, ILevel } from './types';
import * as React from 'react';

import { Countdown } from '../Components/Countdown'
import { Levels, getThisLevel } from './Directory';
import { loadLevel } from '../utils';
import { ON_LEVEL_BEGIN, ON_LEVEL_LOAD } from '../../events';

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
	const [ready, setReady] = React.useState(false);
	const [level, setLevel] = React.useState(rest.currentLevel);

  const GameLevel = getThisLevel(rest.currentLevel);
	
	React.useEffect(() => {
		rest.system.events.emit(ON_LEVEL_LOAD)
		setLevel(rest.currentLevel);
		setReady(false);
	}, [rest.currentLevel])

	const onCountdownFinished = () => {
		rest.system.events.emit(ON_LEVEL_BEGIN, level)
		setReady(true);
	}

  return (
		<>
			<GameLevel
				loadLevel={loadLevel}
				{...rest}
			/>

			<Countdown
				level={level}
				onReady={onCountdownFinished}
			/>
		</>
  );
}

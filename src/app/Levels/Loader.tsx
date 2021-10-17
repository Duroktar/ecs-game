import { IGameState } from '../../game/types';
import { ILevels, ILevel } from './types';
import * as React from 'react';

import { Countdown } from '../Components/Countdown'
import { Levels, getThisLevel } from './Directory';
import { loadLevel } from '../utils';
import { LEVEL_BEGIN, LEVEL_LOAD } from '../../events';

interface Props {
	levels?:  		ILevels;
	currentLevel: ILevel;
	state:    		IGameState;
}

export function Loader({
	levels = Levels,
	...rest
}: Props) {
	const [ready, setReady] = React.useState(false);
	const [retries, setRetries] = React.useState(0);
	const [level, setLevel] = React.useState(rest.currentLevel);

  const GameLevel = getThisLevel(rest.currentLevel);

	function onCountdownFinished() {
		rest.state.system.events.emit(LEVEL_BEGIN, level)
		setReady(true);
	}

	React.useEffect(() => {
		rest.state.system.events.emit(LEVEL_LOAD)
		setLevel(rest.currentLevel);
		setReady(false);
	}, [rest.currentLevel])

  return (
		<>
			<GameLevel
				loadLevel={loadLevel}
        system={rest.state.system}
				{...rest}
			/>

			<Countdown
				retries={retries}
				level={level}
				onReady={onCountdownFinished}
			/>
		</>
  );
}

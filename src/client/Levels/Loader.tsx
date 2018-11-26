import * as React from 'react';
import { Levels } from '.';
import { GameState } from '../../types';
import { ISystemManager } from '../../lib/types';

interface Props {
	levels?:  Levels;
	current:  keyof Levels;
	state:    GameState;
	system:   ISystemManager;
}

export function Loader({
	state,
	current,
	system,
	levels = Levels,
}: Props) {
	const ThisLevel = levels[current];
  return (
    <div className="screen level">
      <ThisLevel system={system} {...state} />
    </div>
  );
}

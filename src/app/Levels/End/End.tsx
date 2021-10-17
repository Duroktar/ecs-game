import { LevelProps } from '../types';
import * as React from 'react';

import { ConnectedPlayer } from '../../Containers/Player/Player';

import { Level } from '../Base';
import { useEffect } from 'react';
import { GAME_WIN } from '../../../events';


export function End(props: LevelProps) {
  const {player, system} = props.state;

  useEffect(() => {
    system.events.emit(GAME_WIN)
  }, [])

  return (
    <Level>
      <ConnectedPlayer entity={player} system={system} />
    </Level>
  )
}

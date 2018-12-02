import { LevelProps } from '../types';
import * as React from 'react';

import { ConnectedPlayer } from '../../Components/Player';

import { Level } from '../Base';


export function End(props: LevelProps) {
  const {player, system} = props.state;
  return (
    <Level>
      <ConnectedPlayer entity={player} system={system} />
    </Level>
  )
}

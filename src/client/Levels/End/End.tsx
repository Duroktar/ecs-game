import { LevelProps } from '../types';
import * as React from 'react';

import { Player } from '../../Components/Player';

import { Level } from '../Base';

interface State {}

export class End extends React.Component<LevelProps, State> {
  render() {
    const {player} = this.props.state;
    return (
      <Level>
        <Player model={player}/>
      </Level>
    )
  }
}

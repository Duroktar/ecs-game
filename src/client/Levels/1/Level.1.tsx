import * as React from 'react';

import { Player } from '../../Components/Player';
import { Bullet } from '../../Components/Bullet';

import { Level } from '../Base';
import { LevelProps } from '../types';

export function Level1(props: LevelProps) {
  return (
    <Level>

      <Player model={props.state.player}/>

      <Bullet model={props.state.bullet1} />
      <Bullet model={props.state.bullet2} />

      {/* <Enemy  model={props.enemy1} /> */}
    </Level>
  )
}

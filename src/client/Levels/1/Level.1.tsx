import * as React from 'react';
import { Level } from '../Base';
import { Player } from '../../Components/Player';
import { Bullet } from '../../Components/Bullet';
import { GameState } from '../../../types';

export function Level1(props: GameState) {
  return (
    <Level system={props.system} {...props}>
      <Player position={props.player.position}/>
      <Bullet model={props.bullet1} />
      <Bullet model={props.bullet2} />
    </Level>
  )
}

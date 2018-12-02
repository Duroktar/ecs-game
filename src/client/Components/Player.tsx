import { IEntity } from '../../lib/types';
import * as React from 'react';

import ShipSprite from '../../assets/player/ship.png';

import { CharacterModel } from '../../game/Domain/character';
import { withEntity } from '../Hoc/withEntity';

interface Props {
  model:    CharacterModel;
  onDeath?: (entity: IEntity) => void;
}

export function Player(props: Props) {
  const styles: React.CSSProperties = {
    position:           'absolute',
    backgroundImage:    `url(${ShipSprite})`,
    backgroundSize:     'contain',
    backgroundPosition: 'center',
    left:               props.model.position.x - 32,
    top:                props.model.position.y - 32,
    width:              '64px',
    height:             '64px',
  }

  return (
    <div id="player" className="sprite" style={styles} />
  )
}

export const ConnectedPlayer = withEntity<CharacterModel>(Player)

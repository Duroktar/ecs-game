import * as React from 'react';

import ShipSprite from '../../assets/ship.png';
import { CharacterModel } from '../../game/Domain/character';

interface Props {
  model: CharacterModel;
}

export function Player(props: Props) {
  const styles: React.CSSProperties = {
    position:           'absolute',
    backgroundImage:    `url(${ShipSprite})`,
    backgroundSize:     'contain',
    backgroundPosition: 'center',
    left:               props.model.position.x,
    top:                props.model.position.y,
    width:              '64px',
    height:             '64px',
  }

  return (
    <div id="player" className="sprite" style={styles} />
  )
}

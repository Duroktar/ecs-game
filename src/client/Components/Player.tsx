import * as React from 'react';

import ShipSprite from '../../assets/ship.png';

interface Props {
  position: {
    x: number;
  }
}

export function Player(props: Props) {
  const styles: React.CSSProperties = {
    position: 'absolute',
    backgroundImage: `url(${ShipSprite})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    left: props.position.x,
    bottom: 25,
    width: '64px',
    height: '64px',
  }

  return (
    <div id="player" className="sprite" style={styles} />
  )
}

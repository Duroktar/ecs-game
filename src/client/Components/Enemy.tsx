import { IOwned, IEntity, ISystemManager, EntityIdType } from '../../lib/types';
import * as React from 'react';

import ShipSprite from '../../assets/enemy/enemy-ship.png';

import Explosion0 from '../../assets/enemy/enemy-explosion-00.png';
import Explosion1 from '../../assets/enemy/enemy-explosion-01.png';
import Explosion2 from '../../assets/enemy/enemy-explosion-02.png';
import Explosion3 from '../../assets/enemy/enemy-explosion-03.png';
import Explosion4 from '../../assets/enemy/enemy-explosion-04.png';
import Explosion5 from '../../assets/enemy/enemy-explosion-05.png';

import { MobModel } from '../../game/Domain/mob';
import { withEntity } from '../Hoc/withEntity';
import { withAnimationState, different } from '../hooks/withAnimationState';

const fr = (id: number, duration: number) => ({ id, duration });

const enemyFrames = [
  ShipSprite,
  Explosion0,
  Explosion1,
  Explosion2,
  Explosion3,
  Explosion4,
  Explosion5,
]

interface Props {
  model: MobModel & IOwned & IEntity;
  system: ISystemManager;
}

export function Enemy(props: Props) {
  const [hidden, setHidden] = React.useState(() => false)
  const [dead, setDead] = React.useState(() => false)
  const {currentFrame, setCurrentAnimation} = withAnimationState({
    animations: {
      normal: [
        fr(0, 0)
      ],
      death: [
        fr(1, 0),
        fr(2, 100),
        fr(3, 100),
        fr(4, 100),
        fr(5, 100),
        fr(6, 75),
      ],
    },
    currentAnimation: 'normal',
    frames: enemyFrames,
    onFinished: () => setHidden(true)
  });

  if (!hidden && !dead && props.model.isDead) {
    setCurrentAnimation('death');
    setDead(true);
  }

  const styles: React.CSSProperties = {
    position:           'absolute',
    backgroundImage:    `url(${currentFrame})`,
    backgroundSize:     'contain',
    backgroundPosition: 'center',
    width:              '64px',
    height:             '64px',
    left:               hidden ? -9999 : props.model.position.x,
    top:                hidden ? -9999 : props.model.position.y,
    display:            cssDisplayValue(hidden),
  }

  return (
    <div id="enemy" className="sprite" style={styles} />
  )
}

export const ConnectedEnemy = withEntity<MobModel>(Enemy)

function cssDisplayValue(dead: boolean) {
  return dead ? 'none' : ''
}

import { IOwned, IEntity } from '../../lib/types';
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

const fr = (id: number, duration: number) => ({ id, duration });

const enemyFrames = [
  Explosion0,
  Explosion1,
  Explosion2,
  Explosion3,
  Explosion4,
  Explosion5,
]

interface Props {
  model: MobModel & IOwned & IEntity;
}

interface State {
  animations:     IAnimations;
  currentFrame:   number | null;
  dead:           boolean;
}

interface IFrame {
  id:         number;
  duration:   number;
}

interface IAnimations {
  death: IFrame[];
}

export class Enemy extends React.Component<Props, State> {
  private timers: NodeJS.Timer[] = [];

  state: State = {
    dead: false,
    currentFrame: null,
    animations: {
      death: [
        fr(0, 0),
        fr(1, 100),
        fr(2, 100),
        fr(3, 100),
        fr(4, 100),
        fr(5, 75),
      ],
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.model.isDead && nextProps.model.isDead) {

      const onFinishedAnimation = () => {
        this.setState({ dead: true })
      }

      this.runDeathAnimation(onFinishedAnimation);
    }
  }

  componentWillUnmount() {
    if (this.timers) {
      this.timers.forEach(timer => clearTimeout(timer))
    }
  }

  runDeathAnimation = (onFinished: () => void) => {
    let buffer: number = 0;
    this.state.animations.death.forEach(({ id, duration }) => {
      this.queueFrame(id, buffer);
      buffer += duration;
    })
    this.timers.push(setTimeout(onFinished, buffer));
  }

  queueFrame = (frame: number, when: number) => {
    const setFrame = (fr: number) => {
      this.setState({ currentFrame: fr });
    }

    this.timers.push(setTimeout(() => setFrame(frame), when));
  }

  render() {
    const {currentFrame, dead} = this.state;

    const getFrame = (frame: number) => {
      return enemyFrames[frame]
    }

    const imageUri = (currentFrame === null)
      ? ShipSprite
      : getFrame(currentFrame);

    const styles: React.CSSProperties = {
      position:           'absolute',
      backgroundImage:    `url(${imageUri})`,
      backgroundSize:     'contain',
      backgroundPosition: 'center',
      width:              '64px',
      height:             '64px',
      left:               dead ? -9999 : this.props.model.position.x,
      top:                dead ? -9999 : this.props.model.position.y,
      display:            cssDisplayValue(dead),
    }
  
    return (
      <div id="enemy" className="sprite" style={styles} />
    )
  }
}

export const ConnectedEnemy = withEntity<MobModel>(Enemy)

function cssDisplayValue(dead: boolean) {
  return dead ? 'none' : ''
}

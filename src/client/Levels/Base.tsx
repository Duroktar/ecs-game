import * as React from 'react';
import { GameState } from '../../types';
import { first } from '../../lib/utils';
import { ISystemManager } from '../../lib/types';
import { ProjectileModel } from '../../game/Domain/projectile';

interface Props extends GameState {
  system:   ISystemManager;
  children: React.ReactNode;
}

interface State {
  shots:    number;
  hits:     number;
}

export class Level extends React.Component<Props, State> {
  state = {
    shots: 0,
    hits:  0,
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.player.attacking && nextProps.player.attacking) {
      const {x, y} = this.props.player.position
      this.fireBullet(x, y);
    }
  }

  getBullet = (): ProjectileModel => {
    const {bullet1, bullet2} = this.props;
    return first([bullet1, bullet2].filter(model => model.offscreen))
  }

  fireBullet = (x: number, y: number) => {
    const bullet = this.getBullet();
    if (!bullet) {
      return;
    }

    bullet.position.x = x;
    bullet.position.y = y + 6;

    this.setState(state => ({
      ...state,
      shots: state.shots + 1,
    }))
  }

  render() {
    return (
      <div className="screen level">
        {this.props.children}
      </div>
    );
  }
}

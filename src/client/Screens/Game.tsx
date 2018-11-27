import { ISystemManager, IVector, IEntity } from '../../lib/types';
import { GameState, IPointsLoot } from '../../types';
import * as React from 'react';

import StarField from '../Backgrounds/StarField';
import { Gui } from '../Layouts/Gui';

import { ProjectileModel } from '../../game/Domain/projectile';
import { Loader } from '../Levels/Loader';
import { WithHealth } from '../../lib/components/killable';
import { WithPosition } from '../../lib/components/moveable';
import { IsLootable } from '../../lib/components/lootable';
import { first } from '../../lib/utils';


interface Props extends GameState {
  system:   ISystemManager;
  children: React.ReactNode;
  onPoints: (score: any) => void;
}

interface State {
  shots:    number;
  hits:     number;
}

export class Game extends React.Component<GameState, State> {
  state = {
    score:    0,
    credits:  0,
    lives:    0,
    shots:    0,
    hits:     0,
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.player.attacking && nextProps.player.attacking) {
      this.fireBullet(this.props.player.position);
    }

    this.handleBulletCollisions();
  }

  handleBulletCollisions = () => {
    const { bullet1, bullet2 } = this.props;
    if (bullet1.collisions!.length || bullet2.collisions!.length) {

      const collisions = [ 
        ...bullet1.collisions!, 
        ...bullet2.collisions!,
      ];

      const deadpool = new Set(collisions);

      const oneOfUsAreSpecialSnowflakes = this.isSparta;

      deadpool.forEach(oneOfUsAreSpecialSnowflakes);

      [bullet1, bullet2].forEach(bullet => {
        if (bullet.collisions!.length > 0) {
          this.killEntity(bullet.id)
        }
      })
    }
  }

  getBullet = (): ProjectileModel => {
    return first([
      this.props.bullet1,
      this.props.bullet2,
    ].filter(model =>
      model.health === 0 || !!model.offscreen,
    ))
  }

  fireBullet = (pos: IVector) => {
    const bullet = this.getBullet();

    if (!bullet) {
      return;
    }

    bullet.position.x = pos.x;
    bullet.position.y = pos.y - 40;

    this.reviveEntity(bullet, 1);

    this.setState(state => ({
      ...state,
      shots: state.shots + 1,
    }))
  }

  killEntity = (id: number) => {
    const component = this.props.system
      .getEntityComponent<WithHealth & WithPosition>({ id }, 'health');

    if (component === undefined) {
      return;
    }

    component.state.health = 0;
    component.state.position = {
      x: -100,
      y: -100,
    }
  }

  reviveEntity = (entity: IEntity, health: number) => {
    const component = this.props.system
      .getEntityComponent<WithHealth>(entity, 'health');

    if (component === undefined) {
      return;
    }
  
    component.state.health = health;
  }

  isSparta = (deadId: number) => {
    this.killEntity(deadId);
  }

  onEnemyDeath = (entity: IEntity) => {
    const component = this.props.system
      .getEntityComponent<IsLootable<IPointsLoot>>(entity, 'loot');

    if (component === undefined) {
      return;
    }
  
    const points = component.state.loot!.points;
    this.setState({ score: this.state.score + points })
  }

  render() {
    const {score, credits, lives} = this.state;
    return (
      <Gui
        id="gui"
        className="game"
        score={score}
        credits={credits}
        lives={lives}
        background={<StarField />}
      >
        <Loader
          current={'demo'}
          state={this.props}
          system={this.props.system}
          onEnemyDeath={this.onEnemyDeath}
        />
      </Gui>
    )
  }
}

interface State {
  score:    number;
  credits:  number;
  lives:    number;
}

import { IVector, IEntity, IComponent } from '../../lib/types';
import { IGameState, IPointsLoot } from '../../game/types';
import * as React from 'react';

import StarField from '../Backgrounds/StarField';
import { Gui } from '../Layouts/Gui';

import { ProjectileModel } from '../../game/Domain/projectile';
import { Loader, Levels, humanizedLevelNames } from '../Levels/Loader';
import { WithHealthState } from '../../lib/components/killable';
import { WithPosition } from '../../lib/components/withPosition';
import { IsLootable } from '../../lib/components/lootable';
import { first, pp } from '../../lib/utils';
import { ILevel } from '../Levels/types';
import { ON_LEVEL_COMPLETE, ON_ENEMY_DEATH, ON_COLLISION, ON_START_GAME } from '../../events';
import { WithCollisions } from '../../lib/components/withCollisions';


interface Props extends IGameState {
  restart:  () => void;
}

interface State {
  shots:          number;
  hits:           number;
  score:          number;
  credits:        number;
  lives:          number;
  complete:       boolean;
  completed:      (string | number)[];
  currentLevel:   ILevel;
}

export class Game extends React.Component<Props, State> {
  state = {
    score:              0,
    credits:            1,
    lives:              3,
    shots:              0,
    hits:               0,
    complete:           false,
    completed:          [],
    currentLevel:       'level1' as ILevel,
  }
  
  componentDidMount() {
    this.props.system.events.registerEvent(ON_COLLISION,      this.handleBulletCollisions)
    this.props.system.events.registerEvent(ON_ENEMY_DEATH,    this.handleEnemyDeath)
    this.props.system.events.registerEvent(ON_LEVEL_COMPLETE, this.handleLevelComplete)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.player.attacking && nextProps.player.attacking) {
      this.fireBullet(this.props.player.position);
    }
  }

  componentWillUnmount() {
    this.props.system.events.unRegisterEvent(ON_COLLISION,      this.handleBulletCollisions)
    this.props.system.events.unRegisterEvent(ON_ENEMY_DEATH,    this.handleEnemyDeath)
    this.props.system.events.unRegisterEvent(ON_LEVEL_COMPLETE, this.handleLevelComplete)
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
    }
  }

  getBullet = (): ProjectileModel => {
    return first([
      this.props.bullet1,
      this.props.bullet2,
    ].filter(model => !!model.offscreen ))
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
      .getEntityComponent<WithHealthState & WithPosition>({ id }, 'health');

    if (component === undefined) {
      return;
    }

    component.state.health.value = 0;
  }

  reviveEntity = (entity: IEntity, health: number) => {
    const component = this.props.system
      .getEntityComponent<WithHealthState>(entity, 'health');

    if (component === undefined) {
      return;
    }
  
    component.state.health.value = health;
  }

  isSparta = (deadId: number) => {
    this.killEntity(deadId);
  }

  handleEnemyDeath = (source: IComponent) => {
    const component = this.props.system
      .getEntityComponent<IsLootable<IPointsLoot>>({ id: source.entityId }, 'loot');

    if (component === undefined) {
      return;
    }
  
    const points = component.state.loot!.points;

    this.setState(state => ({
      score: state.score + points,
      hits: state.hits + 1,
    }))
  }

  handleLevelComplete = (level: string | number) => {
    this.setState(state => ({
      complete: true,
      completed: state.completed.concat(level),
    }));
  }

  startNewGame = () => {
    setTimeout(() => this.setState({ currentLevel: 'level1' }), 5);
  }

  onNextLevel = () => {
    const currentLevel = this.state.currentLevel;
    const nextLevel = Levels[currentLevel].next;
    this.setState({ currentLevel: 'demo' });
    setTimeout(() => {
      this.setState({ currentLevel: nextLevel as ILevel, complete: false })
    }, 5)
  }

  render() {
    const {currentLevel, score, credits, lives} = this.state;
    return (
      <Gui
        id="gui"
        className="game"
        level={humanizedLevelNames[currentLevel]}
        score={score}
        credits={credits}
        lives={lives}
        onRestart={this.props.restart}
        background={<StarField />}
      >
        <Loader
          currentLevel={currentLevel}
          state={this.props}
          system={this.props.system}
        />
        <div className="center-content">
          {this.state.complete ? (
            <div className="complete container with-title is-center is-dark">
              <label className="title">Level Complete</label>
              <pre>{pp(this.state)}</pre>
              <button className="btn is-primary" onClick={this.onNextLevel}>Next Level</button>
            </div>
          ) : null}
        </div>
      </Gui>
    )
  }
}

import { IVector, IEntity, IComponent } from '../../../engine/types';
import { IGameState, IPointsLoot, ICurrentGameState } from '../../../game/types';
import { ILevel } from '../../Levels/types';
import * as React from 'react';

import StarField from '../../Backgrounds/StarField';
import { Gui } from '../../Layouts/Gui';

import { Sfx, Songs } from '../../../game/catalogue';
import { ProjectileModel } from '../../../game/Domain/projectile';
import { WithHealthState } from '../../../engine/components/killable';
import { WithPositionState } from '../../../engine/components/withPosition';
import { WithHomePosition } from '../../../engine/components/withHomePosition';
import { WithAttack } from '../../../engine/components/combatable';
import { IsLootable } from '../../../engine/components/lootable';

import { Loader, humanizedLevelNames } from '../../Levels';
import { getNextLevel } from '../../Levels/Directory';
import { LevelSummary } from '../../Components/LevelSummary';
import { Screens } from '../../Screens';

import { first, mkEntity, clamp } from '../../../engine/utils';
import { keyframes } from '../../utils/keyframes';

import { LEVEL_COMPLETE, ENEMY_DEATH, COLLISION, GAME_OVER, PLAYER_ATTACK, LEVEL_LOAD, LEVEL_BEGIN, START_ENGINE, STOP_ENGINE, REVIVE_PLAYER, PLAYER_DEATH } from '../../../events';

interface Props extends IGameState {
  onRestart:    () => void;
  onFinalScore: (stats: ICurrentGameState) => void;
  nav:          (screen: Screens) => void;
}

export class Game extends React.PureComponent<Props, ICurrentGameState> {
  constructor(props: Props) {
    super(props);

    this.registerEvents();
  }

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
    this.props.system.audio.playSong(Songs.GAME);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.player.attacking && nextProps.player.attacking) {
      this.fireBullet(this.props.player.center);
    }
  }

  componentWillUnmount() {
    this.props.system.audio.stopSong(Songs.GAME);
    this.unRegisterEvents();
  }

  registerEvents = () => {
    this.props.system.events.registerListener(LEVEL_LOAD,     this.handleLevelLoading);
    this.props.system.events.registerListener(LEVEL_BEGIN,    this.handleLevelBegin);
    this.props.system.events.registerListener(LEVEL_COMPLETE, this.handleLevelComplete);
    this.props.system.events.registerListener(PLAYER_DEATH,   this.onPlayerDeath);
    this.props.system.events.registerListener(REVIVE_PLAYER,  this.onPlayerRevive);
    this.props.system.events.registerListener(ENEMY_DEATH,    this.handleEnemyDeath);
    this.props.system.events.registerListener(COLLISION,      this.handleCollision);
    this.props.system.events.registerListener(GAME_OVER,      this.handleGameOver);
  }

  unRegisterEvents = () => {
    this.props.system.events.unRegisterListener(LEVEL_LOAD,     this.handleLevelLoading);
    this.props.system.events.unRegisterListener(LEVEL_BEGIN,    this.handleLevelBegin);
    this.props.system.events.unRegisterListener(LEVEL_COMPLETE, this.handleLevelComplete);
    this.props.system.events.unRegisterListener(PLAYER_DEATH,   this.onPlayerDeath);
    this.props.system.events.unRegisterListener(REVIVE_PLAYER,  this.onPlayerRevive);
    this.props.system.events.unRegisterListener(ENEMY_DEATH,    this.handleEnemyDeath);
    this.props.system.events.unRegisterListener(COLLISION,      this.handleCollision);
    this.props.system.events.unRegisterListener(GAME_OVER,      this.handleGameOver);
  }

  handleCollision = (component: IComponent, entity: IEntity) => {
    const { bullet1, bullet2 } = this.props;

    if (bullet1.collisions.size || bullet2.collisions.size) {

      const collisions = new Set([
        ...bullet1.collisions,
        ...bullet2.collisions,
      ]);

      const deadpool = [...collisions].map(mkEntity);

      deadpool.forEach(this.killEntity);
    }
  }

  getBullet = (): ProjectileModel => {
    const bullets = [this.props.bullet1, this.props.bullet2]
      .filter(model => !!model.offscreen)
      .map(model => {
        model.collisions.clear();
        return model;
      });

    return first(bullets);
  }

  fireBullet = (pos: IVector): void => {
    const bullet = this.getBullet();

    if (!bullet ) {
      return;
    }

    bullet.position.x = pos.x;
    bullet.position.y = pos.y;

    this.reviveEntity(bullet, 1);

    this.setState(state => ({
      ...state,
      shots: state.shots + 1,
    }));

    this.props.system.events.emit(PLAYER_ATTACK, this.props.player)
  }

  killEntity = (entity: IEntity) => {
    const component = this.props.system
      .getEntityComponent<WithHealthState>(entity, 'health');

    if (component === undefined) {
      return;
    }

    component.state.health.value = 0;
  }

  reviveEntity = (entity: IEntity, health: number): void => {
    const component = this.props.system
      .getEntityComponent<WithHealthState>(entity, 'health');

    if (component === undefined) {
      return;
    }

    component.state.health.value = health;
  }

  handleEnemyDeath = (source: IComponent): void => {
    const component = this.props.system
      .getEntityComponent<IsLootable<IPointsLoot>>({ id: source.entityId }, 'loot');

    if (component === undefined) {
      return;
    }

    const points = component.state.loot!.points;

    this.setState(state => ({
      score: state.score + points,
      hits: state.hits + 1,
    }));
  }

  onPlayerRevive = () => {
    this.reviveEntity(this.props.player, 100);
  }

  onPlayerDeath = (player: IComponent) => {
    if (this.state.lives === 0) {
      this.handleGameOver();
      return;
    }

    this.handleLevelLoading();

    setTimeout(() => {
      this.props.system.events.emit(REVIVE_PLAYER);
    }, 850);

    this.setState(state => ({
      lives: clamp(0, Infinity, state.lives - 1),
    }));
  }

  handleLevelLoading = (): void => {
    this.props.system.events.emit(STOP_ENGINE)

    const { components } = this.props.system.getState();

    const combatants: IComponent<WithAttack>[] = components.filter(o => o.name === 'attack');
    const controls: IComponent<WithPositionState>[] = components.filter(o => o.name === 'position');
    const homePositions: IComponent<WithHomePosition>[] = components.filter(o => o.name === 'homePosition');

    controls.forEach(component => {
      component.state.controllable = false;
    })
    homePositions.forEach(component => {
      component.state.goHome = true;
    })
    combatants.forEach(component => {
      component.state.disabled = true;
    })

    this.props.system.events.emit(START_ENGINE)
  }

  handleLevelBegin = (): void => {
    const { components } = this.props.system.getState();

    const combatants: IComponent<WithAttack>[] = components.filter(o => o.name === 'attack');
    const controls: IComponent<WithPositionState>[] = components.filter(o => o.name === 'position');
    const homePositions: IComponent<WithHomePosition>[] = components.filter(o => o.name === 'homePosition');

    controls.forEach(component => {
      component.state.controllable = true;
    })
    homePositions.forEach(component => {
      component.state.goHome = false;
    })
    combatants.forEach(component => {
      component.state.disabled = false;
    })
  }

  handleLevelComplete = (level: string | number): void => {
    keyframes(
      [() => this.props.system.audio.stopSong(Songs.GAME), 0],
      [() => this.props.system.audio.playSound(Sfx.LEVEL_WIN), 750],
      [() => {
        this.props.system.audio.playSong(Songs.SUMMARY);

        this.setState(state => ({
          complete: true,
          completed: state.completed.concat(level),
        }));
      }, 1500],
    )
  }

  handleGameOver = (): void => {
    keyframes(
      [() => this.props.system.audio.stopSong(Songs.GAME), 0],
      [() => this.props.system.audio.playSound(Sfx.LEVEL_WIN), 1500],
      [() => this.props.system.audio.playSound(Sfx.GAMEOVER), 2250],
      [() => this.props.onFinalScore(this.state), 3000],
    )
  }

  startNewGame = (): void => {
    keyframes(
      [() => this.props.system.audio.playSound(Sfx.NEW_GAME), 0],
      [() => this.setState({ currentLevel: 'level1' }), 5],
    )
  }

  onNextLevel = (): void => {
    keyframes(
      [() => this.props.system.audio.stopSong(Songs.SUMMARY), 0],
      [() => this.props.system.audio.playSound(Sfx.NEXT_LEVEL), 350],
      [() => {
        const currentLevel = this.state.currentLevel;
        const nextLevel = getNextLevel(currentLevel);

        this.setState({ currentLevel: nextLevel as ILevel, complete: false })
      }, 1200],
      [() => this.props.system.audio.playSong(Songs.GAME), 3000],
    )
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
        onRestart={this.props.onRestart}
        background={<StarField />}
      >
        <Loader
          currentLevel={currentLevel}
          state={this.props}
        />

        {this.state.complete ? (
          <div className="center-content absolute-fit">
            <LevelSummary
              currentLevel={currentLevel}
              state={this.state}
              onNextLevel={this.onNextLevel}
            />
          </div>
        ) : null}
      </Gui>
    )
  }
}

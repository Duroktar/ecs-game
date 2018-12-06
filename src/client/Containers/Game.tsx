import { IVector, IEntity, IComponent } from '../../engine/types';
import { IGameState, IPointsLoot, ICurrentGameState } from '../../game/types';
import { ILevel } from '../Levels/types';
import * as React from 'react';

import StarField from '../Backgrounds/StarField';
import { Gui } from '../Layouts/Gui';

import { ProjectileModel } from '../../game/Domain/projectile';
import { WithHealthState } from '../../engine/components/killable';
import { WithPositionState, setPositionState } from '../../engine/components/withPosition';
import { IsLootable } from '../../engine/components/lootable';

import { Loader, humanizedLevelNames } from '../Levels';
import { LevelSummary } from '../Components/LevelSummary';

import { first, clamp } from '../../engine/utils';

import { ON_LEVEL_COMPLETE, ON_GAME_OVER, ON_PLAYER_ATTACK, ON_LEVEL_LOAD, ON_LEVEL_BEGIN, ON_START_ENGINE, ON_STOP_ENGINE, ON_PLAYER_DEATH, ON_ENEMY_DEATH, ON_COLLISION, ON_REVIVE_PLAYER } from '../../events';
import { getNextLevel } from '../Levels/Directory';
import { Sfx, Songs } from '../../game/catalogue';
import { WithControls } from '../../engine/components/withControls__unused';
import { MobModel } from '../../game/Domain/mob';
import { CharacterModel } from '../../game/Domain/character';
import { WithHomePosition } from '../../engine/components/withHomePosition';

type LootablePoints = IsLootable<IPointsLoot>;

interface Props extends IGameState {
  onRestart:  () => void;
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
    this.props.system.events.registerListener(ON_LEVEL_LOAD,      this.handleLevelLoading);
    this.props.system.events.registerListener(ON_LEVEL_BEGIN,     this.handleLevelBegin);
    this.props.system.events.registerListener(ON_LEVEL_COMPLETE,  this.handleLevelComplete);
    this.props.system.events.registerListener(ON_PLAYER_DEATH,    this.onPlayerDeath);
    this.props.system.events.registerListener(ON_REVIVE_PLAYER,   this.onPlayerRevive);
    this.props.system.events.registerListener(ON_ENEMY_DEATH,     this.onEnemyDeath);
    this.props.system.events.registerListener(ON_GAME_OVER,       this.handleGameOver);
    this.props.system.events.registerListener(ON_COLLISION,       this.handleCollision);
  }

  unRegisterEvents = () => {
    this.props.system.events.unRegisterListener(ON_LEVEL_LOAD,      this.handleLevelLoading);
    this.props.system.events.unRegisterListener(ON_LEVEL_BEGIN,     this.handleLevelBegin);
    this.props.system.events.unRegisterListener(ON_LEVEL_COMPLETE,  this.handleLevelComplete);
    this.props.system.events.unRegisterListener(ON_PLAYER_DEATH,    this.onPlayerDeath);
    this.props.system.events.unRegisterListener(ON_REVIVE_PLAYER,   this.onPlayerRevive);
    this.props.system.events.unRegisterListener(ON_ENEMY_DEATH,     this.onEnemyDeath);
    this.props.system.events.unRegisterListener(ON_GAME_OVER,       this.handleGameOver);
    this.props.system.events.unRegisterListener(ON_COLLISION,       this.handleCollision);
  }

  getBullet = (): ProjectileModel => {
    return first([
      this.props.bullet1,
      this.props.bullet2,
    ].filter(model => !!model.offscreen ))
  }

  fireBullet = (pos: IVector): void => {
    const bullet = this.getBullet();

    if (!bullet) {
      return;
    }

    bullet.position.x = pos.x;
    bullet.position.y = pos.y;

    this.reviveEntity(bullet, 1);

    this.setState(state => ({
      ...state,
      shots: state.shots + 1,
    }));

    this.props.system.events.emit(ON_PLAYER_ATTACK, this.props.player)
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

  handleCollision = (component: IComponent, entity: IEntity) => {
    if (this.props.player.id === entity.id) {
      this.props.system.events.emit(ON_PLAYER_DEATH, component)
    } else {
      this.props.system.events.emit(ON_ENEMY_DEATH, component)
    }
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
      this.props.system.events.emit(ON_REVIVE_PLAYER);
    }, 850);

    this.setState(state => ({
      lives: clamp(0, Infinity, state.lives - 1),
    }));
  }

  onEnemyDeath = (source: IComponent): void => {
    const component = this.props.system
      .getEntityComponent<LootablePoints>({ id: source.entityId }, 'loot');

    if (component === undefined) {
      return;
    }
  
    const points = component.state.loot!.points;

    this.setState(state => ({
      score: state.score + points,
      hits: state.hits + 1,
    }));
  }

  handleLevelLoading = (): void => {
    this.props.system.events.emit(ON_STOP_ENGINE)
        
    const controls: IComponent<WithPositionState>[] = this.props.system.getState().components.filter(o => o.name === 'position');
    const homePositions: IComponent<WithHomePosition>[] = this.props.system.getState().components.filter(o => o.name === 'homePosition');

    controls.forEach(component => {
      component.state.controllable = false;
    })
    homePositions.forEach(component => {
      component.state.goHome = true;
    })

    this.props.system.events.emit(ON_START_ENGINE)
  }
  
  handleLevelBegin = (): void => {
    const controls: IComponent<WithPositionState>[] = this.props.system.getState().components.filter(o => o.name === 'position');
    const homePositions: IComponent<WithHomePosition>[] = this.props.system.getState().components.filter(o => o.name === 'homePosition');
    
    controls.forEach(component => {
      component.state.controllable = true;
    })
    homePositions.forEach(component => {
      component.state.goHome = false;
    })
  }

  handleLevelComplete = (level: string | number): void => {
    this.props.system.audio.stopSong(Songs.GAME);
    
    setTimeout(() => {
      this.props.system.audio.playSound(Sfx.LEVEL_WIN);
    }, 750);
    
    setTimeout(() => {
      this.props.system.audio.playSong(Songs.SUMMARY);

      this.setState(state => ({
        complete: true,
        completed: state.completed.concat(level),
      }));
    }, 1500);
  }

  handleGameOver = (): void => {
    this.props.system.audio.stopSong(Songs.GAME);

    setTimeout(() => {
      this.props.system.audio.playSound(Sfx.LEVEL_WIN);
    }, 1500);

    setTimeout(() => {
      this.props.system.audio.playSound(Sfx.GAMEOVER);
    }, 2250);

    setTimeout(() => {
      window.location.assign(`/end?final=${JSON.stringify({
        score:    this.state.score,
        hits:     this.state.hits,
        shots:    this.state.shots,
        lives:    this.state.lives,
        credits:  this.state.credits,
      })}`);
    }, 3000);
  }

  startNewGame = (): void => {
    this.props.system.audio.playSound(Sfx.NEW_GAME);

    setTimeout(() => this.setState({ currentLevel: 'level1' }), 5);
  }

  onNextLevel = (): void => {
    this.props.system.audio.stopSong(Songs.SUMMARY);
    
    setTimeout(() => {
      this.props.system.audio.playSound(Sfx.NEXT_LEVEL);
    }, 350);

    setTimeout(() => {
      const currentLevel = this.state.currentLevel;
      const nextLevel = getNextLevel(currentLevel);

      this.setState({ currentLevel: nextLevel as ILevel, complete: false })
    }, 1200);

    setTimeout(() => {
      this.props.system.audio.playSong(Songs.GAME);
    }, 3000);
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
          system={this.props.system}
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

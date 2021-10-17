import * as React from 'react';
import { ISystemManager } from "../../engine/interfaces/ISystemManager";
import { LevelProps, ILoadedEnemy } from '../Levels/types';
import { Level } from '../Levels/Base';
import { ConnectedPlayer } from '../Containers/Player/Player';
import { Bullet } from '../Containers/Weapons/Bullet';
import { ENEMY_DEATH, LEVEL_COMPLETE, ENEMY_FREE, ENEMY_GROUP, LEVEL_BEGIN, REVIVE_PLAYER, DEATH, PLAYER_DEATH } from '../../events';
import { WithRandomWalk } from '../../engine/components/withRandomWalk';
import { IComponent, IEntity } from '../../engine/types';
import { WithHealth } from '../../engine/components/killable';

function arrayRandom<T>(items: T[]) {
  return items[Math.floor(Math.random()*items.length)];
}

const ENEMY_FREE_INTERVAL = 2000;

interface WithGameLevelOptions {
  enemyPositions: number[][];
  levelId:        string | number;
  completeEvent?: string;
}

interface State {
  enemies:          ILoadedEnemy[];
  enemyPositions:   number[][];
  enemiesDead:      number;
  levelId:          string | number;
  ready:            boolean;
  levelComplete:    boolean;
}

export const withGameLevel = (options: WithGameLevelOptions): React.ComponentType<LevelProps> => {

  return class LevelHOC extends React.Component<LevelProps, State> {
    private interval: any;

    state = {
      enemyPositions: options.enemyPositions,
      levelId: options.levelId,

      enemies: [] as ILoadedEnemy[],
      enemiesDead: 0,
      ready: false,

      levelComplete: false,
    }

    componentDidMount() {
      const {enemyPositions} = this.state;
      const {system, loadLevel} = this.props;

      const enemies = loadLevel(system, enemyPositions);

      this.setState({ enemies, ready: true })

      system.events.registerListener(DEATH,         this.handleDeath);
      system.events.registerListener(ENEMY_FREE,    this.enemyFree);
      system.events.registerListener(ENEMY_GROUP,   this.enemyGroup);
      system.events.registerListener(LEVEL_BEGIN,   this.startFreeEnemyInterval);
      system.events.registerListener(REVIVE_PLAYER, this.stopAllFreeEnemies);
    }

    componentDidUpdate(nextProps: LevelProps, nextState: State) {
      if (!nextState.ready || nextState.levelComplete || this.state.levelComplete) {
        return;
      }

      if (nextState.enemiesDead === nextState.enemies.length) {
        this.onLevelComplete(this.props.system, this.state.levelId);
      }
    }

    componentWillUnmount() {
      const {system} = this.props;

      clearInterval(this.interval);

      system.events.unRegisterListener(DEATH,         this.handleDeath);
      system.events.unRegisterListener(ENEMY_FREE,    this.enemyFree);
      system.events.unRegisterListener(ENEMY_GROUP,   this.enemyGroup);
      system.events.unRegisterListener(LEVEL_BEGIN,   this.startFreeEnemyInterval);
      system.events.unRegisterListener(REVIVE_PLAYER, this.stopAllFreeEnemies);

      this.state.enemies.forEach(o =>
        system.unRegisterEntity(o.entity.id)
      );
    }

    handleDeath = (component: IComponent<WithHealth>, entity: IEntity) => {
      if (this.props.state.player.id === component.entityId) {
        this.props.system.events.emit(PLAYER_DEATH, component)
      } else {
        this.props.system.events.emit(ENEMY_DEATH, component)

        this.setState(state => ({ enemiesDead: state.enemiesDead + 1 }));
      }
    }

    onLevelComplete = (system: ISystemManager, level: number | string) => {
      this.stopFreeEnemyInterval();

      if (!this.state.levelComplete) {
        system.events.emit(options.completeEvent || LEVEL_COMPLETE, level);

        this.setState(() => ({ levelComplete: true }));
      }
    }

    enemyFree = () => {
      const randomEnemyEntity = arrayRandom(this.state.enemies.map(o => o.entity));

      const controlComponent = this.props.system
        .getEntityComponent<WithRandomWalk>(randomEnemyEntity, 'controls');

      if (controlComponent) {
        controlComponent.state.disabled = false;
      }
    }

    stopAllFreeEnemies = () => {
      this.stopFreeEnemyInterval();

      this.state.enemies.forEach(o => {
        const controlComponent = this.props.system
          .getEntityComponent<WithRandomWalk>(o.entity, 'controls');

        if (controlComponent) {
          controlComponent.state.disabled = true;
        }
      });
    }

    enemyGroup = () => {}

    startFreeEnemyInterval = () => {
      this.interval = setInterval(() => {
        this.props.system.events.emit(ENEMY_FREE);
      }, ENEMY_FREE_INTERVAL);
    }

    stopFreeEnemyInterval = () => {
      clearInterval(this.interval);
    }

    render() {
      const {player, bullet1, bullet2, system} = this.props.state;
      return (
        <Level>

          <ConnectedPlayer entity={player} system={system} />

          <Bullet model={bullet1} system={system} />
          <Bullet model={bullet2} system={system} />

          {this.state.enemies.map((enemy: ILoadedEnemy) => {
            const ConnectedEnemy = enemy.component;
            return (
              <ConnectedEnemy
                key={enemy.entity.id}
                entity={enemy.entity}
                system={system}
              />
            )
          })
        }
        </Level>
      )
    }
  }
}

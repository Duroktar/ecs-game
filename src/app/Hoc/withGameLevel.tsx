import * as React from 'react';
import { ISystemManager } from "../../engine/interfaces/ISystemManager";
import { LevelProps, ILoadedEnemy } from '../Levels/types';
import { Level } from '../Levels/Base';
import { ConnectedPlayer } from '../Containers/Player/Player';
import { Bullet } from '../Containers/Weapons/Bullet';
import { once } from '../../engine/utils';
import { ON_ENEMY_DEATH, ON_LEVEL_COMPLETE, ON_ENEMY_FREE, ON_ENEMY_GROUP, ON_LEVEL_BEGIN } from '../../events';
import { WithRandomWalk } from '../../engine/components/withRandomWalk';

function arrayRandom<T>(items: T[]) {
  return items[Math.floor(Math.random()*items.length)];
}

interface WithGameLevelOptions {
  enemyPositions: number[][];
  levelId:        string | number;
  completeEvent?: string;
}

export const withGameLevel = (
  options: WithGameLevelOptions
): React.ComponentType<LevelProps> => {
  return class LevelHOC extends React.Component<LevelProps, State> {
    private interval: any;

    state = {
      enemyPositions: options.enemyPositions,
      levelId: options.levelId,

      enemies: [] as ILoadedEnemy[],
      enemiesDead: 0,
      ready: false,
    }

    componentDidMount() {
      const {enemyPositions} = this.state;
      const {system, loadLevel} = this.props;

      const enemies = loadLevel(system, enemyPositions);

      this.setState({ enemies, ready: true })

      system.events.registerListener(ON_ENEMY_DEATH, this.countDeath);
      system.events.registerListener(ON_ENEMY_FREE,  this.enemyFree);
      system.events.registerListener(ON_ENEMY_GROUP, this.enemyGroup);
      system.events.registerListener(ON_LEVEL_BEGIN, this.startFreeEnemyInterval);
    }

    componentDidUpdate(nextProps: LevelProps, nextState: State) {
      if (!nextState.ready) {
        return;
      }

      if (nextState.enemiesDead === nextState.enemies.length) {
        this.onLevelComplete(this.props.system, this.state.levelId);
      }
    }

    componentWillUnmount() {
      const {system} = this.props;

      clearInterval(this.interval);

      system.events.unRegisterListener(ON_ENEMY_DEATH, this.countDeath);
      system.events.unRegisterListener(ON_ENEMY_FREE,  this.enemyFree);
      system.events.unRegisterListener(ON_ENEMY_GROUP, this.enemyGroup);
      system.events.unRegisterListener(ON_LEVEL_BEGIN, this.startFreeEnemyInterval);

      this.state.enemies.forEach(o =>
        system.unRegisterEntity(o.entity.id)
      );
    }

    countDeath = () => {
      this.setState(state => ({
        enemiesDead: state.enemiesDead + 1,
      }));
    }

    onLevelComplete = once((system: ISystemManager, level: number | string) => {
      system.events.emit(options.completeEvent || ON_LEVEL_COMPLETE, level);
      clearInterval(this.interval);
    })

    enemyFree = () => {
      const maybeComponent = arrayRandom(this.state.enemies.map(o => o.entity));

      const controlComponent = this.props.system
        .getEntityComponent<WithRandomWalk>(maybeComponent, 'controls');

      if (controlComponent) {
        controlComponent.state.disabled = false;
      }
    }

    enemyGroup = () => {}

    startFreeEnemyInterval = () => {
      this.interval = setInterval(() => {
        this.props.system.events.emit(ON_ENEMY_FREE);
      }, 8000);
    }

    render() {
      const {player, bullet1, bullet2, system} = this.props.state;
      return (
        <Level>

          <ConnectedPlayer entity={player} system={system} />

          <Bullet model={bullet1} />
          <Bullet model={bullet2} />

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

interface State {
  enemies:          ILoadedEnemy[];
  enemyPositions:   number[][];
  enemiesDead:      number;
  levelId:          string | number;
  ready:            boolean;
}

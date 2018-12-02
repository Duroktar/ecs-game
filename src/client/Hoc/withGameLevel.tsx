import * as React from 'react';
import { IEntity, ISystemManager } from '../../lib/types';
import { LevelProps } from '../Levels/types';
import { Level } from '../Levels/Base';
import { Player } from '../Components/Player';
import { Bullet } from '../Components/Bullet';
import { ConnectedEnemy } from '../Components/Enemy';
import { once } from '../../lib/utils';
import { ON_ENEMY_DEATH, ON_LEVEL_COMPLETE } from '../../events';

interface WithGameLevelOptions {
  enemyPositions: number[][];
  levelId:        string | number;
  completeEvent?: string;
}

export const withGameLevel = (
  options: WithGameLevelOptions
): React.ComponentType<LevelProps> => {
  return class LevelHOC extends React.Component<LevelProps, State> {
    state = {
      enemyPositions: options.enemyPositions,
      levelId: options.levelId,
      
      enemies: [] as IEntity[],
      enemiesDead: 0,
      ready: false,
    }
  
    componentDidMount() {
      const {enemyPositions} = this.state;
      const {system, loadLevel} = this.props;
  
      const enemies = loadLevel(system, enemyPositions);
  
      this.setState({ enemies, ready: true })
  
      system.events.registerEvent(ON_ENEMY_DEATH, this.countDeath)
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
      this.props.system.events
        .unRegisterEvent(ON_ENEMY_DEATH, this.countDeath);
      
      this.state.enemies.forEach(o =>
        this.props.system.unRegisterEntity(o.id)
      );
    }
  
    countDeath = () => {
      this.setState(state => ({
        enemiesDead: state.enemiesDead + 1,
      }))
    }
  
    onLevelComplete = once((system: ISystemManager, level: number | string) => {
      system.events.emit(options.completeEvent || ON_LEVEL_COMPLETE, level)
    })
  
    render() {
      const {player, bullet1, bullet2, system} = this.props.state;
      return (
        <Level>
    
          <Player model={player}/>
    
          <Bullet model={bullet1} />
          <Bullet model={bullet2} />
    
          {this.state.enemies.map((entity: IEntity) => (
            <ConnectedEnemy
              key={entity.id}
              entity={entity}
              system={system}
            />
          ))}
        </Level>
      )
    }
  }
}

interface State {
  enemies:          IEntity[];
  enemyPositions:   number[][];
  enemiesDead:      number;
  levelId:          string | number;
  ready:            boolean;
}

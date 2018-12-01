import { IEntity, ISystemManager } from '../../../lib/types';
import { LevelProps } from '../types';
import * as React from 'react';

import { ConnectedEnemy } from '../../Components/Enemy';
import { Player } from '../../Components/Player';
import { Bullet } from '../../Components/Bullet';

import { Level } from '../Base';

import { once } from '../../../lib/utils';
import { ON_LEVEL_COMPLETE, ON_ENEMY_DEATH } from '../../../events';

interface State {
  enemies:          IEntity[];
  enemyPositions:   number[][];
  enemiesDead:      number;
  levelId:          string | number;
  ready:            boolean;
}

export class Level1 extends React.Component<LevelProps, State> {
  state = {
    enemies: [] as IEntity[],
    enemyPositions: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    ],
    enemiesDead: 0,
    ready: false,
    levelId: '1',
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
    system.events.emit(ON_LEVEL_COMPLETE, level)
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

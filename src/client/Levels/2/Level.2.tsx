import { IEntity, ISystemManager } from '../../../lib/types';
import { LevelProps } from '../types';
import * as React from 'react';

import { ConnectedEnemy } from '../../Components/Enemy';
import { Player } from '../../Components/Player';
import { Bullet } from '../../Components/Bullet';

import { Level } from '../Base';

import { once } from '../../../lib/utils';

interface State {
  enemies:          IEntity[];
  enemyPositions:   number[][];
  enemiesDead:      number;
  levelId:          string | number;
  ready:            boolean;
}

export class Level2 extends React.Component<LevelProps, State> {
  state = {
    enemies: [] as IEntity[],
    enemyPositions: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    ],
    enemiesDead: 0,
    ready: false,
    levelId: '2',
  }

  componentDidMount() {
    const {enemyPositions} = this.state;
    const {system, loadLevel} = this.props;

    const enemies = loadLevel(system, enemyPositions);

    this.setState({ enemies, ready: true })

    system.events.registerEvent('isDead:enemy', this.countDeath)
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
      .unRegisterEvent('isDead:enemy', this.countDeath)
  }

  countDeath = () => {
    this.setState(state => ({
      enemiesDead: state.enemiesDead + 1,
    }))
  }

  onLevelComplete = once((system: ISystemManager, level: number | string) => {
    system.events.emit('levelComplete', level)
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

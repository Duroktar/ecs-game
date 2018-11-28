import { IEntity } from '../../../lib/types';
import { LevelProps } from '../types';
import * as React from 'react';

import { ConnectedEnemy } from '../../Components/Enemy';
import { Player } from '../../Components/Player';
import { Bullet } from '../../Components/Bullet';

import { Level } from '../Base';

interface State {
  enemies:          IEntity[];
  enemyPositions:   number[][];
}

export class Demo extends React.Component<LevelProps, State> {
  state = {
    enemies: [] as IEntity[],
    enemyPositions: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    ]
  }

  componentDidMount() {
    const {enemyPositions} = this.state;
    const {system, loadLevel} = this.props;

    const enemies = loadLevel(system, enemyPositions);

    this.setState({ enemies })
  }

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
            onDeath={this.props.onEnemyDeath}
          />
        ))}
      </Level>
    )
  }
}

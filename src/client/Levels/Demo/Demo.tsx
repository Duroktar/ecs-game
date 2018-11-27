import { GameState } from '../../../types';
import * as React from 'react';

import { Player } from '../../Components/Player';
import { Bullet } from '../../Components/Bullet';
import { ConnectedEnemy } from '../../Components/Enemy';

import { Level } from '../Base';
import { IEntity } from '../../../lib/types';
import { loadLevel } from '../Loader';

interface Props {
  state:        GameState;
  onEnemyDeath: (entity: IEntity) => void;
}

interface State {
  enemies:          IEntity[];
  enemyPositions:   number[][];
}

export class Demo extends React.Component<Props, State> {
  state = {
    enemies: [] as IEntity[],
    enemyPositions: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
  }

  componentDidMount() {
    const {enemyPositions} = this.state;
    const enemies = loadLevel(enemyPositions);

    this.setState({ enemies })
  }

  render() {
    return (
      <Level>
  
        <Player model={this.props.state.player}/>
  
        <Bullet model={this.props.state.bullet1} />
        <Bullet model={this.props.state.bullet2} />
  
        {this.state.enemies.map(model => (
          <ConnectedEnemy
            key={model.id}
            entity={model}
            system={this.props.state.system}
            onDeath={this.props.onEnemyDeath}
          />
        ))}
      </Level>
    )
  }
}

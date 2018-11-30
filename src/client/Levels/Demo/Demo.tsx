import { IEntity, AnonymousCB } from '../../../lib/types';
import { LevelProps } from '../types';
import * as React from 'react';

import { ConnectedEnemy } from '../../Components/Enemy';
import { Player } from '../../Components/Player';
import { Bullet } from '../../Components/Bullet';

import { Level } from '../Base';

interface State {
  enemies:          IEntity[];
  enemyPositions:   number[][];
  enemiesDead:      number;
  ready:            boolean;
}

export class Demo extends React.Component<LevelProps, State> {
  state = {
    enemies: [] as IEntity[],
    enemyPositions: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    ],
    enemiesDead: 0,
    ready: false,
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
      this.onLevelComplete(this.props.system);
    }
  }

  componentWillUnmount() {
    this.props.system.events
      .unRegisterEvent('isDead:enemy', this.countDeath)
  }

  countDeath = () => {
    this.setState(state => ({ enemiesDead: state.enemiesDead + 1 }))
  }

  onLevelComplete = once((system) => {
    system.events.emit('levelComplete')
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

function once(fn: AnonymousCB) {
  let called = false;
  return (...args: any[]) => {
    if (!called) {
      called = true;
      return fn(...args);
    }
    return undefined;
  }
}
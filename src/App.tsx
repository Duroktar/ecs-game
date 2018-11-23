import React, { Component } from 'react';
import './App.css';
import { system, player1Entity, mobEntity } from './lib';
import { ISystem } from './lib/types';
import { CharacterModel } from './lib/domain/character';


const pp = (obj: object | null | undefined) => JSON.stringify(obj, null, '  ')

interface State {
  epoch: number | null;
  world: ISystem | null;
}

class App extends Component<{}, State> {
  private handler: any;

  state = { epoch: null, world: null }

  componentDidMount() {
    this.setState({ world: system.getState(), epoch: 1 });
  }

  componentWillUnmount() {
    this.stop();
    delete this.handler;
  }

  tick = () => {
    const world = system.step();

    this.setState(state => {
      const { epoch } = state;
      return { world, epoch: epoch ? epoch + 1 : 1 }
    });
  }

  start = () => {
    this.handler = requestAnimationFrame(this.start);
    this.tick();
  }

  stop = () => {
    if (this.handler) { cancelAnimationFrame(this.handler); }
  }

  render() {
    const { epoch } = this.state;
    const player1Model = system.getModelForEntity<CharacterModel>(player1Entity);
    const mobModel = system.getModelForEntity<CharacterModel>(mobEntity);
    return (
      <div className="App">
        Epoch: {epoch}
        {/* <pre>{pp(world)}</pre> */}
        <pre>{pp(player1Model)}</pre>
        <pre>{pp(mobModel)}</pre>
        <button onClick={this.start}>Start</button>
        <button onClick={this.stop}>Stop</button>
        <button onClick={this.tick}>Evolve</button>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import { system, player1Entity, mobEntity, saveGame, loadGame } from './lib';
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
    this.moUntWOrld();
  }

  componentWillUnmount() {
    this.stop();
    delete this.handler;
  }

  moUntWOrld = () => {
    const world = system.getState();
    this.setState({ world, epoch: system.epoch });
  }

  tick = () => {
    const world = system.step();

    this.setState(state => {
      return { world, epoch: system.epoch }
    });
  }

  start = () => {
    this.handler = requestAnimationFrame(this.start);
    this.tick();
  }

  stop = () => {
    if (this.handler) { cancelAnimationFrame(this.handler); }
  }

  save = () => {
    saveGame()
  }

  load = () => {
    loadGame()
    this.moUntWOrld();
  }

  render() {
    const { epoch, world } = this.state;
    return (
      <div className="App">
        Epoch: {epoch}
        {/* <pre>{pp(world)}</pre> */}
        {system.system.entities.map(entity => <pre key={entity.id}>{pp(system.getEntityModel(entity))}</pre>)}
        <button onClick={this.start}>Start</button>
        <button onClick={this.stop}>Stop</button>
        <button onClick={this.tick}>Evolve</button>
        <button onClick={this.save}>Save</button>
        <button onClick={this.load}>Load</button>
      </div>
    );
  }
}

export default App;

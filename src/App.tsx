import React, { Component } from 'react';
import './App.css';
import { system, storage } from './lib';
import { IEntity, ISystemManager } from './lib/types';

const pp = (obj: object | null | undefined) => JSON.stringify(obj, null, '  ')

interface State {
  epoch: number | null;
}

class App extends Component<{}, State> {
  private handler: any;

  state = { epoch: null }

  componentDidMount() {
    this.moUntWOrld();
  }

  componentWillUnmount() {
    this.stop();
    delete this.handler;
  }

  moUntWOrld = () => this.setState({ epoch: system.epoch });

  tick = () => {
    system.step();

    this.setState(_ => ({ epoch: system.epoch }));
  }

  start = () => {
    this.handler = requestAnimationFrame(this.start);
    this.tick();
  }

  stop = () => {
    if (this.handler) { cancelAnimationFrame(this.handler); }
  }

  save = () => {
    system.storage.saveGame();
  }

  load = () => {
    system.storage.loadGame();

    this.moUntWOrld();
  }

  render() {
    return (
      <div className="App">
        Epoch: {this.state.epoch}
        <EntityList system={system} />

        <pre>{pp(system.getState())}</pre>
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

function entityRenderer(entity: IEntity, system: ISystemManager): JSX.Element {
  return <pre key={entity.id}>{pp(system.getEntityModel(entity))}</pre>;
}

function EntityList(props: EntityListProps): JSX.Element {
  const { system } = props;
  return (<>
    {system.system.entities.map((o: any) => entityRenderer(o, system))}
  </>)
}

type EntityListProps = { system: ISystemManager };

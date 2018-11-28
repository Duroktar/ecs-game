import * as React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.style.css';

import { DevScreen } from './client/Development/Dev';
import { Intro } from './client/Screens/Intro';
import { Menu } from './client/Screens/Menu';
import { Game } from './client/Screens/Game';

import { CharacterModel } from './game/Domain/character';
import { ProjectileModel } from './game/Domain/projectile';
import { system } from './game';
import { createPlayer } from './game/factories/player';
import { createBullet } from './game/factories/bullet';

interface State {
  epoch:    number;
  player:   CharacterModel;
  bullet1:  ProjectileModel;
  bullet2:  ProjectileModel;
}

class App extends React.Component<{}, State> {
  private handler: any;

  private player = createPlayer(system, 'Odin');
  private bullet1 = createBullet(system, 'Bullet of Destiny');
  private bullet2 = createBullet(system, 'Bullet of Greater Truth');

  state = {
    epoch:   system.epoch,
    player:  system.getEntityModel<CharacterModel>(this.player),
    bullet1: system.getEntityModel<ProjectileModel>(this.bullet1),
    bullet2: system.getEntityModel<ProjectileModel>(this.bullet2),
  }

  componentDidMount() {
    this.moUntWOrld();

    this.start();
  }

  componentWillUnmount() {
    this.stop();

    delete this.handler;
  }

  moUntWOrld = () => {
    this.setState(state => ({
      ...state,
      epoch: system.epoch,
    }));
  }

  tick = () => {
    system.step();

    this.setState(_ => ({
      epoch:   system.epoch,
      player:  system.getEntityModel(this.player),
      bullet1: system.getEntityModel<ProjectileModel>(this.bullet1),
      bullet2: system.getEntityModel<ProjectileModel>(this.bullet2),
    }));
  }

  start = () => {
    this.stop();

    this.handler = requestAnimationFrame(this.start);

    this.tick();
  }

  stop = () => {
    if (this.handler) {
      cancelAnimationFrame(this.handler);
    }
  }

  save = () => {
    system.storage.saveGame();
  }

  load = () => {
    this.stop();

    system.storage.loadGame();

    this.moUntWOrld();

    this.start();
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Intro} />
          <Route path="/menu" component={Menu} />
          <Route path="/game" render={(props) => {
            return (
              <Game
                system={system}
                {...this.state}
                {...props}
              />
            )
          }} />

          <DevScreen
            system={system}
            onStart={this.start}
            onStop={this.stop}
            onTick={this.tick}
            onSave={this.save}
            onLoad={this.load}
          />
        </div>
      </Router>
    );
  }
}

export default App;

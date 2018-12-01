import * as React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.style.css';

import { DevScreen } from './client/Development/Dev';
import { Intro } from './client/Containers/Intro';
import { Menu } from './client/Containers/Menu';
import { Game } from './client/Containers/Game';

import { CharacterModel } from './game/Domain/character';
import { ProjectileModel } from './game/Domain/projectile';
import { system } from './game';
import { createPlayer } from './game/factories/player';
import { createBullet } from './game/factories/bullet';
import { ON_START_GAME } from './events';
import { Outro } from './client/Containers/Outro';

interface State {
  epoch:    number;
  player:   CharacterModel;
  bullet1:  ProjectileModel;
  bullet2:  ProjectileModel;
}

class App extends React.Component<{}, State> {
  private handler: any;

  private player  = createPlayer(system, 'Odin');
  private bullet1 = createBullet(system, 'Bullet of Destiny');
  private bullet2 = createBullet(system, 'Bullet of Greater Truth');

  state = {
    epoch:   system.epoch,
    player:  system.getEntityModel<CharacterModel>(this.player),
    bullet1: system.getEntityModel<ProjectileModel>(this.bullet1),
    bullet2: system.getEntityModel<ProjectileModel>(this.bullet2),
  }

  componentDidMount() {
    system.events.registerEvent(ON_START_GAME, this.startNewGame)
    this.moUntWOrld();

    this.start();
  }

  componentWillUnmount() {
    system.events.unRegisterEvent(ON_START_GAME, this.startNewGame)
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

  startNewGame = () => {
    window.location.assign('/game')
  }

  start = () => {
    this.stop();

    this._update();
  }

  _update = () => {
    this.handler = requestAnimationFrame(this._update);

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

  restart = () => {
    window.location.reload();
  }

  render() {
    return (
      <Router>
        <div className="App container with-title is-center is-dark">
          <label className="title">Galaga.ts</label>
          <Route exact path="/" component={Intro} />
          <Route path="/menu" render={(props) => {
            return (
              <Menu
                system={system}
                {...this.state}
                {...props}
              />
            )
          }} />
          <Route path="/game" render={(props) => {
            return (
              <Game
                system={system}
                restart={this.restart}
                {...this.state}
                {...props}
              />
            )
          }} />
          <Route path="/end" render={(props) => {
            return (
              <Outro
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

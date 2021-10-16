import * as React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './styles/App.style.css';
import './styles/FontGlow.style.css';

import { DevScreen } from './Development/Dev';

import { Intro } from './Containers/Intro';
import { Menu } from './Containers/Menu';
import { Game } from './Containers/Game';
import { Outro } from './Containers/Outro';

import { CharacterModel } from '../game/Domain/character';
import { ProjectileModel } from '../game/Domain/projectile';

import { createPlayer } from '../game/factories/player';
import { createBullet } from '../game/factories/bullet';

import { system } from '../game';

import { ON_START_GAME, ON_START_ENGINE, ON_STOP_ENGINE } from '../events';
import { keys } from '../engine/utils';
import { SfxLibrary, SongLibrary } from '../game/catalogue';

interface State {
  epoch:    number;
  player:   CharacterModel;
  bullet1:  ProjectileModel;
  bullet2:  ProjectileModel;
}

class App extends React.PureComponent<{}, State> {
  private handler: number | undefined;

  private player  = createPlayer(system, 'Odin');
  private bullet1 = createBullet(system, 'Bullet of Destiny');
  private bullet2 = createBullet(system, 'Bullet of Greater Truth');

  constructor(props: {}) {
    super(props);

    this.gameAudioInitialize();

    system.events.registerEvent(ON_START_GAME,    this.startNewGame);
    system.events.registerEvent(ON_START_ENGINE,  this.start);
    system.events.registerEvent(ON_STOP_ENGINE,   this.stop);
  }

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
    this.gameAudioCleanup();

    system.events.unRegisterEvent(ON_START_GAME,  this.startNewGame)
    system.events.registerEvent(ON_START_ENGINE,  this.start);
    system.events.registerEvent(ON_STOP_ENGINE,   this.stop);

    this.stop();

    delete this.handler;
  }

  gameAudioInitialize = () => {

    keys(SongLibrary).forEach((key: string | number) => {
      system.audio.registerSong(`${key}`, { ...SongLibrary[key], volume: 0.6 })
    });

    keys(SfxLibrary).forEach((key: string | number) => {
      system.audio.registerSound(`${key}`, { ...SfxLibrary[key], volume: 0.3 })
    });
  }

  gameAudioCleanup = () => {

    keys(SongLibrary).forEach((key: string | number) => {
      system.audio.unRegisterSong(`${key}`)
    });
    
    keys(SfxLibrary).forEach((key: string | number) => {
      system.audio.unRegisterSound(`${key}`)
    });
  }

  moUntWOrld = () => {
    this.setState({ epoch: system.epoch });
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
    if (this.handler) cancelAnimationFrame(this.handler);
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
    window.location.assign('/menu');
  }

  render() {
    return (
      <Router>
        <div className="App container with-title is-center is-dark">
          <label className="title">Galaga.ts</label>

          <Route exact path="/" render={(props) =>
            <Intro
              onPlayerInput={this.startNewGame}
              {...this.state}
              {...props}
            />
          } />

          <Route path="/menu" render={(props) =>
            <Menu
              system={system}
              {...this.state}
              {...props}
            />
          } />

          <Route path="/game" render={(props) =>
            <Game
              system={system}
              onRestart={this.restart}
              {...this.state}
              {...props}
            />
          } />

          <Route path="/end" render={(props) =>
            <Outro
              system={system}
              {...this.state}
              {...props}
            />
          } />

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

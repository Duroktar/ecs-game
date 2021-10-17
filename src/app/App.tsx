import * as React from 'react';
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

import { ON_START_GAME, ON_START_ENGINE, ON_STOP_ENGINE } from '../events';
import { keys } from '../engine/utils';
import { SfxLibrary, SongLibrary } from '../game/catalogue';
import { ICurrentGameState, IGameState } from '../game/types';
import { Screens } from './Screens';
import { ISystemManager } from '../engine/interfaces/ISystemManager';
import { IEntity } from '../engine/types';

interface Props {
  system: ISystemManager
}

class App extends React.PureComponent<Props, IGameState> {
  private handler: number | undefined;
  private system: ISystemManager;

  private player:  IEntity
  private bullet1: IEntity
  private bullet2: IEntity

  constructor(props: Props) {
    super(props);

    const { system } = props;
    this.system  = system;

    this.player  = createPlayer(system, 'Odin');
    this.bullet1 = createBullet(system, 'Bullet of Destiny');
    this.bullet2 = createBullet(system, 'Bullet of Greater Truth');

    this.state = {
      epoch:   system.epoch,
      player:  system.getEntityModel<CharacterModel>(this.player),
      bullet1: system.getEntityModel<ProjectileModel>(this.bullet1),
      bullet2: system.getEntityModel<ProjectileModel>(this.bullet2),
      final:   undefined,
      screen:  'intro' as Screens,
      system,
    }

    this.gameAudioInitialize();

    system.events.registerListener(ON_START_GAME,    this.startNewGame);
    system.events.registerListener(ON_START_ENGINE,  this.start);
    system.events.registerListener(ON_STOP_ENGINE,   this.stop);
  }

  componentDidMount() {
    this.moUntWOrld();

    this.start();
  }

  componentWillUnmount() {
    this.gameAudioCleanup();

    this.system.events.unRegisterListener(ON_START_GAME,    this.startNewGame)
    this.system.events.unRegisterListener(ON_START_ENGINE,  this.start);
    this.system.events.unRegisterListener(ON_STOP_ENGINE,   this.stop);

    this.stop();

    delete this.handler;
  }

  gameAudioInitialize = () => {

    keys(SongLibrary).forEach((key: string | number) => {
      this.system.audio.registerSong(`${key}`, { ...SongLibrary[key], volume: 0.6 })
    });

    keys(SfxLibrary).forEach((key: string | number) => {
      this.system.audio.registerSound(`${key}`, { ...SfxLibrary[key], volume: 0.3 })
    });
  }

  gameAudioCleanup = () => {

    keys(SongLibrary).forEach((key: string | number) => {
      this.system.audio.unRegisterSong(`${key}`)
    });

    keys(SfxLibrary).forEach((key: string | number) => {
      this.system.audio.unRegisterSound(`${key}`)
    });
  }

  moUntWOrld = () => {
    this.setState({ epoch: this.system.epoch });
  }

  tick = () => {
    this.system.step();

    this.setState(_ => ({
      epoch:   this.system.epoch,
      player:  this.system.getEntityModel(this.player),
      bullet1: this.system.getEntityModel<ProjectileModel>(this.bullet1),
      bullet2: this.system.getEntityModel<ProjectileModel>(this.bullet2),
    }));
  }

  startNewGame = () => {
    this.gotoScreen('game')
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
    this.system.storage.saveGame();
  }

  load = () => {
    this.stop();

    this.system.storage.loadGame();

    this.moUntWOrld();

    this.start();
  }

  restart = () => {
    this.gotoScreen('menu');
  }

  gotoScreen = (screen: Screens) => {
    this.setState({ screen});
  }

  setFinalScore = (score: ICurrentGameState) => {
    this.setState(state => ({ ...state, final: score }));
  }

  render() {
    return (
      <div className="App container with-title is-center is-dark">
        <label className="title">Galaga.ts</label>

        {this.state.screen === 'intro'
          ? <Intro
              onPlayerInput={this.startNewGame}
              nav={this.gotoScreen}
              {...this.state}
            />
          : null
        }
        {this.state.screen === 'menu'
          ? <Menu
              system={this.system}
              {...this.state}
            />
          : null
        }
        {this.state.screen === 'game'
          ? <Game
              system={this.system}
              onRestart={this.restart}
              onFinalScore={this.setFinalScore}
              nav={this.gotoScreen}
              {...this.state}
            />
          : null
        }
        {this.state.screen === 'end'
          ? <Outro
              system={this.system}
              nav={this.gotoScreen}

              {...this.state}
            />
          : null
        }

        <DevScreen
          system={this.system}
          onStart={this.start}
          onStop={this.stop}
          onTick={this.tick}
          onSave={this.save}
          onLoad={this.load}
          nav={this.gotoScreen}
        />
      </div>
    );
  }
}

export default App;

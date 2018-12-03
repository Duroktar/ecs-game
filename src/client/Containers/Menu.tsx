import { IGameState } from '../../game/types';
import * as React from 'react';
import {useEffect, useState} from 'react';

import { Gui } from '../Layouts/Gui';
import StarFieldLogo from '../Backgrounds/NewGame';

import { withEnterKeyEffect } from '../hooks/withEnterKeyEffect';
import { ON_START_GAME } from '../../events';

import { classNames } from '../Development/Dev';
import { Songs, Sfx } from '../../game/catalogue';


export function Menu(props: IGameState) {
  const [ready, setReady] = useState(false);

  function handleStartGame() {
    props.system.events.emit(ON_START_GAME);
  }

  useEffect(() => {
    setTimeout(() => setReady(true), 3000);
  });

  useEffect(() => {
    props.system.audio.playSong(Songs.MENU);
  }, []);

  withEnterKeyEffect(() => {
    props.system.audio.stopSong(Songs.MENU);

    setTimeout(() => {
      props.system.audio.playSound(Sfx.LEVEL_WIN);
    }, 750);

    setTimeout(() => {
      handleStartGame();
    }, 2000);
  }
  );

  return (
    <Gui
      id="gui"
      className="menu"
      score={0}
      credits={0}
      lives={0}
      background={<StarFieldLogo />}
      onRestart={handleStartGame}
    >
      <div className="screen menu">
        <div id="press-enter" className="center-content">
          <p className={classNames(!ready && 'hidden', 'fade-in', 'neon', 'retro-red')} onMouseUp={handleStartGame}>
            <span>Press Enter</span>
          </p>
        </div>
      </div>
      <div className="overlay">AV-1</div>
    </Gui>
  )
}

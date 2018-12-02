import { IGameState } from '../../game/types';
import * as React from 'react';
import {useEffect, useState} from 'react';

import { Gui } from '../Layouts/Gui';
import StarFieldLogo from '../Backgrounds/NewGame';

import { classNames } from '../Development/Dev';
import { withEnterKeyEffect } from '../hooks/withEnterKeyEffect';
import { ON_START_GAME } from '../../events';


export function Menu(props: IGameState) {
  const [ready, setReady] = useState(false);

  function handleStartGame() {
    props.system.events.emit(ON_START_GAME);
  }

  useEffect(() => {
    setTimeout(() => setReady(true), 3000);
  });

  withEnterKeyEffect(() =>
    handleStartGame()
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
          <p className={classNames(!ready && 'hidden', 'fade-in')}>Press Enter</p>
        </div>
      </div>
    </Gui>
  )
}

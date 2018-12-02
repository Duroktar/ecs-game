import { IGameState } from '../../game/types';
import * as React from 'react';
import {useEffect, useState} from 'react';

import { Gui } from '../Layouts/Gui';
import GameOver from '../Backgrounds/GameOver';

import { classNames } from '../Development/Dev';
import { withEnterKeyEffect } from '../hooks/withEnterKeyEffect';


export function Outro(props: IGameState) {
  const [ready, setReady] = useState(false);

  function handleStartNewGame() {
    window.location.assign('/game');
  }

  function handleRestartGame() {
    window.location.assign('/menu');
  }

  useEffect(() => {
    setTimeout(() => setReady(true), 3000)
  });

  withEnterKeyEffect(() => {
    handleStartNewGame();
  })

  return (
    <Gui
      id="gui"
      className="gameover"
      score={0}
      credits={0}
      lives={0}
      background={<GameOver />}
      onRestart={handleRestartGame}
    >
      <div className="screen menu">
        <div id="press-enter" className="center-content">
          <p className={classNames(!ready && 'hidden', 'fade-in')}>
            Press Enter to Play Again
          </p>
        </div>
      </div>
    </Gui>
  )
}

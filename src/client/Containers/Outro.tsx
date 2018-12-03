import { IGameState } from '../../game/types';
import * as React from 'react';
import {useEffect, useState} from 'react';

import { Gui } from '../Layouts/Gui';
import GameOver from '../Backgrounds/GameOver';

import { classNames } from '../Development/Dev';
import { withEnterKeyEffect } from '../hooks/withEnterKeyEffect';
import { Songs } from '../../game/catalogue';
import { once } from '../../engine/utils';

interface FinalScore {
  score:    number;
  hits:     number;
  shots:    number;
  lives:    number;
  credits:  number;
}

export function Outro(props: IGameState) {
  const [ready, setReady] = useState(false);
  const [final, setFinalScore] = useState<FinalScore>({} as FinalScore);

  function handleStartNewGame() {
    window.location.assign('/game');
  }

  function handleRestartGame() {
    window.location.assign('/menu');
  }

  useEffect(() => {
    props.system.audio.playSong(Songs.END);
    return () => {
      props.system.audio.stopSong(Songs.END);
    }
  }, []);

  useEffect(() => {
    const serialized = getQueryParams(window.location.search);

    if (serialized && typeof serialized.final === 'string') {
      try {
        setFinalScore(JSON.parse(serialized.final));
      } catch (e) {
        // meh
      }
    }

    setTimeout(() => setReady(true), 3000);
  });

  withEnterKeyEffect(once(handleStartNewGame));

  return (
    <Gui
      id="gui"
      className="gameover"
      score={final.score}
      credits={final.credits}
      lives={final.lives}
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

function getQueryParams(qs: string) {
  const searchString = qs.split('+').join(' ');

  let params: any = {};
  let tokens: RegExpExecArray | null;
  const re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(searchString)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}

import { IGameState } from '../../game/types';
import * as React from 'react';
import {useEffect, useState} from 'react';

import { Gui } from '../Layouts/Gui';
import GameOver from '../Backgrounds/GameOver';

import { classNames } from '../Development/Dev';
import { withEnterKeyEffect } from '../hooks/withEnterKeyEffect';
import { Songs } from '../../game/catalogue';
import { once } from '../../engine/utils';
import { Screens } from '../Screens';

interface FinalScore {
  score:    number;
  hits:     number;
  shots:    number;
  lives:    number;
  credits:  number;
}

type Props = {
  nav:    (screen: Screens) => void;
  final?: FinalScore
}
export function Outro(props: Props & IGameState) {
  const [ready, setReady] = useState(false);
  const [final, setFinalScore] = useState<FinalScore>({} as FinalScore);

  function handleStartNewGame() {
    props.nav('game');
  }
  
  function handleRestartGame() {
    props.nav('menu');
  }

  useEffect(() => {
    props.system.audio.playSong(Songs.END);
    return () => {
      props.system.audio.stopSong(Songs.END);
    }
  }, []);

  useEffect(() => {
    if (props.final) {
      try {
        setFinalScore(props.final);
      } catch (e) {
        // meh
      }
    }

    const timer = setTimeout(() => setReady(true), 3000);

    return () => {
      clearTimeout(timer)
    }
  }, []);

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

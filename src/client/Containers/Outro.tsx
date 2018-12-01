import * as React from 'react';
import {useEffect, useState} from 'react';

import { Gui } from '../Layouts/Gui';
import { classNames } from '../Development/Dev';
import { IGameState } from '../../game/types';
import { Keyboard } from '../../extern/Keyboard';
import { ISystemManager } from '../../lib/types';
import { ON_START_GAME } from '../../events';
import GameOver from '../Backgrounds/GameOver';
import { withEnterKeyEffect } from '../hooks/withEnterKeyEffect';

interface ScreenProps {
  id:       string | number;
  system:   ISystemManager;
}

function Screen(props: ScreenProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 3000)
  });

  withEnterKeyEffect(() => {
    window.location.assign('/game');
  })

  return (
    <div className="screen menu">
      <div id="press-enter" className="center-content">
        <p className={classNames(!ready && 'hidden', 'fade-in')}>Press Enter to Play Again</p>
      </div>
    </div>
  )
}

interface Props extends IGameState {
}

export function Outro(props: Props) {
  return (
    <Gui
      id="gui"
      className="gameover"
      score={0}
      credits={0}
      lives={0}
      background={<GameOver />}
    >
      <Screen id={0} system={props.system} />
    </Gui>
  )
}

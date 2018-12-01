import * as React from 'react';
import {useEffect, useState} from 'react';

import { Gui } from '../Layouts/Gui';
import StarFieldLogo from '../Backgrounds/StarFieldLogo';
import { classNames } from '../Development/Dev';
import { IGameState } from '../../game/types';
import { Keyboard } from '../../extern/Keyboard';
import { ISystemManager } from '../../lib/types';
import { ON_START_GAME } from '../../events';

interface ScreenProps {
  id:       string | number;
  system:   ISystemManager;
}

function Screen(props: ScreenProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 3000)
  });

  useEffect(() => {
    const enterKeyHandler = (e: KeyboardEvent) => {
      if (e.keyCode === Keyboard.ENTER) {
        props.system.events.emit(ON_START_GAME);
      }
    }

    document.addEventListener('keypress', enterKeyHandler)
  });

  return (
    <div className="screen menu">
      <div id="press-enter" className="center-content">
        <p className={classNames(!ready && 'hidden', 'fade-in')}>Press Enter</p>
      </div>
    </div>
  )
}

interface Props extends IGameState {
}

export function Menu(props: Props) {
  return (
    <Gui
      id="gui"
      className="menu"
      score={0}
      credits={0}
      lives={0}
      background={<StarFieldLogo />}
    >
      <Screen id={0} system={props.system} />
    </Gui>
  )
}

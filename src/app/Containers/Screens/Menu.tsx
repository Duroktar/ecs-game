import { IGameState } from '../../../game/types';
import * as React from 'react';
import {useEffect, useState} from 'react';

import { Gui } from '../../Layouts/Gui';
import StarFieldLogo from '../../Backgrounds/NewGame';
import { GlowingText } from '../../Components/GlowingText';

import { withEnterKeyEffect } from '../../hooks/withEnterKeyEffect';
import { START_GAME } from '../../../events';

import { Songs, Sfx } from '../../../game/catalogue';
import { once } from '../../../engine/utils';
import { keyframes } from '../../utils/keyframes';
import { ISystemManager } from '../../../engine/interfaces/ISystemManager';

type Props = {
  system: ISystemManager
}

export function Menu(props: Props) {
  const [ready, setReady] = useState(false);

  const handleStartGame = React.useCallback(() => {
    keyframes(
      [() => props.system.audio.playSound(Sfx.LEVEL_WIN), 750],
      [() => props.system.events.emit(START_GAME), 2000],
    )
  }, [props.system])

  useEffect(() => {
    props.system.audio.playSong(Songs.MENU);

    setTimeout(() => setReady(true), 3000);

    return () => {
      props.system.audio.stopSong(Songs.MENU);
    }
  }, []);

  withEnterKeyEffect(once(handleStartGame));

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
          <GlowingText hidden={!ready} onClick={handleStartGame}>
            Press Enter
          </GlowingText>
        </div>
      </div>
      <div className="overlay">AV-1</div>
    </Gui>
  )
}

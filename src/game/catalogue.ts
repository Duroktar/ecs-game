import MenuMusic from '../audio/Music/game-menu.mp3'
import MainMusic from '../audio/Music/game-main.mp3'
import EndMusic from '../audio/Music/game-end.mp3'
import SummaryMusic from '../audio/Music/game-main-summary.mp3'

import GameOverSound from '../audio/General Sounds/Fanfares/sfx_sounds_fanfare1.wav'
import YouWinSound from '../audio/General Sounds/Positive Sounds/sfx_sounds_powerup3.wav'
import LevelWinSound from '../audio/General Sounds/Fanfares/sfx_sounds_fanfare3.wav'
import NextLevelSound from '../audio/General Sounds/Positive Sounds/sfx_sounds_powerup2.wav'
import NewGameSound from '../audio/General Sounds/Interactions/sfx_sounds_interaction1.wav'
import PauseGameSound from '../audio/General Sounds/Pause Sounds/sfx_sounds_pause1_in.wav'
import UnPauseGameSound from '../audio/General Sounds/Pause Sounds/sfx_sounds_pause1_out.wav'
import { Omit } from 'react-router';


export const mkAudioSrc = (src: string, opts?: Omit<IHowlProperties, 'src'>) => ({ src: [src], ...opts });

export enum SpriteTextureIds {
  Player          = 0,
  Bug             = 1,
  CrabBug         = 2,
  HelmetBug       = 3,
  PincerBug       = 4,
  SonicBug        = 5,
}

export const Sfx = {
  NEW_GAME:     'newgame',
  GAMEOVER:     'gameover',
  YOU_WIN:      'youwin',
  LEVEL_WIN:    'levelwin',
  PAUSE:        'pause',
  UNPAUSE:      'unpause',
  NEXT_LEVEL:   'nextlevel',
}

export const Songs = {
  MENU:     'game-menu',
  GAME:     'game-main',
  END:      'game-end',
  SUMMARY:  'game-main-summary',
}

export const SongLibrary = {
  [Songs.MENU]:     mkAudioSrc(MenuMusic,     { volume: 0.8 }),
  [Songs.GAME]:     mkAudioSrc(MainMusic,     { volume: 0.4 }),
  [Songs.END]:      mkAudioSrc(EndMusic,      { volume: 0.8 }),
  [Songs.SUMMARY]:  mkAudioSrc(SummaryMusic,  { volume: 0.8 }),
}

export const SfxLibrary = {
  [Sfx.GAMEOVER]:    mkAudioSrc(GameOverSound),
  [Sfx.LEVEL_WIN]:   mkAudioSrc(LevelWinSound),
  [Sfx.NEXT_LEVEL]:  mkAudioSrc(NextLevelSound),
  [Sfx.YOU_WIN]:     mkAudioSrc(YouWinSound),
  [Sfx.NEW_GAME]:    mkAudioSrc(NewGameSound),
  [Sfx.PAUSE]:       mkAudioSrc(PauseGameSound),
  [Sfx.UNPAUSE]:     mkAudioSrc(UnPauseGameSound),
}

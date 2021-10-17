import { CharacterModel } from '../../../game/Domain/character';

import { withEntityModel } from '../../Hoc/withEntityModel';
import { withSpriteEffects } from '../../Hoc/withSpriteEffects';
import { fr } from '../../hooks/withAnimationState';

import ShootSound from '../../../audio/Weapons/Cannon/sfx_wpn_cannon1.wav';
import DeathSound from '../../../audio/Explosions/Long/sfx_exp_long1.wav';
import { PLAYER_DEATH } from '../../../events';

export const AnimatedPlayer = withSpriteEffects<CharacterModel>({
  elementId: 'player',

  currentState: 'normal',

  animations: {
    normal: [
      fr(require('../../../assets/player/ship.png'), 0)
    ],
    death: [
      fr(require('../../../assets/player/explosion-1/explosion-1-01.png'), 0),
      fr(require('../../../assets/player/explosion-1/explosion-1-02.png'), 100),
      fr(require('../../../assets/player/explosion-1/explosion-1-03.png'), 100),
      fr(require('../../../assets/player/explosion-1/explosion-1-04.png'), 100),
      fr(require('../../../assets/player/explosion-1/explosion-1-05.png'), 75),
    ],
  },

  sounds: {
    shoot: ShootSound,
    death: DeathSound,
  },

  deathEvent: PLAYER_DEATH,
});

export const ConnectedPlayer = withEntityModel<CharacterModel>(AnimatedPlayer)

import { MobModel } from '../../../game/Domain/mob';

import { withSpriteEffects } from '../../Hoc/withSpriteEffects';
import { fr } from '../../hooks/withAnimationState';

import ShootSound from '../../../audio/Weapons/Lasers/sfx_wpn_laser1.wav';
import DeathSound from '../../../audio/Explosions/Short/sfx_exp_short_soft5.wav';
import { ON_ENEMY_DEATH } from '../../../events';

export const AnimatedBug = withSpriteEffects<MobModel>({
  elementId: 'enemy',
  animations: {
    normal: [
      fr(require('../../../assets/enemy/enemy-ship.png'), 0)
    ],
    death: [
      fr(require('../../../assets/enemy/enemy-explosion-00.png'), 0),
      fr(require('../../../assets/enemy/enemy-explosion-01.png'), 100),
      fr(require('../../../assets/enemy/enemy-explosion-02.png'), 100),
      fr(require('../../../assets/enemy/enemy-explosion-03.png'), 100),
      fr(require('../../../assets/enemy/enemy-explosion-04.png'), 100),
      fr(require('../../../assets/enemy/enemy-explosion-05.png'), 75),
    ],
  },
  sounds: {
    shoot: ShootSound,
    death: DeathSound,
  },
  currentState: 'normal',
  deathEvent: ON_ENEMY_DEATH,
});

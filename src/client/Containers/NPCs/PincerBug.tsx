import { MobModel } from '../../../game/Domain/mob';

import { withSpriteEffects } from '../../Hoc/withSpriteEffects';
import { fr } from '../../hooks/withAnimationState';

import ShootSound from '../../../audio/Weapons/Lasers/sfx_wpn_laser1.wav';
import DeathSound from '../../../audio/Explosions/Odd/sfx_exp_odd1.wav';

export const AnimatedPincerBug = withSpriteEffects<MobModel>({
  elementId: 'enemy',
  animations: {
    normal: [
      fr(require('../../../assets/pincer-bug/pincer-bug-ship.png'), 0)
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
  collisionGroup: 'enemy',
});

import { MobModel } from '../../../game/Domain/mob';

import { withEntity } from '../../Hoc/withEntity';
import { withSpriteAnimations } from '../../Hoc/withSpriteAnimations';
import { fr } from '../../hooks/withAnimationState';

import ShipSprite from '../../../assets/crab-bug/crab-bug-ship.png';

import Explosion0 from '../../../assets/enemy/enemy-explosion-00.png';
import Explosion1 from '../../../assets/enemy/enemy-explosion-01.png';
import Explosion2 from '../../../assets/enemy/enemy-explosion-02.png';
import Explosion3 from '../../../assets/enemy/enemy-explosion-03.png';
import Explosion4 from '../../../assets/enemy/enemy-explosion-04.png';
import Explosion5 from '../../../assets/enemy/enemy-explosion-05.png';


export const AnimatedCrabBug = withSpriteAnimations<MobModel>({
  elementId: 'enemy',
  animations: {
    normal: [
      fr(ShipSprite, 0)
    ],
    death: [
      fr(Explosion0, 0),
      fr(Explosion1, 100),
      fr(Explosion2, 100),
      fr(Explosion3, 100),
      fr(Explosion4, 100),
      fr(Explosion5, 75),
    ],
  },
  currentAnimation: 'normal',
});

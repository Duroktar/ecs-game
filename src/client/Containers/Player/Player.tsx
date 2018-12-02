import { CharacterModel } from '../../../game/Domain/character';

import { withEntity } from '../../Hoc/withEntity';
import { withSpriteAnimations } from '../../Hoc/withSpriteAnimations';
import { fr } from '../../hooks/withAnimationState';

import ShipSprite from '../../../assets/player/ship.png';

import Explosion1 from '../../../assets/player/explosion-1/explosion-1-01.png';
import Explosion2 from '../../../assets/player/explosion-1/explosion-1-02.png';
import Explosion3 from '../../../assets/player/explosion-1/explosion-1-03.png';
import Explosion4 from '../../../assets/player/explosion-1/explosion-1-04.png';
import Explosion5 from '../../../assets/player/explosion-1/explosion-1-05.png';


export const AnimatedPlayer = withSpriteAnimations<CharacterModel>({
  elementId: 'player',
  animations: {
    normal: [
      fr(ShipSprite, 0)
    ],
    death: [
      fr(Explosion1, 0),
      fr(Explosion2, 100),
      fr(Explosion3, 100),
      fr(Explosion4, 100),
      fr(Explosion5, 75),
    ],
  },
  currentAnimation: 'normal',
});

export const ConnectedPlayer = withEntity<CharacterModel>(AnimatedPlayer)

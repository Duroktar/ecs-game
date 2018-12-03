import { IModelType } from './withEntity';
import * as React from 'react';
import { Omit } from 'react-router';

import { CharacterModel } from '../../game/Domain/character';
import { MobModel } from '../../game/Domain/mob';

import { withAnimationState, WithAnimationOptions } from '../hooks/withAnimationState';
import { withSoundEffects } from '../hooks/withSoundEffects';
import { IAudioCollectionInitializer } from '../../engine/types';


interface WithSpriteEffectsOptions extends WithAnimationOptions {
  elementId:          string;
  sounds:             IAudioCollectionInitializer;
}

type HOCModelType = MobModel | CharacterModel;

type ISpriteState = 'normal' | 'death';

export function withSpriteEffects<T extends HOCModelType>(
  options: Omit<WithSpriteEffectsOptions, 'onFinished'>
): React.ComponentType<IModelType<T>> {
  return function WithSpriteEffectsHOC(props: IModelType<T>) {
    const [hidden, setHidden] = React.useState(() => false)
    const [dead, setDead]     = React.useState(() => false)

    const {currentFrame, setCurrentState} = withAnimationState({
      animations:             options.animations,
      currentState:           options.currentState,

      onFinished:             (state: ISpriteState) =>
        { if (state === 'death') setHidden(true); }
    });

    withSoundEffects<T>({
      entity:         props.model,
      system:         props.system,
      sounds:         options.sounds,
    });

    if (!hidden && !dead && props.model.isDead) {
      setCurrentState('death');

      setDead(true);
    }
  
    const styles: React.CSSProperties = {
      position:               'absolute',
      backgroundImage:        `url(${currentFrame})`,
      backgroundSize:         'contain',
      backgroundPosition:     'center',
      width:                  '64px',
      height:                 '64px',
      left:                   hidden ? -9999 : props.model.position.x,
      top:                    hidden ? -9999 : props.model.position.y,
      display:                cssDisplayValue(hidden),
    }
  
    return (
      <div id={options.elementId} className="sprite" style={styles} />
    )
  }
}

function cssDisplayValue(dead: boolean) {
  return dead ? 'none' : ''
}

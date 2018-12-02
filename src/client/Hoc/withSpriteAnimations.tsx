import { IModelType } from './withEntity';
import * as React from 'react';
import { Omit } from 'react-router';

import { CharacterModel } from '../../game/Domain/character';
import { MobModel } from '../../game/Domain/mob';

import { withAnimationState, WithAnimationOptions } from '../hooks/withAnimationState';


interface WithSpriteAnimationsOptions extends WithAnimationOptions {
  elementId:          string;
}

type HOCModelType = MobModel | CharacterModel;


export function withSpriteAnimations<T extends HOCModelType>(
  options: Omit<WithSpriteAnimationsOptions, 'onFinished'>
): React.ComponentType<IModelType<T>> {
  return function WithAnimationsHOC(props: IModelType<T>) {
    const [hidden, setHidden] = React.useState(() => false)
    const [dead, setDead]     = React.useState(() => false)
  
    const {currentFrame, setCurrentAnimation} = withAnimationState({
      animations:             options.animations,
      currentAnimation:       options.currentAnimation || 'normal',
      onFinished:             () => setHidden(true)
    });
  
    if (!hidden && !dead && props.model.isDead) {
      setCurrentAnimation('death');
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

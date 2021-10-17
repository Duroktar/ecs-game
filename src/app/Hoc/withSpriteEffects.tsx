import { IModelType } from './withEntity';
import * as React from 'react';
import { Omit } from 'react-router';

import { CharacterModel } from '../../game/Domain/character';
import { MobModel } from '../../game/Domain/mob';

import { withAnimationState, WithAnimationOptions } from '../hooks/withAnimationState';
import { withSoundEffects } from '../hooks/withSoundEffects';
import { IAudioCollectionInitializer, WithComponentMeta, IComponent, IEntity } from '../../engine/types';
import { withCollisionEffect, WithCollisionOptions } from '../hooks/withCollisionEffect';
import { WithCollisions } from '../../engine/components/withCollisions';


interface WithSpriteEffectsOptions extends WithAnimationOptions, WithCollisionOptions {
  elementId:          string;
  sounds:             IAudioCollectionInitializer;
  handleCollision?:   (model: WithComponentMeta<any>, component: IComponent<WithCollisions>, entity: IEntity) => void;
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

    withCollisionEffect<T>({
      entity:         props.model,
      system:         props.system,
      collisionGroup: options.collisionGroup,
      onCollision:    handleCollision,
    })

    function handleCollision(component: IComponent<WithCollisions>, entity: IEntity) {
      if (options.handleCollision) {
        options.handleCollision(props.model, component, entity);
      }

      props.model.health.value = 0;

      setCurrentState('death');
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

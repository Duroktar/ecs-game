import { IModelType } from './withEntityModel';
import * as React from 'react';
import { Omit } from 'react-router';

import { CharacterModel } from '../../game/Domain/character';
import { MobModel } from '../../game/Domain/mob';

import { withAnimationState, WithAnimationOptions } from '../hooks/withAnimationState';
import { withSoundEffects } from '../hooks/withSoundEffects';
import { IAudioCollectionInitializer, WithComponentMeta, IComponent, IEntity } from '../../engine/types';
import { withDeathState, WithDeathEffectOptions } from '../hooks/withDeathState';
import { WithCollisions } from '../../engine/components/withCollisions';
import { once } from '../../engine/utils';
import { keyframes } from '../utils/keyframes';


interface WithSpriteEffectsOptions extends WithAnimationOptions, WithDeathEffectOptions {
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

    const deathState = withDeathState({
      entity:         props.model,
      system:         props.system,
      deathEvent:     options.deathEvent,
    })

    withSoundEffects<T>({
      entity:         props.model,
      system:         props.system,
      sounds:         options.sounds,
    });

    const setStateToAlive = () => {
      setCurrentState('normal');
      setDead(false);

      keyframes(
        [() => setHidden(false),  100],
        [() => setHidden(true),   300],
        [() => setHidden(false),  400],
        [() => setHidden(true),   600],
        [() => setHidden(false),  700],
        [() => setHidden(true),   900],
        [() => setHidden(false), 1100],
        [() => setHidden(true),  1400],
        [() => setHidden(false), 1500],
      );
    }

    const setStateToDead = once(() => {
      setCurrentState('death');
      setDead(true);
    })

    if (deathState.dead && !dead) {
      setStateToDead();
    }

    if (dead && !deathState.dead) {
      setStateToAlive();
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

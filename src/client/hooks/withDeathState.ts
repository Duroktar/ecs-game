import { IComponent, IEntity } from '../../engine/types';
import {useEffect, useState} from 'react';
import { ON_ENEMY_DEATH, ON_PLAYER_DEATH, ON_REVIVE_PLAYER } from '../../events';
import { WithCollisions } from '../../engine/components/withCollisions';
import { ISystemManager } from '../../engine/interfaces/ISystemManager';

export const withDeathState = (options: WithDeathEffectOwnProps) => {
  const [dead, setDead] = useState(options.dead);

  const handleDeathEvent = (component: IComponent<WithCollisions>) => {
    if (!dead) {

      if (options.deathEvent === ON_PLAYER_DEATH) {
        setDead(true);
      }

      if (options.deathEvent === ON_ENEMY_DEATH) {

        const { collisions } = component.state;

        if (collisions.indexOf(options.entity.id) !== -1) {
          setDead(true);
        }
      }
    }
  }

  const handleRevivePlayerEvent = (component: IComponent<WithCollisions>) => {
    setDead(false);
  }

  useEffect(() => {

    options.system.events.registerListener(ON_REVIVE_PLAYER, handleRevivePlayerEvent);
    options.system.events.registerListener(options.deathEvent, handleDeathEvent);

    return function cleanup() {
      options.system.events.unRegisterListener(ON_REVIVE_PLAYER, handleRevivePlayerEvent);
      options.system.events.unRegisterListener(options.deathEvent, handleDeathEvent);
    }
  }, []);

  return { dead };
}

export type WithDeathEffectOwnProps = {
  entity:         IEntity;
  system:         ISystemManager;
} & WithDeathEffectOptions;

export type WithDeathEffectOptions = {
  deathEvent:     typeof ON_ENEMY_DEATH | typeof ON_PLAYER_DEATH;
  dead?:          boolean;
}

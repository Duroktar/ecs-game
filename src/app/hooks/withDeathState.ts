import { IComponent, IEntity } from '../../engine/types';
import {useEffect, useState} from 'react';
import { ENEMY_DEATH, PLAYER_DEATH, REVIVE_PLAYER } from '../../events';
import { WithCollisions } from '../../engine/components/withCollisions';
import { ISystemManager } from '../../engine/interfaces/ISystemManager';
import { WithHealthState } from '../../engine/components/killable';

export const withDeathState = (options: WithDeathEffectOwnProps) => {
  const [dead, setDead] = useState(options.dead);

  const handleDeathEvent = (component: IComponent<WithHealthState>) => {
    if (!dead && component.state.isDead) {
      if (component.entityId === options.entity.id) {
        setDead(true);
      }
    }
  }

  const handleRevivePlayerEvent = (component: IComponent<WithCollisions>) => setDead(false);

  useEffect(() => {

    options.system.events.registerListener(REVIVE_PLAYER, handleRevivePlayerEvent);
    options.system.events.registerListener(options.deathEvent, handleDeathEvent);

    return function cleanup() {
      options.system.events.unRegisterListener(REVIVE_PLAYER, handleRevivePlayerEvent);
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
  deathEvent:     typeof ENEMY_DEATH | typeof PLAYER_DEATH;
  dead?:          boolean;
}

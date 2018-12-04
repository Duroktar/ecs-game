import { ISystemManager, IAudioCollectionInitializer, WithComponentMeta, IComponent, IEntity, EntityIdType } from '../../engine/types';
import {useEffect} from 'react';

import { ON_DEATH, ON_ATTACK } from '../../events';
import { keys } from '../../engine/utils';
import { WithHealthState } from '../../engine/components/killable';


export const withSoundEffects = <T>(options: WithSoundEffectsOptions<T>) => {

  const playDeathAudio = (component: IComponent<WithHealthState>, entity: IEntity): void => {
    const collectionKey = mkAudioCollectionKey(entity.id, 'death');
    options.system.audio.playSound(collectionKey);
  }

  const playAttackAudio = (entity: IEntity): void => {
    const collectionKey = mkAudioCollectionKey(entity.id, 'shoot');
    options.system.audio.playSound(collectionKey);
  }

  useEffect(() => {
    options.system.events.registerListener(ON_DEATH,         playDeathAudio);
    options.system.events.registerListener(ON_ATTACK,        playAttackAudio);

    keys(options.sounds).map(key => {
      const collectionKey = mkAudioCollectionKey(options.entity.id, `${key}`);

      options.system.audio.registerSound(collectionKey, {
        src: [options.sounds[key]],
        volume: 0.2,
      })
    })

    return function cleanup() {
      options.system.events.unRegisterListener(ON_DEATH,     playDeathAudio);
      options.system.events.unRegisterListener(ON_ATTACK,    playAttackAudio);
  
      keys(options.sounds).map((actionType: string | number) => {
        const collectionKey = mkAudioCollectionKey(options.entity.id, `${actionType}`);

        options.system.audio.unRegisterSound(collectionKey);
      })
    }
  }, []);
};

export type WithSoundEffectsOptions<T> = {
  entity:         WithComponentMeta<T>
  system:         ISystemManager;
  sounds:         IAudioCollectionInitializer;
}

export function mkAudioCollectionKey(entityId: EntityIdType, action: string) {
  return `entity-${entityId}:${action}`;
}

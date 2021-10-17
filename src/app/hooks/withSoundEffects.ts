import { IAudioCollectionInitializer, WithComponentMeta, IComponent, IEntity, EntityIdType } from '../../engine/types';
import { ISystemManager } from "../../engine/interfaces/ISystemManager";
import {useEffect} from 'react';

import { DEATH, ATTACK } from '../../events';
import { keys } from '../../engine/utils';
import { WithHealthState } from '../../engine/components/killable';


export const withSoundEffects = <T>(options: WithSoundEffectsOptions<T>) => useEffect(() => {

  const playDeathAudio = (component: IComponent<WithHealthState>, entity: IEntity): void => {
    const collectionKey = mkAudioCollectionKey(entity.id, 'death');
    options.system.audio.playSound(collectionKey);
  }

  const playAttackAudio = (entity: IEntity): void => {
    const collectionKey = mkAudioCollectionKey(entity.id, 'shoot');
    options.system.audio.playSound(collectionKey);
  }

  options.system.events.registerListener(DEATH,  playDeathAudio);
  options.system.events.registerListener(ATTACK, playAttackAudio);

  keys(options.sounds).map(key => {
    const collectionKey = mkAudioCollectionKey(options.entity.id, `${key}`);

    options.system.audio.registerSound(collectionKey, {
      src: [options.sounds[key]],
      volume: 0.2,
    })
  })

  return function cleanup() {
    options.system.events.unRegisterListener(DEATH,  playDeathAudio);
    options.system.events.unRegisterListener(ATTACK, playAttackAudio);

    keys(options.sounds).map((actionType: string | number) => {
      const collectionKey = mkAudioCollectionKey(options.entity.id, `${actionType}`);

      options.system.audio.unRegisterSound(collectionKey);
    })
  }
}, []);

export type WithSoundEffectsOptions<T> = {
  entity:         WithComponentMeta<T>
  system:         ISystemManager;
  sounds:         IAudioCollectionInitializer;
}

export function mkAudioCollectionKey(entityId: EntityIdType, action: string) {
  return `entity-${entityId}:${action}`;
}

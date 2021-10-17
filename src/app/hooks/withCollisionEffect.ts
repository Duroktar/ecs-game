import { WithComponentMeta, IComponent, IEntity } from '../../engine/types';
import { ISystemManager } from "../../engine/interfaces/ISystemManager";
import {useEffect} from 'react';
import { COLLISION } from '../../events';
import { WithCollisions } from '../../engine/components/withCollisions';

export const withCollisionEffect = <T>(options: WithCollisionEffectOptions<T>) => useEffect(() => {
  function collisionHandler(component: IComponent, entity: IEntity) {
    if (options.onCollision && component.state.collisions.indexOf(options.entity.id) !== -1) {
      options.onCollision(component, entity);
    }
  }

  options.system.events.registerListener(COLLISION, collisionHandler)

  return function cleanup() {
    options.system.events.unRegisterListener(COLLISION, collisionHandler)
  }
}, []);

export type WithCollisionOptions = {
  collisionGroup: string;
}

export type WithCollisionEffectOptions<T> = {
  entity:         WithComponentMeta<T>
  system:         ISystemManager;
  collisionGroup: string;
  onCollision?:    (component: IComponent<WithCollisions>, entity: IEntity) => void;
}
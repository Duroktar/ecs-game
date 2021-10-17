import { IEntity, IComponent } from "../types";
import { IEventManager } from "../interfaces/IEventManager";
import { ISystemManager } from "../interfaces/ISystemManager";

type IFactory<O> = (system: ISystemManager) => (entity: IEntity, options: O, events: IEventManager) => IComponent

export function registerComponentFactories<O>(
  system: ISystemManager,
  entity: IEntity,
  options: O, factory: IFactory<O>[],
) {
  return factory
    .map(build => build(system))
    .map(create => create(entity, options, system.events));
}

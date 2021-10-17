import { IComponent, IEntity, IComponentEvents } from "../types";
import { ISystemManager } from "../interfaces/ISystemManager";
import { factory } from "../utils";

export type WithName = { name: string };

export function nameableFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithName, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithName>>({
        id,
        name: 'name',
        entityId: entity.id,
        state: { name: state.name },
        update: () => null,
      }))
  }
}

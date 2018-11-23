import { factory } from "../utils";
import { IComponent, ISystemManager, IEntity } from "../types";

export type WithName = { name: string };

export function nameableFactory(system: ISystemManager) {
  return (entity: IEntity, name: WithName) => {
    return system.registerComponent(
      factory<IComponent<WithName>>({
        id: -1,
        name: 'name',
        entityId: entity.id,
        state: name,
        update: () => null,
      }))
  }
}

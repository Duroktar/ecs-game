import { factory } from "../utils";
import { IComponent, ISystemManager, IEntity } from "../types";

export type WithName = { name: string };

export function nameableFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithName, id = -1) => {
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

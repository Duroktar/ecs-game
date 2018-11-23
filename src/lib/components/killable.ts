import { factory } from "../utils";
import { IComponent, ISystemManager, IEntity } from "../types";

export type WithHealth = { health: number };

export function killableFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithHealth, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithHealth>>({
        id,
        name: 'health',
        entityId: entity.id,
        state: { health: state.health },
        update: () => null,
      }))
  }
}

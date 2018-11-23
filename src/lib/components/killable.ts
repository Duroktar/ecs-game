import { factory } from "../utils";
import { IComponent, ISystemManager, IEntity } from "../types";

export type WithHealth = { health: number };

export function killableFactory(system: ISystemManager) {
  return (entity: IEntity, health: WithHealth) => {
    return system.registerComponent(
      factory<IComponent<WithHealth>>({
        id: -1,
        name: 'health',
        entityId: entity.id,
        state: health,
        update: () => null,
      }))
  }
}

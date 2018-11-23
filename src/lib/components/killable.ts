import { factory } from "../utils";
import { IComponent, ISystemManager, IEntity } from "../types";

export type WithHealth = { health: number };

export function killableFactory(system: ISystemManager) {
  return (entity: IEntity, health: number) => {
    return system.registerComponent(
      factory<IComponent<WithHealth>>({
        id: system.registerEntity().id,
        entityId: entity.id,
        state: { health },
        update: () => null,
      }))
  }
}

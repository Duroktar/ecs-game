import { factory } from "../utils";
import { IComponent, ISystemManager, IEntity } from "../types";

export type WithName = { name: string };

export function nameableFactory(system: ISystemManager) {
  return (entity: IEntity, name: string) => {
    return system.registerComponent(
      factory<IComponent<WithName>>({
        id: system.registerEntity().id,
        entityId: entity.id,
        state: { name: name },
        update: () => null,
      }))
  }
}

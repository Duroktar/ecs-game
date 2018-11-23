import { factory } from "../utils";
import { IComponent, ISystemManager, IEntity } from "../types";

export type WithAge = { age: number };

export function ageableFactory(system: ISystemManager) {
  return (entity: IEntity, age: number) => {
    return system.registerComponent(
      factory<IComponent<WithAge>>({
        id: system.registerEntity().id,
        entityId: entity.id,
        state: { age },
        update: (state: ISystemManager) => {
            const model = system.getModelForEntity(entity);
        },
      }))
  }
}

import { IComponent, ISystemManager, IEntity, IComponentEvents } from "../types";
import { factory } from "../utils";

export type WithAge = { age: number };

export function ageableFactory(system: ISystemManager) {
  let GAME_YEAR = 2 * 1000;
  return (entity: IEntity, state: WithAge, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithAge>>({
        id,
        name: 'age',
        entityId: entity.id,
        state: { age: state.age },
        update: (system: ISystemManager, component: IAgeableEntity) => {
            const {epoch} = system;
            const remainder = epoch % GAME_YEAR;
            if (remainder === 0 && epoch > 0) {
              component.state.age++; 
            }
        },
      }))
  }
}

type IAgeableEntity = IComponent<WithAge>;

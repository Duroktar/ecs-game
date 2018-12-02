import { IComponent, ISystemManager, IEntity, IComponentEvents } from "../types";
import { factory, createSelector, createSetter, defaultComponentEvents } from "../utils";
import { ON_ENEMY_DEATH } from "../../events";

const COMPONENT_NAMESPACE = 'health';

export interface WithHealth {
  health: {
    value: number;
    immortal?: boolean;
  };
};

export type WithHealthState = WithHealth & { isDead?: boolean; };

export function killableFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithHealthState, events: IComponentEvents, id: number = -1) => {
    return system.registerComponent(
      factory<IComponent<WithHealthState>>({
        id,
        name: COMPONENT_NAMESPACE,
        entityId: entity.id,
        state: { health: state.health, isDead: state.isDead },
        update: (system: ISystemManager, component: IComponent<WithHealthState>) => {

          if (component.state.health.immortal) {
            return;
          }

          const wasDeadBefore = component.state.isDead;
          const isDeadNow = !(component.state.health.value > 0);

          component.state.isDead = isDeadNow;

          if (!wasDeadBefore && isDeadNow) {
            // sad times
            events.onChange!(ON_ENEMY_DEATH, component, entity)
          }
        },
      }))
  }
}

export type IKillableEntity = IComponent<WithHealthState>

export const selectKillableState = createSelector<WithHealthState>(COMPONENT_NAMESPACE);
export const setKillableState    = createSetter<WithHealthState>(selectKillableState);

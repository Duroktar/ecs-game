import { factory, createSelector, createSetter } from "../utils";
import { IComponent, ISystemManager, IEntity } from "../types";

const COMPONENT_NAMESPACE = 'health';

export type WithHealth = { health: number };

export function killableFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithHealth, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithHealth>>({
        id,
        name: COMPONENT_NAMESPACE,
        entityId: entity.id,
        state: { health: state.health },
        update: () => null,
      }))
  }
}

type IKillableEntity = IComponent<WithHealth>

export const selectKillableState = createSelector<WithHealth>(COMPONENT_NAMESPACE);
export const setKillableState    = createSetter<WithHealth>(selectKillableState);

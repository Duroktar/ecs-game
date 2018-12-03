import { IComponent, ISystemManager, IEntity, IComponentEvents } from "../types";
import { factory, createSelector, createSetter } from "../utils";
import { WithGeometry } from "./withGeometry";
import { WithPosition } from "./withPosition";

const COMPONENT_NAMESPACE = 'collidable';

export type IsCollidable = { collidable?: boolean; };

export function isCollidableFactory(system: ISystemManager) {
  return (entity: IEntity, state: IsCollidable, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<IsCollidable>>({
        id,
        entityId: entity.id,
        name: COMPONENT_NAMESPACE,
        state: { collidable: state.collidable || true },
        update: (system: ISystemManager, component: ICollidableEntity) => null,
      }))
  }
}

type ICollidableEntity = IComponent<IsCollidable & WithGeometry & WithPosition>;

export const selectCollidableState = createSelector<ICollidableEntity>(COMPONENT_NAMESPACE);
export const setCollidableState    = createSetter<ICollidableEntity>(selectCollidableState);

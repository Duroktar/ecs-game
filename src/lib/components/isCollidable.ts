import { IComponent, ISystemManager, IEntity } from "../types";
import { factory, createSelector, createSetter } from "../utils";
import { WithGeometry } from "./withGeometry";
import { WithPosition } from "./moveable";

const COMPONENT_NAMESPACE = 'collidable';

export type IsCollidable = { collidable?: boolean; };

export function isCollidableFactory(system: ISystemManager) {
  return (entity: IEntity, state: IsCollidable, id = -1) => {
    return system.registerComponent(
      factory<IComponent<IsCollidable>>({
        id,
        entityId: entity.id,
        name: COMPONENT_NAMESPACE,
        state: { collidable: state.collidable || true },
        update: (system: ISystemManager, component: ICollidableEntity) => {
          // handleCollisions(component, system);
        },
      }))
  }
}

type ICollidableEntity = IComponent<IsCollidable & WithGeometry & WithPosition>;

export const selectCollidableState = createSelector<ICollidableEntity>(COMPONENT_NAMESPACE);
export const setCollidableState    = createSetter<ICollidableEntity>(selectCollidableState);

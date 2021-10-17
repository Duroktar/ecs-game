import { IComponent, IEntity, EntityIdType, Bounds, IVector, IDimensions, IComponentEvents } from "../types";
import { ISystemManager } from "../interfaces/ISystemManager";
import { factory, createSelector, createSetter } from "../utils";
import { WithGeometry } from "./withGeometry";
import { WithPosition } from "./withPosition";
import { COLLISION } from "../../events";
import { IsCollidable } from "./isCollidable";

const COMPONENT_NAMESPACE = 'collisions';

export type WithCollisionArgs = Partial<WithCollisions>;
export type WithCollisions = { collisions: Set<EntityIdType>; collisionGroup: string; };

export function withCollisionsFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithCollisionArgs, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithCollisionArgs>>({
        id,
        entityId: entity.id,
        name: COMPONENT_NAMESPACE,
        state: { collisions: state.collisions || new Set(), collisionGroup: state.collisionGroup },
        update: (system: ISystemManager, component: ICollidableEntity) => {
          handleCollisions(entity, component, system, events);
        },
      }))
  }
}

function eqSet<T>(as: Set<T>, bs: Set<T>) {
  if (as.size !== bs.size) return false;
  for (var a of as) if (!bs.has(a)) return false;
  return true;
}

type ICollidableEntity = IComponent<WithCollisions & WithGeometry & WithPosition & IsCollidable>

function handleCollisions(entity: IEntity, component: ICollidableEntity, system: ISystemManager, events: IComponentEvents) {
  const model = system.getEntityModel<WithGeometry & WithPosition & IsCollidable & WithCollisions>({ id: component.entityId });

  if (!model.collidable) {
    return
  }

  const collidableEntities = system
    .getEntitiesByComponentTypes(['geometry', 'position', 'collidable'])
    .filter(id => id !== component.entityId)
    .map(id => system.getEntityModel<IsCollidable & WithGeometry & WithPosition>({ id }))
    .filter(model => model.collidable && (model.entityId !== component.entityId) && (model.collisionGroup !== component.state.collisionGroup));

  const ownBounds = getBounds(model.position, model.geometry);

  const lastCollisions = new Set(component.state.collisions)

  let collisions = 0;

  collidableEntities.forEach(o => {
    const otherBounds = getBounds(o.position, o.geometry);
    if (otherBounds !== undefined && overlap(ownBounds, otherBounds)) {
      component.state.collisions.add(o.id);
      collisions++;
    }
  });

  if (!eqSet(lastCollisions, component.state.collisions) && collisions > 0) {
    events.onChange(COLLISION, component, entity);
  }
}

export const selectCollidableState = createSelector<ICollidableEntity>(COMPONENT_NAMESPACE);
export const setCollidableState    = createSetter<ICollidableEntity>(selectCollidableState);

function getBounds(pos: IVector, dimensions: IDimensions) {
  return {
    left: pos.x - (dimensions.width / 2),
    right: pos.x + (dimensions.width / 2),
    top: pos.y,
    bottom: pos.y + dimensions.height,
  }
}

function overlap(a: Bounds, b: Bounds) {
  // If one rectangle is on left side of other
  if (a.left > b.right || b.left > a.right)
    return false;

  // If one rectangle is above other
  if (a.bottom < b.top || b.bottom < a.top)
    return false;

  return true;
}

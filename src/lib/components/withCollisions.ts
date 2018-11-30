import { IComponent, ISystemManager, IEntity, EntityIdType, Bounds, IVector, IDimensions, IComponentEvents } from "../types";
import { factory, createSelector, createSetter } from "../utils";
import { WithGeometry } from "./withGeometry";
import { WithPosition } from "./withPosition";

const COMPONENT_NAMESPACE = 'collisions';

export type WithCollisions = { collisions?: EntityIdType[]; };

export function withCollisionsFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithCollisions, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithCollisions>>({
        id,
        entityId: entity.id,
        name: COMPONENT_NAMESPACE,
        state: { collisions: state.collisions || [] },
        update: (system: ISystemManager, component: ICollidableEntity) => {
          handleCollisions(component, system);
        },
      }))
  }
}

type ICollidableEntity = IComponent<WithCollisions & WithGeometry & WithPosition>

function handleCollisions(component: ICollidableEntity, system: ISystemManager) {
  const position = system.getEntityModel<WithGeometry & WithPosition>({ id: component.entityId });

  const collidableEntities = system
    .getEntitiesByComponentTypes(['geometry', 'position', 'collidable'])
    .filter(id => id !== component.entityId)
    .map(id => system.getEntityModel<WithGeometry & WithPosition>({ id }));

  const ownBounds = getBounds(position.position, position.geometry);

  const collisions: EntityIdType[] = [];

  collidableEntities.forEach(o => {
    const otherBounds = getBounds(o.position, o.geometry);
    if (overlap(ownBounds, otherBounds) && otherBounds !== undefined) {
      collisions.push(o.id);
    }
  });

  component.state.collisions = collisions;
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

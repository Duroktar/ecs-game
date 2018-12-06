import { IComponent, ISystemManager, IEntity, EntityIdType, Bounds, IVector, IDimensions, IComponentEvents } from "../types";
import { factory, createSelector, createSetter } from "../utils";
import { WithGeometry } from "./withGeometry";
import { WithPosition } from "./withPosition";
import { ON_COLLISION } from "../../events";
import { IsCollidable } from "./isCollidable";

const COMPONENT_NAMESPACE = 'collisions';

export type WithCollisionArgs = Partial<WithCollisions>;
export type WithCollisions = { collisions: EntityIdType[]; collisionGroup: string; };

export function withCollisionsFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithCollisionArgs, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithCollisionArgs>>({
        id,
        entityId: entity.id,
        name: COMPONENT_NAMESPACE,
        state: { collisions: state.collisions || [], collisionGroup: state.collisionGroup },
        update: (system: ISystemManager, component: ICollidableEntity) => {
          handleCollisions(entity, component, system, events);
        },
      }))
  }
}

type ICollidableEntity = IComponent<WithCollisions & WithGeometry & WithPosition>

function handleCollisions(entity: IEntity, component: ICollidableEntity, system: ISystemManager, events: IComponentEvents) {
  const position = system.getEntityModel<WithGeometry & WithPosition>({ id: component.entityId });

  const collidableEntities = system
    .getEntitiesByComponentTypes(['geometry', 'position', 'collidable'])
    .filter(id => id !== component.entityId)
    .map(id => system.getEntityModel<IsCollidable & WithGeometry & WithPosition>({ id }))
    .filter(model => model.collisionGroup !== component.state.collisionGroup);

  const ownBounds = getBounds(position.position, position.geometry);

  const collisions: EntityIdType[] = [];

  collidableEntities.forEach(o => {
    const otherBounds = getBounds(o.position, o.geometry);
    if (overlap(ownBounds, otherBounds) && otherBounds !== undefined) {
      collisions.push(o.id);
    }
  });

  const lastCollisions = component.state.collisions
    ? component.state.collisions.map(o => o)
    : [];

  component.state.collisions = collisions;

  if (diff(lastCollisions, collisions) && collisions.length > 0) {
    events.onChange(ON_COLLISION, component, entity);
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

function diff(arrayToCompareTo: number[], comparedArray: number[])
{
  const sorted1 = arrayToCompareTo.sort();
  const sorted2 = comparedArray.sort();

  if (sorted2.length > sorted1.length) {
    return true;
  }

  for(var i = 0; i < sorted1.length; ++i) {
    if (sorted1[i] != sorted2[i]) {
      return true;
    }
  }

  return false;
}

import { IComponent, ISystemManager, IEntity, EntityIdType } from "../types";
import { factory } from "../utils";
import { createSelector, createSetter } from "./utils";
import { WithGeometry } from "./withGeometry";
import { WithPosition } from "./moveable";

const COMPONENT_NAMESPACE = 'collisions';

export type WithCollisions = { collisions?: EntityIdType[]; };

export function withCollisionsFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithCollisions, id = -1) => {
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
      // overlap2(ownBounds, otherBounds)
      collisions.push(o.id);
    }
  });

  component.state.collisions = collisions;
}

export const selectCollidableState = createSelector<ICollidableEntity>(COMPONENT_NAMESPACE);
export const setCollidableState    = createSetter<ICollidableEntity>(selectCollidableState);

function getBounds(pos: IVector, dimensions: Dimensions) {
  return {
    left: pos.x,
    right: pos.x + dimensions.width,
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

function overlap2(a: Bounds, b: Bounds) {
  // If one rectangle is on left side of other
  if (a.left > b.right || b.left > a.right)
    return false;

  // If one rectangle is above other
  if (a.bottom < b.top || b.bottom < a.top)
    return false;

  // debugger
  return true;
}

export interface IVector {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

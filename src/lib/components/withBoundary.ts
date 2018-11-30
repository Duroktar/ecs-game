import { IComponent, ISystemManager, IEntity, EntityIdType, Bounds, IVector, IDimensions, IComponentEvents, BoundedTouchingState, BoundedTouchingStateKeys } from "../types";
import { factory, createSelector, createSetter, keys, defaultBoundary } from "../utils";
import { WithGeometry } from "./withGeometry";
import { WithPosition } from "./withPosition";

const COMPONENT_NAMESPACE = 'boundary';

export type WithBoundary = { boundary: Bounds; };

export function withBoundaryFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithBoundary, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithBoundary>>({
        id,
        entityId: entity.id,
        name: COMPONENT_NAMESPACE,
        state: { boundary: state.boundary || defaultBoundary },
        update: (system: ISystemManager, component: IBoundedEntity) => {
          handleBoundaries(entity, component, system, events);
        },
      }))
  }
}

type IBoundedEntity = IComponent<WithGeometry & WithPosition & WithBoundary>

function handleBoundaries(entity: IEntity, component: IBoundedEntity, system: ISystemManager, events: IComponentEvents) {

  const boundedEntities = system
    .getEntitiesByComponentTypes(['geometry', 'position', 'boundary'])
    .map(id => system.getEntityModel<WithGeometry & WithPosition & WithBoundary>({ id }));

  const ownBounds = component.state.boundary;

  boundedEntities.forEach(o => {
    const otherBounds = getBounds(o.position, o.geometry);
    const breakingOut = breakingBounds(ownBounds, otherBounds);

    if (any(breakingOut)) {
      events.onChange('boundary', component, entity)
    }
  });
}

export const selectBoundaryState = createSelector<IBoundedEntity>(COMPONENT_NAMESPACE);
export const setBoundaryState    = createSetter<IBoundedEntity>(selectBoundaryState);

function getBounds(pos: IVector, dimensions: IDimensions) {
  return {
    left: pos.x - (dimensions.width / 2),
    right: pos.x + (dimensions.width / 2),
    top: pos.y,
    bottom: pos.y + dimensions.height,
  }
}

function breakingBounds(own: Bounds, other: Bounds): BoundedTouchingState {
  const result = {
    left:   other.left < own.left,
    top:    other.top < own.top,
    right:  other.right > own.right,
    bottom: other.bottom > own.bottom,
  }

  return result;
}

function any(obj: any) {
  return Object.keys(obj)
    .filter(key => !!obj[key]).length > 0;
}

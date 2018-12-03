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
        update: (system: ISystemManager, component: IBoundedEntity) => null,
      }))
  }
}

type IBoundedEntity = IComponent<WithGeometry & WithPosition & WithBoundary>

export const selectBoundaryState = createSelector<IBoundedEntity>(COMPONENT_NAMESPACE);
export const setBoundaryState    = createSetter<IBoundedEntity>(selectBoundaryState);

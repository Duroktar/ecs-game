import { IComponent, IVector, IEntity, IComponentEvents } from "../types";
import { ISystemManager } from "../interfaces/ISystemManager";
import { factory, createSelector, createSetter, clamp, ifStateProp } from "../utils";
import { WithControls } from "./controllable";
import { WithBoundary } from "./withBoundary";
import { WithGeometry } from "./withGeometry";

const COMPONENT_NAMESPACE = 'worldwrap';

export type WithPosition = { position: IVector; }

export function withWrapAroundPositionFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithPosition, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithPosition>>({
        id,
        name: COMPONENT_NAMESPACE,
        entityId: entity.id,
        state: { position: state.position },
        update: (system: ISystemManager, component: IComponent<WithPosition>) => {
          handleMovementState(entity, system, component, events);
        },
      }))
    }
  }

function handleMovementState(entity: IEntity, system: ISystemManager, component: IComponent<WithPosition>, events: IComponentEvents) {

  const controls = system.getEntityComponent<WithControls>(entity, 'controls');

  if (!controls || !controls.state.moving) {
    return;
  }

  const {direction, speed} = controls.state;

  component.state.position.x += direction.x * speed.x;
  component.state.position.y += direction.y * speed.y;

  // wrap around if necessary
  const boundaryComponent = system.getEntityComponent<WithBoundary>(entity, 'boundary');
  const geometryComponent = system.getEntityComponent<WithGeometry>(entity, 'geometry');

  if (ifStateProp(boundaryComponent) && ifStateProp(geometryComponent)) {

    const {width, height} = geometryComponent.state.geometry;
    const {boundary}      = boundaryComponent.state;

    const {x, y} = component.state.position;
    component.state.position.x = (x < boundary.left) ? (boundary.right - width) : (x > boundary.right) ? boundary.left : x;
    component.state.position.y = (y < boundary.top) ? (boundary.bottom - height) : (y > boundary.bottom) ? boundary.top : y;
  }
};

export const selectPositionState = createSelector<WithPosition>(COMPONENT_NAMESPACE);
export const setPositionState    = createSetter<WithPosition>(selectPositionState);

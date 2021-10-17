import { IComponent, IVector, IEntity, IComponentEvents } from "../types";
import { ISystemManager } from "../interfaces/ISystemManager";
import { factory, createSelector, createSetter, clamp, ifStateProp } from "../utils";
import { WithControls } from "./controllable";
import { WithBoundary } from "./withBoundary";
import { WithGeometry } from "./withGeometry";

const COMPONENT_NAMESPACE = 'position';

export type WithPosition = { position: IVector; controllable?: boolean; }
export type WithCenter = { center: IVector; }
export type WithPositionState = WithPosition & WithCenter;

export function withPositionFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithPosition, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithPositionState>>({
        id,
        name: COMPONENT_NAMESPACE,
        entityId: entity.id,
        state: { position: { ...state.position }, center: { ...state.position }, controllable: state.controllable || true },
        update: (system: ISystemManager, component: IComponent<WithPositionState>) => {
          handleMovementState(entity, system, component, events);
        },
      }))
    }
  }

function handleMovementState(entity: IEntity, system: ISystemManager, component: IComponent<WithPositionState>, events: IComponentEvents) {

  if (!component.state.controllable) {
    return;
  }

  const controls = system.getEntityComponent<WithControls>(entity, 'controls');

  if (!controls || !controls.state.moving) {
    return;
  }

  // ai yai yai, wtf is this doing here
  const {direction, speed} = controls.state;

  component.state.position.x += direction.x * speed.x;
  component.state.position.y += direction.y * speed.y;
  // !! ??? ^^^^^^^^

  const boundaryComponent = system.getEntityComponent<WithBoundary>(entity, 'boundary');
  const geometryComponent = system.getEntityComponent<WithGeometry>(entity, 'geometry');

  if (ifStateProp(boundaryComponent) && ifStateProp(boundaryComponent)) {

    const {width, height} = geometryComponent.state.geometry;
    const {boundary}      = boundaryComponent.state;

    const clampedX = clamp(boundary.left, boundary.right - width,   component.state.position.x)
    const clampedY = clamp(boundary.top,  boundary.bottom - height, component.state.position.y)

    component.state.position.x = clampedX;
    component.state.position.y = clampedY;

    component.state.center.x = component.state.position.x - width / 2;
    component.state.center.y = component.state.position.y - height / 2;

  }
};

export const selectPositionState = createSelector<WithPosition>(COMPONENT_NAMESPACE);
export const setPositionState    = createSetter<WithPosition>(selectPositionState);

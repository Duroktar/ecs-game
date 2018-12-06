import { IComponent, ISystemManager, IEntity, IComponentEvents } from "../types";
import { factory, ifStateProp } from "../utils";
import { WithBoundary } from "./withBoundary";
import { WithGeometry } from "./withGeometry";
import { WithPositionState } from "./withPosition";

const COMPONENT_NAMESPACE = 'worldwrap';

export function withWrapAroundPositionFactory(system: ISystemManager) {
  return (entity: IEntity, state: {}, events: IComponentEvents, id = -1) => {
    return system.registerComponent<WithPositionState>(
      factory<IComponent>({
        id,
        name: COMPONENT_NAMESPACE,
        entityId: entity.id,
        state: {},
        update: (system: ISystemManager, component: IComponent<{}>) => {
          handleMovementState(entity, system, component, events);
        },
      }))
    }
  }
  
function handleMovementState(entity: IEntity, system: ISystemManager, component: IComponent<{}>, events: IComponentEvents) {

  const positionComponent = system.getEntityComponent<WithPositionState>(entity, 'position');

  // wrap around if necessary
  const boundaryComponent = system.getEntityComponent<WithBoundary>(entity, 'boundary');
  const geometryComponent = system.getEntityComponent<WithGeometry>(entity, 'geometry');
  
  if (ifStateProp(boundaryComponent) && ifStateProp(geometryComponent)) {

    const {width, height} = geometryComponent.state.geometry;
    const {boundary}      = boundaryComponent.state;

    const {x, y} = positionComponent.state.position;
    positionComponent.state.position.x = (x < boundary.left) ? (boundary.right - width) : (x > boundary.right) ? boundary.left : x;
    positionComponent.state.position.y = (y < boundary.top) ? (boundary.bottom - height) : (y > boundary.bottom) ? boundary.top : y;
  }
};

import { IComponent, IVector, IEntity, IComponentEvents } from "../types";
import { factory } from "../utils";
import { WithPositionState } from "./withPosition";
import { ISystemManager } from "../interfaces/ISystemManager";

const COMPONENT_NAMESPACE = 'homePosition';

export type WithHomePosition = { homePosition: IVector; goHome?: boolean; isHome?: boolean; }

export function withHomePositionFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithHomePosition, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithHomePosition>>({
        id,
        name: COMPONENT_NAMESPACE,
        entityId: entity.id,
        state: { homePosition: { ...state.homePosition }, goHome: state.goHome },
        update: (system: ISystemManager, component: IComponent<WithHomePosition & WithPositionState>) => {
          handleMovementState(entity, system, component, events);
        },
      })
    )
  }
}

const BOOGETY = 66;
const TIME_TO_GET_HOME = BOOGETY * 1.1; // htfu

function handleMovementState(entity: IEntity, system: ISystemManager, component: IComponent<WithHomePosition & WithPositionState>, events: IComponentEvents) {

  const moveable = system.getEntityComponent<WithPositionState>(entity, 'position');

  if (!moveable || !moveable.state) {
    return;
  }

  const { homePosition: { x, y } } = component.state;

  const distX = (x - moveable.state.position.x);
  const distY = (y - moveable.state.position.y);

  if (component.state.goHome) {
    moveable.state.position.x = (Math.abs(distX) < 1) ? x : moveable.state.position.x + (distX / TIME_TO_GET_HOME);
    moveable.state.position.y = (Math.abs(distY) < 1) ? y : moveable.state.position.y + (distY / TIME_TO_GET_HOME);
  }

  if (distX === 0 && distY === 0) {
    component.state.isHome = true;
  } else {
    component.state.isHome = false;
  }
};

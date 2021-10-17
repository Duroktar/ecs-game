import { IComponent, IVector, IEntity, IComponentEvents } from "../types";
import { ISystemManager } from "../interfaces/ISystemManager";
import { WithPosition } from "./withPosition";
import { factory } from "../utils";
import { WithBoundary } from "./withBoundary";

export type WithControls = { direction: IVector; moving: boolean; speed: IVector; };

export function controllableFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithControls, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithControls>>({
        id,
        entityId: entity.id,
        name: 'controls',
        state: {
          direction: state.direction,
          moving: state.moving,
          speed: state.speed,
        },
        update: (system: ISystemManager, component: IControllableEntity) => {
          handleVerticalMovement(entity, component, system);
          handleHorizontalMovement(entity, component, system);
          
          handleMovingFlag(entity, component, system);
        },
      }))
  }
}

type IControllableEntity = IComponent<WithControls & Partial<WithPosition> & Partial<WithBoundary>>

function handleVerticalMovement(entity: IEntity, component: IControllableEntity, system: ISystemManager) {
  handleMovement(entity, component, system, 'vertical');
}

function handleHorizontalMovement(entity: IEntity, component: IControllableEntity, system: ISystemManager) {
  handleMovement(entity, component, system);
}

function handleMovement(entity: IEntity, component: IControllableEntity, system: ISystemManager, direction: 'vertical' | 'horizontal' = 'horizontal') {

  const key = direction === 'horizontal' ? 'x' : 'y';
  const [neg, pos] = direction === 'horizontal'
    ? [system.input.KeyCodes.LEFT, system.input.KeyCodes.RIGHT]
    : [system.input.KeyCodes.UP,   system.input.KeyCodes.DOWN];

  if (system.input.keyPressed(pos)) {
    component.state.direction[key] = 1;
  } else
  if (system.input.keyPressed(neg)) {
    component.state.direction[key] = -1;
  } else {
    component.state.direction[key] = 0;
  }
}

function handleMovingFlag(entity: IEntity, component: IControllableEntity, system: ISystemManager) {
  const {x, y} = component.state.direction;
  if (x === 0 && y === 0) {
    component.state.moving = false;
  } else {
    component.state.moving = true;
  }
}

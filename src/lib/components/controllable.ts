import { IComponent, ISystemManager, IVector, IEntity } from "../types";
import { factory } from "../utils";
import { Keyboard } from "../../extern/Keyboard";
import { WithMovement } from "./moveable";

export type WithControls = { direction: IVector; moving: boolean; };

export function controllableFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithControls, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithControls>>({
        id,
        entityId: entity.id,
        name: 'controls',
        state: { direction: state.direction, moving: state.moving },
        update: (system: ISystemManager, component: IControllableEntity) => {
          handleVerticalMovement(entity, component, system);
          handleHorizontalMovement(entity, component, system);

          handleMovingFlag(entity, component, system);
        },
      }))
  }
}

type IControllableEntity = IComponent<WithControls & Partial<WithMovement>>

function handleVerticalMovement(entity: IEntity, component: IControllableEntity, system: ISystemManager) {
  handleMovement(entity, component, system, 'vertical');
}

function handleHorizontalMovement(entity: IEntity, component: IControllableEntity, system: ISystemManager) {
  handleMovement(entity, component, system);
}

function handleMovement(entity: IEntity, component: IControllableEntity, system: ISystemManager, direction: 'vertical' | 'horizontal' = 'horizontal') {
  const key = direction === 'horizontal' ? 'x' : 'y';
  const [neg, pos] = direction === 'horizontal'
    ? [Keyboard.LEFT, Keyboard.RIGHT]
    : [Keyboard.DOWN, Keyboard.UP];

  const movement = system.getEntityComponent<WithMovement>(entity, 'movement');

  if (system.keyboard.keyPressed(pos)) {
    component.state.direction[key] = 1;
    movement.state.position[key]++;
  } else
  if (system.keyboard.keyPressed(neg)) {
    component.state.direction[key] = -1;
    movement.state.position[key]--;
  } else {
    component.state.direction[key] = 0;
  }
}

function handleMovingFlag(entity: IEntity, component: IControllableEntity, system: ISystemManager) {
  const {x, y} = component.state.direction;
  if (x === 0 && y === 0) {
    component.state['moving'] = false;
  } else {
    component.state['moving'] = true;
  }
}

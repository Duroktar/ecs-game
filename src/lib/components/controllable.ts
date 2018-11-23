import { IComponent, ISystemManager, IVector, IEntity } from "../types";
import { factory } from "../utils";
import { Keyboard } from "../../extern/Keyboard";
import { setMovableState } from "./moveable";

export type WithControls = { direction: IVector; moving: boolean; };

export function controllableFactory(system: ISystemManager) {
  return (entity: IEntity, options: WithControls) => {
    return system.registerComponent(
      factory<IComponent<WithControls>>({
        id: system.registerEntity().id,
        entityId: entity.id,
        state: options,
        update: (system: ISystemManager, component: IComponent<WithControls>) => {
          handleVerticalMovement(system, component);
          handleHorizontalMovement(system, component);
          const {x, y} = component.state.direction;
          if (x === 0 && y === 0) {
            component.state['moving'] = false;
          } else {
            component.state['moving'] = true;
          }
        },
      }))
  }
}

function handleVerticalMovement(system: ISystemManager, component: IComponent<WithControls>) {
  handleMovement(system, component, 'vertical');
}

function handleHorizontalMovement(system: ISystemManager, component: IComponent<WithControls>) {
  handleMovement(system, component);
}

function handleMovement(system: ISystemManager, component: IComponent<WithControls>, direction: 'vertical' | 'horizontal' = 'horizontal') {
  const key = direction === 'horizontal' ? 'x' : 'y';
  const [neg, pos] = direction === 'horizontal'
    ? [Keyboard.LEFT, Keyboard.RIGHT]
    : [Keyboard.DOWN, Keyboard.UP];

  if (system.keyboard.keyPressed(pos)) {
    component.state.direction[key] = 1;
  } else if (system.keyboard.keyPressed(neg)) {
    component.state.direction[key] = -1;
  } else {
    component.state.direction[key] = 0;
  }
}

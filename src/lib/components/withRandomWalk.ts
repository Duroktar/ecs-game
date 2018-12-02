import { IComponent, ISystemManager, IVector, IEntity, IComponentEvents } from "../types";
import { WithPosition } from "./withPosition";
import { factory, boxMullerRandomGeneratorFactory, clamp, throttle } from "../utils";

export type WithRandomWalkArgs = { controls?: Partial<WithRandomWalk> };
export type WithRandomWalk = { direction: IVector; moving: boolean; speed: IVector; disabled: boolean; jitter: number; };

const defaults = { direction: { x: 0, y: 0 }, moving: true, speed: { x: 2, y: 1.65 }, disabled: false, jitter: 400 }

export function withRandomWalkFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithRandomWalkArgs, events: IComponentEvents, id = -1) => {

    const options = state.controls || defaults;

    let jitter: number = options.jitter || defaults.jitter;
    let randomWalkGeneratorX: () => number;
    let randomWalkGeneratorY: () => number;

    const setJitter = (level?: number) => {
      jitter = level || defaults.jitter;
      randomWalkGeneratorX = throttle<number>(boxMullerRandomGeneratorFactory(), jitter);
      randomWalkGeneratorY = throttle<number>(boxMullerRandomGeneratorFactory(), jitter);
    }

    setJitter(jitter);

    return system.registerComponent(
      factory<IComponent<WithRandomWalk>>({
        id,
        entityId: entity.id,
        name: 'controls',
        state: {
          direction: options.direction || { x: 0, y: 0 },
          moving: options.moving || true,
          speed: options.speed || { x: 2, y: 1.65 },
          disabled: options.disabled || false,
          jitter,
        },
        update: (system: ISystemManager, component: IWithRandomWalkEntity) => {

          if (component.state.jitter !== jitter) {
            setJitter(jitter);
          }

          if (!component.state.disabled) {
            handleMovement(entity, component, system, events, randomWalkGeneratorX, randomWalkGeneratorY);
  
            handleMovingFlag(entity, component, system, events);
          }
        },
      }))
  }
}

type IWithRandomWalkEntity = IComponent<WithRandomWalk & Partial<WithPosition>>;
type RNGFunc = (...args: any[]) => number;

function handleMovement(entity: IEntity, component: IWithRandomWalkEntity, system: ISystemManager, events: IComponentEvents, randomWalkGeneratorX: RNGFunc, randomWalkGeneratorY: RNGFunc) {

  const deltaX = randomWalkGeneratorX();
  const deltaY = randomWalkGeneratorY();

  component.state.direction.x = clamp(-1, 1, deltaX);

  component.state.direction.y = clamp(-1, 1, deltaY);
}

function handleMovingFlag(entity: IEntity, component: IWithRandomWalkEntity, system: ISystemManager, events: IComponentEvents) {
  const {x, y} = component.state.direction;
  if (x === 0 && y === 0) {
    component.state.moving = false;
  } else {
    component.state.moving = true;
  }
}

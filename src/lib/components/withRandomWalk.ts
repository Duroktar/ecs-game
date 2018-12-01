import { IComponent, ISystemManager, IVector, IEntity, IComponentEvents } from "../types";
import { WithPosition } from "./withPosition";
import { factory, boxMullerRandomGeneratorFactory, clamp, throttle } from "../utils";

export type WithRandomWalkArgs = { direction?: IVector; moving?: boolean; speed?: IVector; };
export type WithRandomWalk = { direction: IVector; moving: boolean; speed: IVector; };

const JITTER = 400;

export function withRandomWalkFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithRandomWalkArgs, events: IComponentEvents, id = -1) => {

    const randomWalkGeneratorX = throttle<number>(boxMullerRandomGeneratorFactory(), JITTER);
    const randomWalkGeneratorY = throttle<number>(boxMullerRandomGeneratorFactory(), JITTER);

    return system.registerComponent(
      factory<IComponent<WithRandomWalk>>({
        id,
        entityId: entity.id,
        name: 'controls',
        state: {
          direction: state.direction || { x: 0, y: 0 },
          moving: state.moving || true,
          speed: state.speed || { x: 2, y: 1.65 },
        },
        update: (system: ISystemManager, component: IWithRandomWalkEntity) => {
          handleMovement(entity, component, system, events, randomWalkGeneratorX, randomWalkGeneratorY);

          handleMovingFlag(entity, component, system, events);
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

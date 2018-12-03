import { IComponent, ISystemManager, IEntity, IComponentEvents } from "../types";

import { factory, ifStateProp } from "../utils";
import { WithPosition } from "./withPosition";

type WiggleState = { counter: number; increment: number; };

export type WithBugWiggleArgs = { wiggling: boolean; wiggleState?: WiggleState; };
export type WithBugWiggle = { wiggling: boolean; wiggleState: WiggleState; };

const BRAKE       = 0.1;
const PULSE_WIDTH = 4;

export function withBugWiggleFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithBugWiggleArgs, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithBugWiggle>>({
        id,
        entityId: entity.id,
        name: 'wiggle',
        state: {
          wiggling: state.wiggling,

          wiggleState: {
            counter: 0,
            increment: +1,
          }
        },
        update: (system: ISystemManager, component: IWithBugWiggleEntity) => {
          handleBugWiggle(entity, component, system, events);
        },
      }))
  }
}

type IWithBugWiggleEntity = IComponent<WithBugWiggle & Partial<WithPosition>>;

function handleBugWiggle(entity: IEntity, component: IWithBugWiggleEntity, system: ISystemManager, events: IComponentEvents) {

  if (!component.state.wiggling) {
    return;
  }

  let {counter, increment} = component.state.wiggleState;

  if(counter == PULSE_WIDTH) {
    component.state.wiggleState.increment = -1;
  };

  if(counter == -PULSE_WIDTH) {
    component.state.wiggleState.increment = +1;
  };

  component.state.wiggleState.counter+= increment;

  const positionComponent = system.getEntityComponent<WithPosition>(entity, 'position');

  if (ifStateProp(positionComponent)) {
    positionComponent.state.position.x += (counter * BRAKE);
  }
}

import { IComponent, IEntity, IComponentEvents } from "../types";
import { ISystemManager } from "../interfaces/ISystemManager";
import { WithPosition } from "./withPosition";
import { factory } from "../utils";

export type WithOffscreen = { offscreen?: boolean; };

export function withOffscreenFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithOffscreen & Partial<WithPosition>, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithOffscreen>>({
        id,
        entityId: entity.id,
        name: 'offscreen',
        state: { offscreen: state.offscreen || false },
        update: (system: ISystemManager, component: IWithOffscreenEntity) => {
          handleOffscreenFlag(entity, component, system);
        },
      }))
  }
}

type IWithOffscreenEntity = IComponent<WithOffscreen & WithPosition>

function handleOffscreenFlag(entity: IEntity, component: IWithOffscreenEntity, system: ISystemManager) {
  const {state: { position }} = system.getEntityComponent<WithPosition>(entity, 'position');
  const {screenSize} = system.config;

  if (position.x < 0 || position.y < 0) {
    component.state.offscreen = true;
    return;
  }

  if (position.x > screenSize!.x || position.y > screenSize!.y) {
    component.state.offscreen = true;
    return;
  } 
  
  if (position.x > window.innerWidth || position.y > window.innerHeight) {
    component.state.offscreen = true;
    return;
  }

  component.state.offscreen = false;
};

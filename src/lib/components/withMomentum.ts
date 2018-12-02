import { IComponent, ISystemManager, IVector, IEntity, IComponentEvents } from "../types";
import { WithPosition } from "./withPosition";
import { factory, createSelector, createSetter } from "../utils";
import { WithOffscreen } from "./withOffscreen";

const COMPONENT_NAMESPACE = 'momentum';

export type WithMomentum = { momentum: { direction: IVector; speed: number; vertical?: boolean; horizontal?: boolean; } };

export function withMomentumFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithMomentum, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithMomentum>>({
        id,
        entityId: entity.id,
        name:     COMPONENT_NAMESPACE,
        state: { momentum: {
          direction:    state.momentum.direction,
          speed:        state.momentum.speed,
        } },
        update: (system: ISystemManager, component: IWithMomentumEntity) => {
          handleMovement(entity, component, system);
        },
      }))
  }
}

type IWithMomentumEntity = IComponent<WithMomentum & Partial<WithPosition>>

function handleMovement(entity: IEntity, component: IWithMomentumEntity, system: ISystemManager) {
  const {state: { position }} = system.getEntityComponent<WithPosition>(entity, 'position');
  const {state: { offscreen }} = system.getEntityComponent<WithOffscreen>(entity, 'offscreen');

  if (offscreen) {
    return;
  }

  const { momentum: { direction, speed } } = component.state;

  position.y += direction.y * speed;
  position.x += direction.x * speed;
}

export const selectMomentumState = createSelector<WithMomentum>(COMPONENT_NAMESPACE);
export const setMomentumState    = createSetter<WithMomentum>(selectMomentumState);

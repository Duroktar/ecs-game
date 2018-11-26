import { IComponent, ISystemManager, IVector, IEntity } from "../types";
import { WithMovement } from "./moveable";
import { factory } from "../utils";

const COMPONENT_NAMESPACE = 'momentum';

export type WithMomentum = { momentum: { direction: IVector; speed: number; } };

export function withMomentumFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithMomentum, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithMomentum>>({
        id,
        entityId: entity.id,
        name: COMPONENT_NAMESPACE,
        state: { momentum: { direction: state.momentum.direction, speed: state.momentum.speed } },
        update: (system: ISystemManager, component: IWithMomentumEntity) => {
            handleMovement(entity, component, system);
        },
      }))
  }
}

type IWithMomentumEntity = IComponent<WithMomentum & Partial<WithMovement>>

function handleMovement(entity: IEntity, component: IWithMomentumEntity, system: ISystemManager) {
  const {state: { position }} = system.getEntityComponent<WithMovement>(entity, 'movement');

  const { momentum: { direction, speed } } = component.state;

  position.x += direction.x * speed;
  position.y += direction.y * speed;
}

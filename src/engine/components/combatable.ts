import { IComponent, ISystemManager, IEntity, IComponentEvents } from "../types";
import { factory, createSelector, createSetter } from "../utils";

const COMPONENT_NAMESPACE = 'attack';

export type WithAttack = { attacking: boolean; attackPower: number; };

export function combatableFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithAttack, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithAttack>>({
        id,
        entityId: entity.id,
        name: COMPONENT_NAMESPACE,
        state: { attacking: state.attacking, attackPower: state.attackPower },
        update: (system: ISystemManager, component: IAttackableEntity) => {
            handleAttack(component, system);
        },
      }))
  }
}

type IAttackableEntity = IComponent<WithAttack>

function handleAttack(component: IAttackableEntity, system: ISystemManager) {
  if (system.input.keyPressed(system.input.KeyCodes.SPACEBAR)) {
    component.state.attacking = true;
  } else {
    component.state.attacking = false;
  }
}

export const selectCombatableState = createSelector<IAttackableEntity>(COMPONENT_NAMESPACE);
export const setCombatableState    = createSetter<IAttackableEntity>(selectCombatableState);

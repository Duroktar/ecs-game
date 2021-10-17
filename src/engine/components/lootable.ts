import { IComponent, IEntity, IComponentEvents } from "../types";
import { ISystemManager } from "../interfaces/ISystemManager";
import { factory, createSelector, createSetter } from "../utils";
import { WithGeometry } from "./withGeometry";
import { WithPosition } from "./withPosition";

const COMPONENT_NAMESPACE = 'loot';

export type IsLootable<T extends any = {}> = { loot?: T; };

export function lootableFactory<T>(system: ISystemManager) {
  return (entity: IEntity, state: IsLootable<T>, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<IsLootable<T>>>({
        id,
        entityId: entity.id,
        name: COMPONENT_NAMESPACE,
        state: { loot: state.loot },
        update: (system: ISystemManager, component: LootableEntity) => null,
      }))
  }
}

export type LootableEntity<T extends any = {}> = IComponent<IsLootable<T> & WithGeometry & WithPosition>

export const selectLootableState = createSelector<LootableEntity>(COMPONENT_NAMESPACE);
export const setLootableState    = createSetter<LootableEntity>(selectLootableState);

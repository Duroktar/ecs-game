import { IComponent, ISystemManager, IEntity } from "../types";
import { factory, createSelector, createSetter } from "../utils";
import { WithGeometry } from "./withGeometry";
import { WithPosition } from "./moveable";

const COMPONENT_NAMESPACE = 'loot';

export type IsLootable<T extends any = {}> = { loot?: T; };

export function lootableFactory<T>(system: ISystemManager) {
  return (entity: IEntity, state: IsLootable<T>, id = -1) => {
    return system.registerComponent(
      factory<IComponent<IsLootable<T>>>({
        id,
        entityId: entity.id,
        name: COMPONENT_NAMESPACE,
        state: { loot: state.loot },
        update: (system: ISystemManager, component: LootableEntity) => {
          // handleCollisions(component, system);
        },
      }))
  }
}

export type LootableEntity<T extends any = {}> = IComponent<IsLootable<T> & WithGeometry & WithPosition>

export const selectLootableState = createSelector<LootableEntity>(COMPONENT_NAMESPACE);
export const setLootableState    = createSetter<LootableEntity>(selectLootableState);

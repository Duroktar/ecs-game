import { factory, isSameEntity } from "../utils";
import { IComponent, ISystemManager, IVector, IEntity, ISystem, EntityIdType } from "../types";

export type WithPosition = { position: IVector; }

export function movableFactory(system: ISystemManager) {
  return (entity: IEntity, position: IVector) => {
    return system.registerComponent(
      factory<IComponent<WithPosition>>({
        id: system.registerEntity().id,
        entityId: entity.id,
        state: { position },
        update: (system: ISystemManager, component: IComponent<WithPosition>) => { },
      }))
  }
}

export function selectMovableState(system: ISystem, entity: IEntity): null | IComponent<WithPosition> {
  const searchResult = system.components
    .filter(o =>
      isSameEntity(o, entity)
      && hasPosition(o.state)
    );
    if (searchResult.length === 0) {
      return null;
    };
    return first(searchResult);
}

export function setMovableState(system: ISystem, entity: IEntity, state: IVector) {
  const component = selectMovableState(system, entity);
  if (component === null) {
    return component;
  }
  component.state.position = state;
}

function hasPosition(state: any) {
  return state.position !== undefined;
}

function first<T>(array: T[]): T {
  return array[0];
}

import { IComponent, IEntity, ISystem, ISystemManager } from "../types";
import { isSameEntity, first, factory } from "../utils";

export type Setter<T> = (system: ISystem, entity: IEntity, state: T) => null | undefined;

export type Selector<T> = (system: ISystem, entity: IEntity) => null | IComponent<T>

export function createSelector<T>(path: string): Selector<T> {
  return (system: ISystem, entity: IEntity): null | IComponent<T> => {
    const searchResult = system
      .components
      .filter(o =>
        isSameEntity(o, entity)
        && hasState(path, o.state));

    if (searchResult.length === 0) {
      return null;
    };

    return first(searchResult);
  }
}

export function createSetter<T>(selector: Selector<T>): Setter<T> {
  return (system: ISystem, entity: IEntity, state: T) => {
    const component = selector(system, entity);

    if (component === null) {
      return component;
    }

    component.state = state;
  }
}

function hasState(path: string, state: any) {
  return state[path] !== undefined;
}

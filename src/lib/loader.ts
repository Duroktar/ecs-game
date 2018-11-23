import { componentFactory } from "./components";
import { ISerializableState, IComponent, ISystemManager, IComponentFactoryInitializer } from "./types";

export function saveState<T extends ISerializableState>(key: string, value: T): void {
  const serialized = JSON.stringify(value);
  window.localStorage.setItem(key, serialized);
}

export function loadStateFromKey(key: string): ISerializableState | null {
  const serialized = window.localStorage.getItem(key);

  if (!serialized) {
    return null;
  }

  return JSON.parse(serialized) as ISerializableState;
}

export function hydrateLoadedComponents(system: ISystemManager, state: ISerializableState): IComponent[] {
  const { system: { components } } = state;

  const componentInitializerCache: { [key: string]: IComponentFactoryInitializer } = {};

  return components.map((component: IComponent) => {
    const cached = componentInitializerCache[component.name];

    let componentInitializer: IComponentFactoryInitializer;

    if (cached) {
      componentInitializer = cached;
    } else {
      componentInitializer = componentFactory(component.name)(system);
      componentInitializerCache[component.name] = componentInitializer;
    }

    const entity = { id: component.entityId }
    return componentInitializer(entity, component.state);
  });
}

import { ISerializableState, IComponent, IComponentFactoryInitializer, IComponentFactory } from "../types";
import { IStorageManager } from "../interfaces/IStorageManager";
import { ISystemManager } from "../interfaces/ISystemManager";
import { defaultComponentEvents } from "../utils";

class StorageManager implements IStorageManager {
  constructor(
    private system: ISystemManager,
  ) {}

  public saveGame = () => {
    this.saveState('ecs', this.system.getSerializableState());
  }

  public loadGame = () => {
    const loadedFromStorage = this.loadStateFromKey('ecs');

    if (loadedFromStorage) {
      const hydratedComponents = this.hydrateLoadedComponents(this.system, loadedFromStorage);
      loadedFromStorage.system.components = hydratedComponents;

      this.system.loadHydratedState(loadedFromStorage);
    }
  }

  private saveState<T extends ISerializableState>(key: string, value: T): void {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
  }

  private loadStateFromKey(key: string): ISerializableState | null {
    const serialized = window.localStorage.getItem(key);

    if (!serialized) {
      return null;
    }

    return JSON.parse(serialized) as ISerializableState;
  }

  private hydrateLoadedComponents(system: ISystemManager, state: ISerializableState): IComponent[] {
    const { system: { components } } = state;

    const componentInitializerCache: { [key: string]: IComponentFactoryInitializer } = {};

    return components.map((component: IComponent) => {
      const cached = componentInitializerCache[component.name];

      let componentInitializer: IComponentFactoryInitializer;

      if (cached) {
        componentInitializer = cached;
      } else {
        componentInitializer = this.system.getComponentFactory(component.name)(system);
        componentInitializerCache[component.name] = componentInitializer;
      }

      const entity = { id: component.entityId }
      return componentInitializer(entity, component.state, defaultComponentEvents(), component.id); // !!! HACK FIX ME TODO ACHTUNG
    });
  }
}

export default StorageManager;

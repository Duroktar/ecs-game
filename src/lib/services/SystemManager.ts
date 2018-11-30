import { IComponent, ISystem, ISystemManager, EntityIdType, IConfigDefaults, IEntity, IdGeneratorFunc, WithId, IEntityComponents, ISerializableState, IInputManager, IStorageManager, IObjectConfig, IComponentFactory, IComponentFactories, IComponentFactoryKey, IEventManager } from "../types";
import InputManager from "./InputManager";
import StorageManager from "./StorageManager";
import { defaultComponentFactories } from "../components";
import { values, partialSetValue } from "../utils";
import ComponentManager from "./ComponentManager";
import EntityManager from "./EntityManager";
import EventManager from "./EventManager";

const configDefaults: IConfigDefaults = {
  debug: false,
  logging: true,
}

class SystemManager implements ISystemManager {
  public system:                ISystem;
  public config:                IObjectConfig;
  public input:                 IInputManager;
  public storage:               IStorageManager;
  public events:                IEventManager;
  public epoch:                 number;
  private entityComponents:     IEntityComponents;
  private componentFactories:   IComponentFactories;
  private entityManager:        EntityManager;
  private componentManager:     ComponentManager;

  private entityComponentCache:       { [key: string]: number[] } = {};
  private entityComponentSetter:      (path: (string | number)[], value: any) => void;

  constructor(
    config:              IObjectConfig,
    input?:              IInputManager,
    storage?:            IStorageManager,
    epochs?:             number,
  ) {
    this.config               = { ...configDefaults, ...config };
    this.input                = input ? input : new InputManager();
    this.storage              = storage ? storage : new StorageManager(this);
    this.events               = new EventManager(config);
    this.epoch                = epochs ? epochs : 0;
    
    this.componentFactories   = defaultComponentFactories;
    
    this.entityManager        = new EntityManager(config);
    this.componentManager     = new ComponentManager(config);
    this.entityComponents     = {};

    this.system = {
      entities:   this.entityManager.entities,
      components: this.componentManager.components,
    }

    this.entityComponentSetter = partialSetValue(this.entityComponents);
  }

  public init = (config?: IObjectConfig) => null;

  public registerEntity = () => {
    return this.entityManager.registerEntity();
  };

  public registerComponent = <T>(component: IComponent) => {
    const registered = this.componentManager
      .registerComponent<T>(component)

    this.entityComponentSetter(
      [registered.entityId, registered.name],
      registered.id,
    )

    return registered;
  };

  public getEntityModel = <T>(entity: IEntity): WithId<T> => {
    return groupEntityComponents<T>(entity, this.system.components);
  };

  public getComponent = <T>(component: IComponent): IComponent<T> => {
    return this.componentManager.get(component);
  };
  public getComponentById = <T>(componentId: EntityIdType): IComponent<T> => {
    return this.componentManager.get(componentId);
  };
  public getComponentIdsForEntity = (entity: IEntity): Array<EntityIdType> => {
    return values(this.entityComponents[entity.id]);
  };
  public getComponentFactory = (name: IComponentFactoryKey): IComponentFactory => {
    return this.componentFactories[name];
  };

  public unRegisterEntity = (entityId: EntityIdType) => {
    this.entityManager.unRegisterEntity(entityId);
  };
  public unRegisterComponent = (entityId: EntityIdType) => {
    this.componentManager.unRegisterComponent(entityId);
  };

  public getEntityComponent = <T>(entity: IEntity, componentName: string): IComponent<T> => {
    return this.getComponentById<T>(this.entityComponents[entity.id][componentName]);
  }
  public getEntitiesByComponentTypes = (componentNames: IComponentFactoryKey[]): EntityIdType[] => {
    const cacheKey = componentNames.join('-');

    if (this.entityComponentCache[cacheKey] !== undefined) {
      return this.entityComponentCache[cacheKey];
    }

    const isValidComponent = (component: IComponent) => componentNames.indexOf(component.name) !== -1;

    const entities: EntityIdType[] = [];
    
    for (let i = 0; i < this.system.entities.length; i++) {
      const entity = this.system.entities[i];
      const components = this.getComponentIdsForEntity(entity)
        .map(this.getComponentById)
        .filter(isValidComponent);

      if (components.length === componentNames.length) {
        entities.push(entity.id);
      }
    }

    this.entityComponentCache[cacheKey] = entities;

    return entities;
  }

  public getState = (): ISystem => {
    return this.system;
  };

  public getSerializableState = (): ISerializableState => {
    const { system, config, epoch, entityComponents } = this;
    return {
      system,
      config,
      epoch,
      entityComponents,
    };
  };

  public loadHydratedState = (state: ISerializableState) => {
    this.system = state.system;
    this.config = state.config;
    this.epoch  = state.epoch;
    this.entityComponents = state.entityComponents;
  };

  public step = () => {
    this.input.update();
    this.updateSystemEntities();
    this.entityComponentCache = {};
    this.epoch++;
    return this.system;
  };

  private updateSystemEntities = (): void => {
    this.system.entities.forEach(this.updateComponentsForEntity)
  }

  private updateComponentsForEntity = (entity: IEntity): void => {
    this.getComponentIdsForEntity(entity)
      .map(this.componentManager.get)
      .forEach(this.updateComponent);
  }

  private updateComponent = (o: IComponent) => o.update(this, o);

  public toString = () => {
    return JSON.stringify({
      system: this.system,
      config: this.config,
    }, null, '  ')
  };
}

export default SystemManager;

function groupEntityComponents<T>(entity: IEntity, components: IComponent[]) {
  return components
    .filter(o => o && o.entityId === entity.id)
    .reduce((acc, val) => {
      return { ...acc, ...val.state };
    }, { id: entity.id }) as WithId<T>;
}

import { IComponent, ISystem, ISystemManager, EntityIdType, IConfigDefaults, IEntity, WithId, IEntityComponents, ISerializableState, IInputManager, IStorageManager, IObjectConfig, IComponentFactory, IComponentFactories, IComponentFactoryKey, IEventManager, IAudioManager } from "../types";
import AudioManager from "./AudioManager";
import ComponentManager from "./ComponentManager";
import EntityManager from "./EntityManager";
import EventManager from "./EventManager";
import InputManager from "./InputManager";
import StorageManager from "./StorageManager";

import { defaultComponentFactories } from "../components";
import { values, partialSetValue } from "../utils";

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
  public audio:                 IAudioManager;
  public epoch:                 number;

  private entityComponents:     IEntityComponents;
  private componentFactories:   IComponentFactories;
  private entityManager:        EntityManager;
  private componentManager:     ComponentManager;

  private entityModelCache:       { [key: string]: Array<IComponent> } = {};
  private entityComponentCache:   { [key: string]: number[] } = {};
  private entityComponentSetter:  (path: (string | number)[], value: any) => void;

  constructor(
    config:              IObjectConfig,
    input?:              IInputManager,
    epochs?:             number,
  ) {
    this.config               = { ...configDefaults, ...config };
    this.input                = input ? input : new InputManager();
    this.storage              = new StorageManager(this);
    this.events               = new EventManager(config);
    this.audio                = new AudioManager(config);
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

  public getComponent = <T>(component: IComponent): IComponent<T> => {
    return this.componentManager.get(component);
  };
  public getComponentById = <T>(componentId: EntityIdType): IComponent<T> => {
    return this.componentManager.get(componentId);
  };
  public getComponentIdsForEntity = (entity: IEntity): Array<EntityIdType> => {
    if(entity === undefined) {
      return [];
    }
    return values(this.entityComponents[entity.id]);
  };
  public getComponentsForEntity = (entity: IEntity): Array<IComponent> => {
    return this.getComponentIdsForEntity(entity)
      .map(this.componentManager.get);
  };
  public getComponentFactory = (name: IComponentFactoryKey): IComponentFactory => {
    return this.componentFactories[name];
  };
  private getCachedComponentsForEntity = (entity: IEntity): Array<IComponent> => {

    const cached = this.entityModelCache[entity.id];

    if (cached) {
      return cached;
    }

    const entityModels = this.getComponentsForEntity(entity);

    this.entityModelCache[entity.id] = entityModels;

    return entityModels;
  }

  public unRegisterEntity = (entityId: EntityIdType) => {
    this.unRegisterComponentsForEntity(entityId);
    this.deleteEntityComponents(entityId);
    this.clearEntityComponentCache();
    this.clearEntityModelCache();
    this.entityManager.unRegisterEntity(entityId);
  };
  public unRegisterComponent = (entityId: EntityIdType) => {
    this.componentManager.unRegisterComponent(entityId);
  };
 
  private unRegisterComponentsForEntity = (entityId: EntityIdType) => {
    const componentIds = this.getComponentIdsForEntity({ id: entityId });
    componentIds.forEach(id => this.componentManager.unRegisterComponent(id));
  };
  private deleteEntityComponents = (entityId: EntityIdType) => {
    delete this.entityComponents[entityId];
  };
  private clearEntityComponentCache = () => {
    delete this.entityComponentCache;
    this.entityComponentCache = {};
  };
  private clearEntityModelCache = () => {
    delete this.entityModelCache;
    this.entityModelCache = {};
  };

  public getEntityComponent = <T>(entity: IEntity, componentName: string): IComponent<T> => {
    return this.getComponentById<T>(this.entityComponents[entity.id][componentName]);
  }
  public getEntityModel = <T>(entity: IEntity): WithId<T> => {
    return groupEntityComponents<T>(entity, this.system.components);
  };
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

  public step = () => {
    this.input.update();
    this.updateSystemEntities();
    this.entityComponentCache = {};
    this.epoch++;
    return this.system;
  };
  private updateSystemEntities = (): void => {
    this.system.entities.forEach(this.updateComponentsForEntity);
  }
  private updateComponentsForEntity = (entity: IEntity): void => {
    const components = this.getCachedComponentsForEntity(entity);
    for (let i = 0; i < components.length; i++) {
      this.updateComponent(components[i])
    }
  }
  private updateComponent = (o: IComponent) => o.update(this, o);

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

  public getState = (): ISystem => {
    return this.system;
  };

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

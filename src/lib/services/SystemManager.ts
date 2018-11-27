import { IComponent, ISystem, ISystemManager, EntityIdType, IConfigDefaults, IEntity, IdGeneratorFunc, WithId, IEntityComponents, ISerializableState, IInputManager, IStorageManager, IObjectConfig, IComponentFactory, IComponentFactories, IComponentFactoryKey } from "../types";
import InputManager from "./InputManager";
import StorageManager from "./StorageManager";
import { defaultComponentFactories } from "../components";
import { defaultIdGenerator, factory, isSameEntity, values } from "../utils";

const configDefaults: IConfigDefaults = {
  debug: false,
  logging: true,
}

class SystemManager implements ISystemManager {
  public system:                ISystem;
  public config:                IObjectConfig;
  public input:                 IInputManager;
  public storage:               IStorageManager;
  public epoch:                 number;
  private entityComponents:     IEntityComponents;
  private entityIdGenerator:    IdGeneratorFunc;
  private componentIdGenerator: IdGeneratorFunc;
  private componentFactories:   IComponentFactories;

  private entityComponentCache:       { [key: string]: number[] } = {};
  private entityComponentCacheBuster: number = 0;

  constructor(
    system:              ISystem,
    config:              IObjectConfig,
    input?:              IInputManager,
    storage?:            IStorageManager,
    epochs?:             number,
    idGenerator?:        (begin?: number) => IdGeneratorFunc,
    entityComponents?:   IEntityComponents,
  ) {
    this.system               = system;
    this.config               = { ...configDefaults, ...config };
    this.input                = input ? input : new InputManager();
    this.storage              = storage ? storage : new StorageManager(this);
    this.epoch                = epochs ? epochs : 0;
    this.entityComponents     = entityComponents ? entityComponents : {};
    this.entityIdGenerator    = idGenerator ? idGenerator(this.epoch) : defaultIdGenerator(this.epoch);
    this.componentIdGenerator = defaultIdGenerator(this.epoch);
    this.componentFactories   = defaultComponentFactories;
  }

  public init = (config?: IObjectConfig) => null;

  public registerEntity = () => {
    const entityId = this.entityIdGenerator().next()
    const model    = factory<IEntity>({ id: entityId });
    this.system.entities[entityId] = model;
    this.entityComponents[entityId] = {};
    return model;
  };

  public registerComponent = (component: IComponent) => {
    component.id = (component.id === -1)
      ? this.componentIdGenerator().next()
      : component.id;

    this.system.components[component.id] = component;
    this.entityComponents[component.entityId][component.name] = component.id;
    return component;
  };

  public getEntityModel = <T>(entity: IEntity): WithId<T> => {
    const { components } = this.system;
    return components
      .filter(o => o && o.entityId === entity.id)
      .reduce((acc, val) => {
        return { ...acc, ...val.state };
      }, { id: entity.id }) as WithId<T>;
  };

  public getComponent = <T>(component: IComponent): IComponent<T> => {
    return this.system.components[component.id];
  };
  public getComponentById = <T>(componentId: EntityIdType): IComponent<T> => {
    return this.system.components[componentId];
  };
  public getComponentIdsForEntity = (entity: IEntity): Array<EntityIdType> => {
    return values(this.entityComponents[entity.id]);
  };
  public getComponentFactory = (name: IComponentFactoryKey): IComponentFactory => {
    return this.componentFactories[name];
  };

  public unRegisterEntity = (entityId: EntityIdType) => {
    delete this.system.entities[entityId];
  };
  public unRegisterComponent = (entityId: EntityIdType) => {
    delete this.system.components[entityId];
  };

  public getEntityComponent = <T>(entity: IEntity, componentName: string): IComponent<T> => {
    const id = this.entityComponents[entity.id][componentName];
    return this.getComponentById(id);
  }
  public getEntitiesByComponentTypes = (componentNames: IComponentFactoryKey[]): EntityIdType[] => {
    const cacheKey = componentNames.join('-');

    if (this.entityComponentCache[cacheKey] !== undefined) {
      return this.entityComponentCache[cacheKey];
    }

    const entities = this.system.entities.reduce((acc: EntityIdType[], entity) => {
      const components = this.getComponentIdsForEntity(entity)
        .map(this.getComponentById)
        .filter(o => componentNames.indexOf(o.name) !== -1);

      if (components.length === componentNames.length) {
        return acc.concat(entity.id);
      }
      return acc;
    }, []);

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
    const componentDoUpdate = (o: IComponent) => o.update(this, o);

    this.getComponentIdsForEntity(entity)
      .map(id => this.system.components[id])
      .forEach(componentDoUpdate);
  }

  public toString = () => {
    return JSON.stringify({
      system: this.system,
      config: this.config,
    }, null, '  ')
  };

  static isSameEntity(a: IEntity, b: IEntity) {
    return isSameEntity(a, b);
  }
}

export default SystemManager;

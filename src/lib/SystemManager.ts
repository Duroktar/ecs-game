import { IComponent, ISystem, IConfig, ISystemManager, EntityIdType, IConfigDefaults, IEntity, IdGeneratorFunc, WithId, IKeyboard, IEntityComponents, ValueOf, ISerializableState } from "./types";
import { factory, isSameEntity, values } from "./utils";
import { Keyboard } from "../extern/Keyboard";

const defaultIdGenerator = (genesis: number = 0): IdGeneratorFunc => {
  let epoch: number = genesis;
  return () => ({ next: () => epoch++ })
}

const configDefaults: IConfigDefaults = {
  debug: false,
  logging: true,
}

class SystemManager implements ISystemManager {
  public system: ISystem;
  public config: IConfig;
  public keyboard: IKeyboard;
  public epoch: number;
  private entityComponents: IEntityComponents;
  private entityIdGenerator: IdGeneratorFunc;
  private componentIdGenerator: IdGeneratorFunc;

  constructor(system: ISystem, config: IConfig, keyboard?: Keyboard, epochs?: number, idGenerator?: (begin?: number) => IdGeneratorFunc, entityComponents?: IEntityComponents) {
    this.system = system;
    this.config = { ...configDefaults, ...config };
    this.keyboard = keyboard ? keyboard : new Keyboard();
    this.epoch = epochs ? epochs : 0;
    this.entityIdGenerator = idGenerator ? idGenerator(this.epoch) : defaultIdGenerator(this.epoch);
    this.entityComponents = entityComponents ? entityComponents : {};
    this.componentIdGenerator = defaultIdGenerator(this.epoch);
  }

  public init = (config?: IConfig) => null;

  public registerEntity = () => {
    const entityId = this.entityIdGenerator().next()
    const model = factory<IEntity>({ id: entityId });
    this.system.entities[entityId] = model;
    this.entityComponents[entityId] = {};
    return model;
  };
  public registerComponent = (component: IComponent) => {
    component.id = (component.id === -1)
      ? this.componentIdGenerator().next()
      : component.id;

    const model = factory<IComponent>(component);
    this.system.components[component.id] = model;
    this.entityComponents[component.entityId][component.name] = component.id;
    return model;
  };

  public getEntityModel = <T>(entity: IEntity): WithId<T> => {
    const { components } = this.system;
    return components
      .filter(o => o && o.entityId === entity.id)
      .reduce((acc, val) => {
        return { ...acc, ...val.state };
      }, { id: entity.id }) as WithId<T>;
  };
  public getComponent = (component: IComponent) => {
    return this.system.components[component.id];
  };
  public getComponentById = (componentId: EntityIdType) => {
    return this.system.components[componentId];
  };
  public getComponentsForEntity = (entity: IEntity): Array<EntityIdType> => {
    return values(this.entityComponents[entity.id]);
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
    this.epoch = state.epoch;
    this.entityComponents = state.entityComponents;
  };

  public step = () => {
    this.keyboard.update();
    this.updateSystemEntities();
    this.epoch++;
    return this.system;
  };

  private updateSystemEntities = (): void => {
    this.system.entities.forEach(this.updateComponentsForEntity)
  }

  private updateComponentsForEntity = (entity: IEntity): void => {
    const callUpdate = (o: IComponent) => o.update(this, o);
    const componentIds = this.getComponentsForEntity(entity);

    componentIds
      .map(id => this.system.components[id])
      .forEach(callUpdate);
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

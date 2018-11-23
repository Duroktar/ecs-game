import { IComponent, ISystem, IConfig, ISystemManager, EntityIdType, IConfigDefaults, IEntity, IdGeneratorFunc, WithId, IKeyboard } from "./types";
import { factory, isSameEntity } from "./utils";
import { DeepReadonly } from "../react-app-env";
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
  private idGenerator: IdGeneratorFunc;

  constructor(system: ISystem, config: IConfig, idGenerator?: IdGeneratorFunc, keyboard?: Keyboard) {
    this.system = system;
    this.config = { ...configDefaults, ...config };
    this.keyboard = keyboard ? keyboard : new Keyboard();
    this.idGenerator = idGenerator ? idGenerator : defaultIdGenerator();
  }

  public init = (config?: IConfig) => null;

  public registerEntity = () => {
    const entityId = this.idGenerator().next()
    const model = factory<IEntity>({ id: entityId });
    this.system.entities[entityId] = model;
    return model;
  };
  public registerComponent = (component: IComponent) => {
    const model = factory<IComponent>(component);
    this.system.components[component.id] = model;
    return model;
  };

  public getModelForEntity = <T>(entity: IEntity): DeepReadonly<WithId<T>> => {
    const { components } = this.system;
    return components
      .filter(o => o.entityId === entity.id)
      .reduce((acc, val) => {
        return { ...acc, ...val.state };
      }, { id: entity.id }) as DeepReadonly<WithId<T>>;
  };
  public getComponent = (component: IComponent) => {
    return this.system.components[component.id];
  };
  public getComponentById = (componentId: EntityIdType) => {
    return this.system.components[componentId];
  };

  public unRegisterEntity = (entityId: EntityIdType) => {
    delete this.system.entities[entityId];
  };
  public unRegisterComponent = (entityId: EntityIdType) => {
    delete this.system.components[entityId];
  };

  public getState = () => this.system;

  public step = () => {
    this.keyboard.update();
    const callUpdate = (o: IComponent) => o.update(this, o);
    this.system.components.forEach(callUpdate)
    return this.system;
  };

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

import { EntityIdType, IEntity, IdGeneratorFunc, IBasicConfig } from "../types";
import { defaultIdGenerator, factory } from "../utils";

interface IEntityManagerSerializableState {
  config:   IBasicConfig,
  entities: IEntity[],
}

const configDefaults = {
  name: 'EntityManager',
  debug: true,
  logging: true,
  version: '1',
}

class EntityManager {
  public config:              IBasicConfig;
  public entities:           IEntity[];
  private idGenerator:        IdGeneratorFunc;
  constructor(config: IBasicConfig) {
    this.config      = { ...configDefaults, ...config };
    this.entities    = [];
    this.idGenerator = defaultIdGenerator();
  }

  public init = (config?: IBasicConfig) => null;

  public registerEntity = (): IEntity => {
    const entityId = this.idGenerator().next()
    const model    = factory<IEntity>({ id: entityId });
    this.entities[entityId] = model;
    return model;
  };

  public unRegisterEntity = (entityId: EntityIdType): void => {
    delete this.entities[entityId];
  };

  public get = (entity: IEntity | number) => {
    const path = typeof entity === 'number' ? entity : entity.id;
    return this.entities[path];
  };

  public get getState(): IEntity[] {
    return this.entities;
  };

  public getSerializableState = (): IEntityManagerSerializableState => {
    const { config, entities } = this;
    return {
      config,
      entities,
    };
  };

  public loadHydratedState = (state: IEntityManagerSerializableState): void => {
    this.config  = state.config;
    this.entities = state.entities;
  };

  public toString = (): string => {
    return JSON.stringify({
      config:   this.config,
      entities: this.entities,
    }, null, '  ')
  };

  static isSameEntity(a: IEntity, b: IEntity): boolean {
    return a.id === b.id;
  }
}

export default EntityManager;

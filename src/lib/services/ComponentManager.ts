import { IComponent, IdGeneratorFunc, EntityIdType, IBasicConfig } from "../types";
import { defaultIdGenerator, factory } from "../utils";

const configDefaults = {
  name: 'componentManager',
  debug: true,
  logging: true,
  version: '1',
}

class ComponentManager {
  public config:             IBasicConfig;

  public components:        IComponent[];
  private idGenerator:       IdGeneratorFunc;

  constructor(config: IBasicConfig) {
    this.config      = { ...configDefaults, ...config };
    this.components  = [];
    this.idGenerator = defaultIdGenerator();
  }

  public init = (config?: IBasicConfig) => null;

  public registerComponent = <T>(component: IComponent<T>) => {
    component.id = (component.id === -1)
      ? this.idGenerator().next()
      : component.id;

    const model = factory<IComponent>(component);
    this.components[component.id] = model;
    return model;
  };

  public unRegisterComponent = (componentId: EntityIdType) => {
    delete this.components[componentId];
  };

  public get = <T>(component: IComponent<T> | number) => {
    const path = typeof component === 'number' ? component : component.id;
    return this.components[path];
  };

  public get getState(): IComponent[] {
    return this.components;
  };

  public getSerializableState = () => {
    const { config, components } = this;
    return {
      config,
      components,
    };
  };

  public loadHydratedState = (state: any) => {
    this.config     = state.config;
    this.components = state.components;
  };

  public toString = () => {
    return JSON.stringify({
      config:     this.config,
      components: this.components,
    }, null, '  ')
  };

  static isSameComponent(a: IComponent, b: IComponent) {
    return a.id === b.id;
  }
}

export default ComponentManager;

// const manager = new ComponentManager(system.system, configDefaults, [], defaultIdGenerator());

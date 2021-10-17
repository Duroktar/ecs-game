import { ISystem, IObjectConfig, IEntity, EntityIdType, IComponent, IComponentFactoryKey, IComponentFactory, WithComponentMeta, ISerializableState } from "../types";
import { IStorageManager } from "./IStorageManager";
import { IInputManager } from "./IInputManager";
import { IAudioManager } from "./IAudioManager";
import { IEventManager } from "./IEventManager";

export interface ISystemManager {
  system: ISystem;
  config: IObjectConfig;
  epoch: number;
  input: IInputManager;
  storage: IStorageManager;
  events: IEventManager;
  audio: IAudioManager;
  init: (config?: IObjectConfig) => void;
  registerEntity: () => IEntity;
  unRegisterEntity: (entityId: EntityIdType) => void;
  registerComponent: <T>(component: IComponent<T>) => IComponent<T>;
  registerComponents: (...components: IComponent[]) => IComponent[];
  unRegisterComponent: (entityId: EntityIdType) => void;
  getComponent: <T>(component: IComponent<T>) => IComponent<T>;
  getComponentById: <T>(componentId: EntityIdType) => IComponent<T>;
  getComponentFactory: (name: IComponentFactoryKey) => IComponentFactory;
  getEntityComponent: <T>(entity: IEntity, componentName: IComponentFactoryKey) => IComponent<T>;
  getEntitiesByComponentTypes: (componentNames: IComponentFactoryKey[]) => EntityIdType[];
  getEntityModel: <T>(entity: IEntity) => WithComponentMeta<T>;
  getSerializableState: () => ISerializableState;
  loadHydratedState: (serialized: ISerializableState) => void;
  getState: () => ISystem;
  step: () => ISystem;
  toString: () => string;
}

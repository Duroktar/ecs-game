import { DeepReadonly } from "../react-app-env";
import { nameableFactory } from "./components/nameable";
import { controllableFactory } from "./components/controllable";
import { ageableFactory } from "./components/ageable";
import { movableFactory } from "./components/moveable";
import { killableFactory } from "./components/killable";
import { KeysEnum } from "./utils";
import { Keyboard } from "../extern/Keyboard";

export interface IEntity {
  id: EntityIdType;
}

export interface IFactoryComponent<T = any> extends IUpdateable {
  entityId: EntityIdType;
  name:     IComponentFactoryKey;
  state:    T;
}

export interface IComponent<T = any> extends IFactoryComponent<T> {
  id: EntityIdType;
}

export interface ISystem {
  entities:   IEntity[];
  components: IComponent[];
}

export interface ISerializableState {
  system:           ISystem;
  config:           IObjectConfig;
  epoch:            number;
  entityComponents: IEntityComponents;
}

export type IComponentFactory = (system: ISystemManager) => IComponentFactoryInitializer;
export type IComponentFactoryInitializer = (entity: IEntity, args: any, id?: number) => IComponent;

export interface IComponentFactories {
  name:      IComponentFactory;
  health:    IComponentFactory;
  movement:  IComponentFactory;
  age:       IComponentFactory;
  controls:  IComponentFactory;
  attack:    IComponentFactory;
  momentum:  IComponentFactory;
  offscreen: IComponentFactory;
  geometry:  IComponentFactory;
}

export type IComponentFactoryKey = keyof IComponentFactories;

type EntityIdType = number;

export interface IUpdateable {
  update: <T extends IComponent>(system: ISystemManager, component: T) => void;
}

export interface ISystemManager {
  system: ISystem;
  config: IObjectConfig;
  epoch: number;
  input: IInputManager;
  storage: IStorageManager;

  init: (config?: IObjectConfig) => void;

  registerEntity: () => IEntity;
  registerComponent: <T>(component: IComponent<T>) => IComponent<T>;
  getComponent: <T>(component: IComponent<T>) => IComponent<T>;
  getComponentById: <T>(componentId: EntityIdType) => IComponent<T>;
  getComponentFactory: (name: string) => IComponentFactory;
  getEntityComponent: <T>(entity: IEntity, componentName: string) => IComponent<T>;
  getEntityModel: <T>(entity: IEntity) => DeepReadonly<WithId<T>>;

  getSerializableState: () => ISerializableState;
  loadHydratedState: (serialized: ISerializableState) => void;

  getState: () => ISystem;
  step: () => ISystem;

  toString: () => string;
}

export type ITypes =
  IEntity |
  IComponent |
  ISystem |
  IConfig |
  IKeyStatus |
  IFactoryComponent;

export type WithId<T> = T & IEntity;

export interface IEntityComponents {
  [key: string]: {
    [key: string]: EntityIdType;
  }
}

export type IConfig = IObjectConfig | IFileConfig;
export type IConfigDefaults = PickOptionalProps<IObjectConfig>;

export interface IObjectConfig {
  name: string;
  version: string;
  logging?: boolean;
  debug?: boolean;
  screenSize?: {
    x: number;
    y: number;
  }
}

export interface IFileConfig {
  pathToConfigFile?: string;
}

export type IdGenerator = { next: () => EntityIdType };
export type IdGeneratorFunc = (args?: any) => IdGenerator;

export type IVector = { x: number; y: number; }

export type ValueOf<T> = T[keyof T]

type PickOptionalProps<T> = Pick<T,
  { [K in keyof T]-?:
    ({} extends { [P in K]: T[K] } ? K : never)
  }[keyof T]>

export type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any ? U : any;
export type SecondArgument<T> = T extends (arg1: any, arg2: infer U, ...args: any[]) => any ? U : any;


export interface IKeyStatus {
  pressed: KeysEnum[] | never[];
}

export interface IMouse {
  buttonPressed: (button: number) => boolean;

  update: () => void;
}

export interface IKeyboard {
  keyPressed: (key: number) => boolean;
  keyJustPressed: (key: number) => boolean;
  keyJustReleased: (key: number) => boolean;

  update: () => void;
}

export interface IInputManager {
  KeyCodes: typeof Keyboard;
  buttonPressed: (button: number) => boolean;

  keyPressed: (key: number) => boolean;
  keyJustPressed: (key: number) => boolean;
  keyJustReleased: (key: number) => boolean;

  update: () => void;
}

export interface IStorageManager {
  saveGame: () => void;
  loadGame: () => void;
}


interface IKeyboard {
  update: () => void;
  reset: () => void;
  keyPressed: (key: number) => boolean;
  keyJustPressed: (key: number) => boolean;
  keyJustReleased: (key: number) => boolean;
  dispose: () => void;
}

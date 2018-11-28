import { Keyboard } from "../extern/Keyboard";
import { KeysEnum } from "./utils";

export interface IEntity {
  id: EntityIdType;
}

export type IEntityModel<T> = Partial<IEntity> & T;

export interface IOwned {
  entityId: EntityIdType;
}

export interface IFactoryComponent<T = any> extends IUpdateable, IOwned {
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

export type IComponentFactory            = (system: ISystemManager) => IComponentFactoryInitializer;
export type IComponentFactoryInitializer = (entity: IEntity, args: any, id?: number) => IComponent;

export interface IComponentFactories {
  name:         IComponentFactory;
  health:       IComponentFactory;
  position:     IComponentFactory;
  age:          IComponentFactory;
  controls:     IComponentFactory;
  attack:       IComponentFactory;
  momentum:     IComponentFactory;
  offscreen:    IComponentFactory;
  geometry:     IComponentFactory;
  collisions:   IComponentFactory;
  collidable:   IComponentFactory;
  loot:         IComponentFactory;
}

export type IComponentFactoryKey = keyof IComponentFactories;

type EntityIdType = number;

export interface IUpdateable {
  update: <T extends IComponent>(system: ISystemManager, component: T) => void;
}

export interface ISystemManager {
  system:     ISystem;
  config:     IObjectConfig;
  epoch:      number;
  input:      IInputManager;
  storage:    IStorageManager;

  init: (config?: IObjectConfig) => void;

  registerEntity:                 () => IEntity;
  registerComponent:              <T>(component: IComponent<T>) => IComponent<T>;
  getComponent:                   <T>(component: IComponent<T>) => IComponent<T>;
  getComponentById:               <T>(componentId: EntityIdType) => IComponent<T>;
  getComponentFactory:            (name: IComponentFactoryKey) => IComponentFactory;
  getEntityComponent:             <T>(entity: IEntity, componentName: IComponentFactoryKey) => IComponent<T>;
  getEntitiesByComponentTypes:    (componentNames: IComponentFactoryKey[]) => EntityIdType[];
  getEntityModel:                 <T>(entity: IEntity) => WithComponentMeta<T>;

  getSerializableState:   () => ISerializableState;
  loadHydratedState:      (serialized: ISerializableState) => void;

  getState: () => ISystem;
  step:     () => ISystem;

  toString: () => string;
}

export type ITypes =
  IEntity     |
  IComponent  |
  ISystem     |
  IConfig     |
  IKeyStatus  |
  IFactoryComponent;

export type WithId<T>            = T & IEntity;
export type WithComponentMeta<T> = IOwned & WithId<T>;

export interface IEntityComponents {
  [key: string]: {
    [key: string]: EntityIdType;
  }
}

export type IConfig         = IObjectConfig | IFileConfig;
export type IConfigDefaults = PickOptionalProps<IObjectConfig>;

export interface IObjectConfig {
  name:     string;
  version:  string;
  logging?: boolean;
  debug?:   boolean;
  screenSize?: {
    x: number;
    y: number;
  }
}

export interface IFileConfig {
  pathToConfigFile?: string;
}

export type IdGenerator     = { next: () => EntityIdType };
export type IdGeneratorFunc = (args?: any) => IdGenerator;

export type ValueOf<T> = T[keyof T]

type PickOptionalProps<T> = Pick<T,
  { [K in keyof T]-?:
    ({} extends { [P in K]: T[K] } ? K : never)
  }[keyof T]>

export type FirstArgument<T>  = T extends (arg1: infer U, ...args: any[]) => any ? U : any;
export type SecondArgument<T> = T extends (arg1: any, arg2: infer U, ...args: any[]) => any ? U : any;


export interface IKeyStatus {
  pressed: KeysEnum[] | never[];
}

export interface IMouse {
  buttonPressed:  (button: number) => boolean;

  update:         () => void;
}

export interface IKeyboard {
  keyPressed:       (key: number) => boolean;
  keyJustPressed:   (key: number) => boolean;
  keyJustReleased:  (key: number) => boolean;

  update:           () => void;
}

export interface IInputManager {
  KeyCodes:         typeof Keyboard;
  buttonPressed:    (button: number) => boolean;

  keyPressed:       (key: number) => boolean;
  keyJustPressed:   (key: number) => boolean;
  keyJustReleased:  (key: number) => boolean;

  update:           () => void;
}

export interface IStorageManager {
  saveGame: () => void;
  loadGame: () => void;
}


interface IKeyboard {
  update:           () => void;
  reset:            () => void;
  keyPressed:       (key: number) => boolean;
  keyJustPressed:   (key: number) => boolean;
  keyJustReleased:  (key: number) => boolean;
  dispose:          () => void;
}

export interface IVector {
  x:    number;
  y:    number;
}

export interface IDimensions {
  width:    number;
  height:   number;
}

export interface Bounds {
  left:     number;
  right:    number;
  top:      number;
  bottom:   number;
}

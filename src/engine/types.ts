import { KeysEnum } from "./utils";
import { ISystemManager } from "./interfaces/ISystemManager";

export interface IEntity {
  id: EntityIdType;
}

export type IEntityModel<T> = Partial<IEntity> & T;

export interface IComponent<T = any> extends IFactoryComponent<T> {
  id: EntityIdType;
}

export interface IOwned {
  entityId: EntityIdType;
}

export interface IFactoryComponent<T = any> extends IUpdateable, IOwned {
  name:     IComponentFactoryKey;
  state:    T;
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
export type IComponentFactoryInitializer = (entity: IEntity, args: any, events: IComponentEvents, id?: number) => IComponent;

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
  boundary:     IComponentFactory;
  texture:      IComponentFactory;
  wiggle:       IComponentFactory;
  homePosition: IComponentFactory;
  worldwrap:    IComponentFactory;
}

export type IComponentFactoryKey = keyof IComponentFactories;

export type EntityIdType = number;

export interface IUpdateable {
  update: <T extends IComponent>(system: ISystemManager, component: T) => void;
}

export interface IAudioCollection {
  [key: string]: Howl;
}

export interface IAudioCollectionInitializer {
  [key: string]: string;
}

export type AnonymousCB = (...args: any) => void;

export type ITypes =
  IEntity     |
  IComponent  |
  ISystem     |
  IConfig     |
  IKeyStatus  |
  IFactoryComponent;

export type WithId<T>            = T & IEntity;
export type WithComponentMeta<T> = WithId<T> & IOwned;

export interface IEntityComponents {
  [key: string]: {
    [key: string]: EntityIdType;
  }
}

export type IOnUpdateHandler = (component: IComponent, entity: IEntity) => void;
export type IOnChangeHandler = (eventName: string, component: IComponent, entity: IEntity) => void;

export interface IComponentEvents {
  onUpdate: IOnUpdateHandler;
  onChange: IOnChangeHandler;
}

export type IConfig         = IObjectConfig | IFileConfig;
export type IConfigDefaults = PickOptionalProps<IObjectConfig>;

export interface IBasicConfig {
  name:     string;
  version:  string;
}

export interface IDevConfig {
  logging?: boolean;
  debug?:   boolean;
}

export interface IObjectConfig extends IBasicConfig, IDevConfig {
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
  reset:            () => void;
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

export type BoundedTouchingState = FromIndex<BoundedTouchingStateKeys, boolean>;

export type BoundedTouchingStateKeys = IBoundedTouchingStateKeys & string;
export type IBoundedTouchingStateKeys = 'top' | 'left' | 'right' | 'bottom';

export type FromIndex<K extends string, T> = { [key in K]: T }

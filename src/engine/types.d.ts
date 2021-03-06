import { Keyboard } from "../extern/Keyboard";
import { KeysEnum } from "./utils";
import AudioManager from "./services/AudioManager";

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
  events:     IEventManager;
  audio:      IAudioManager;

  init: (config?: IObjectConfig) => void;

  registerEntity:                 () => IEntity;
  unRegisterEntity:               (entityId: EntityIdType) => void;
  registerComponent:              <T>(component: IComponent<T>) => IComponent<T>;
  unRegisterComponent:            (entityId: EntityIdType) => void;
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

export interface IEventManager extends IComponentEvents {
  config:        IBasicConfig;

  init: (config?: IBasicConfig) => null;

  registerListener: (name: string, callback: AnonymousCB) => void;
  unRegisterListener: (name: string, callback: AnonymousCB) => void;

  emit: <T>(name: string, data?: T) => void;

  onUpdate: (component: IComponent, entity: IEntity) => void;

  onChange: (eventName: string, component: IComponent, entity: IEntity) => void;
}

export interface IAudioManager {
  config:                   IBasicConfig;
  sounds:                   { [key: string]: Howl };
  songs:                    { [key: string]: Howl };

  registerSound:            (name: string, options: IHowlProperties) => void;
  unRegisterSound:          (name: string) => void;
  registerSong:             (name: string, options: IHowlProperties) => void;
  unRegisterSong:           (name: string) => void;

  playSound:                (name: string, sprite?: string | number) => void;
  stopSound:                (name: string, id?: number) => void;
  playSong:                 (name: string, sprite?: string | number) => void;
  stopSong:                 (name: string, id?: number) => void;
  
  changeVolume:             (volume: number) => void;

  registerListener:         (name: string, event: string, callback: (soundId: number) => void) => void;
  registerOnceListener:     (name: string, event: string, callback: (soundId: number) => void) => void;
  unRegisterListener:       (name: string, event: string, callback: (soundId: number) => void) => void;
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

interface IComponentEvents {
  onUpdate: IOnUpdateHandler;
  onChange: IOnChangeHandler;
}

export type IConfig         = IObjectConfig | IFileConfig;
export type IConfigDefaults = PickOptionalProps<IObjectConfig>;

export interface IBasicConfig extends Partial<IDevConfig>{
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

export type BoundedTouchingState = FromIndex<BoundedTouchingStateKeys, boolean>;

export type BoundedTouchingStateKeys = IBoundedTouchingStateKeys & string;
export type IBoundedTouchingStateKeys = 'top' | 'left' | 'right' | 'bottom';

export type FromIndex<K extends string, T> = { [key in K]: T }

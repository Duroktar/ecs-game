import { DeepReadonly } from "../react-app-env";
import { KeysEnum } from "./keys";

type EntityIdType = number;

export interface IEntity {
  id: EntityIdType;
}

export interface IComponent<T = any> extends IEntity, IUpdateable<T> {
  entityId: EntityIdType;
  state: T;
}


export interface ISystem {
  entities: IEntity[];
  components: IComponent[];
}

export interface IUpdateable<T> {
  update: (system: ISystemManager, component: IComponent<T>) => void;
}


export type ITypes =
  IEntity |
  IComponent |
  ISystem |
  IConfig |
  ISystemComponentMap |
  IKeyStatus;

export type WithId<T> = T & IEntity;

export interface ISystemComponentMap {
  [key: string]: EntityIdType;
}


export interface ISystemManager {
  system: ISystem;
  config: IConfig;
  keyboard: IKeyboard;

  init: (config?: IConfig) => void;

  registerEntity: () => IEntity;
  getModelForEntity: <T>(entity: IEntity) => DeepReadonly<WithId<T>>;
  registerComponent: <T>(component: IComponent<T>) => IComponent<T>;
  getComponent: <T>(component: IComponent<T>) => IComponent;
  getComponentById: <T>(componentId: EntityIdType) => IComponent;
  getState: () => ISystem;
  step: () => ISystem;

  toString: () => string;
}


export type IConfig = IObjectConfig | IFileConfig;
export type IConfigDefaults = PickOptionalProps<IObjectConfig>;

export interface IObjectConfig {
  name: string;
  version: string;
  logging?: boolean;
  debug?: boolean;
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

interface IKeyboard {
  update: () => void;
  keyPressed: (key: number) => boolean;
  keyJustPressed: (key: number) => boolean;
  keyJustReleased: (key: number) => boolean;
}
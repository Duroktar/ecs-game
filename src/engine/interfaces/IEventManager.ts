import { IComponentEvents, IBasicConfig, AnonymousCB, IComponent, IEntity } from "../types";

export interface IEventManager extends IComponentEvents {
  config: IBasicConfig;
  init: (config?: IBasicConfig) => null;
  registerListener: (name: string, callback: AnonymousCB) => void;
  unRegisterListener: (name: string, callback: AnonymousCB) => void;
  emit: <T>(name: string, data?: T) => void;
  onUpdate: (component: IComponent, entity: IEntity) => void;
  onChange: (eventName: string, component: IComponent, entity: IEntity) => void;
}

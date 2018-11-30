import { IBasicConfig, IComponentEvents, IOnUpdateHandler, IOnChangeHandler, IComponent, IEventManager, AnonymousCB } from "../types";
import {EventEmitter2} from 'eventemitter2';

const configDefaults = {
  name: 'EventManager',
  debug: true,
  logging: true,
  version: '1',
}

class EventManager implements IEventManager {
  public config:        IBasicConfig;
  public emitter:       EventEmitter2;
 
  constructor(config: IBasicConfig) {
    this.config      = { ...configDefaults, ...config };
    this.emitter     = new EventEmitter2();
  }

  public init = (config?: IBasicConfig) => null;

  public registerEvent = (name: string, callback: AnonymousCB) => {
    this.emitter.on(name, callback)
  };

  public unRegisterEvent = (name: string, callback: AnonymousCB): void => {
    this.emitter.removeListener(name, callback);
  };

  public onUpdate = (component: IComponent) => {
    this.emitter.emit(`updateComponent`, component);
  };

  public onChange = (component: IComponent, eventName: string): void => {
    this.emitter.emit(eventName, component);
  };
}

export default EventManager;

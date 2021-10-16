import { IBasicConfig, IComponent, IEventManager, AnonymousCB, IEntity } from "../types";
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
    this.emitter     = new EventEmitter2({
      delimiter:  ':',
      wildcard:   true,
      maxListeners: 20,
    });
  }

  public init = (config?: IBasicConfig) => null;

  public registerListener = (name: string, callback: AnonymousCB) => {
    this.emitter.addListener(name, callback)
  };

  public unRegisterListener = (name: string, callback: AnonymousCB): void => {
    this.emitter.removeListener(name, callback);
  };

  public emit = <T>(eventName: string, data?: T) => {
    this.emitter.emit(eventName, data);
  };

  public onUpdate = (component: IComponent, entity: IEntity) => {
    this.emitter.emit('updateComponent', component, entity);
  };

  public onChange = (eventName: string, component: IComponent, entity: IEntity): void => {
    this.emitter.emit(eventName, component, entity);
  };
}

export default EventManager;

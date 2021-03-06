import { IBasicConfig, IComponentEvents, IOnUpdateHandler, IOnChangeHandler, IComponent, IEventManager, AnonymousCB, IEntity } from "../types";
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
    this._emit(eventName, data);
  };

  public onUpdate = (component: IComponent, entity: IEntity) => {
    this._emit('updateComponent', component, entity);
  };

  public onChange = (eventName: string, component: IComponent, entity: IEntity): void => {
    this._emit(eventName, component, entity);
  };

  private _emit = (event: string, ...args: any[]) => {
    if (this.config.logging) {
      console.log(`[EventService]: Event: "${event}"; args:`, args)
    }
    this.emitter.emit(event, ...args);
  }
}

export default EventManager;

import { ITypes, IEntity, IdGeneratorFunc, ISystem, IComponent, IComponentEvents, AnonymousCB, EntityIdType } from "../types";
export { KeysEnum } from './Keys';
export { registerComponentFactories } from './registerComponents';

export const pp = (obj: object | null | undefined) => JSON.stringify(obj, null, '  ')

export type Setter<T> = (system: ISystem, entity: IEntity, state: T) => null | undefined;

export type Selector<T> = (system: ISystem, entity: IEntity) => null | IComponent<T>

export function createSelector<T>(path: string): Selector<T> {
  return (system: ISystem, entity: IEntity): null | IComponent<T> => {
    const searchResult = system
      .components
      .filter(o =>
        isSameEntity(o, entity)
        && hasState(path, o.state));

    if (searchResult.length === 0) {
      return null;
    };

    return first(searchResult);
  }
}

export function createSetter<T>(selector: Selector<T>): Setter<T> {
  return (system: ISystem, entity: IEntity, state: T) => {
    const component = selector(system, entity);

    if (component === null) {
      return component;
    }

    component.state = state;
  }
}

export function hasState(path: string, state: any) {
  return state[path] !== undefined;
}

export function factory<T extends ITypes>(config: T): T {
  return config;
}

export function mkEntity(id: EntityIdType): IEntity {
  return { id };
}

export function isSameEntity(a: IEntity, b: IEntity) {
  return a.id === b.id;
}

export function values(obj: any) {
  return Object.keys(obj).map(key => obj[key]);
}

export function first<T>(array: T[]): T {
  return array[0];
}

export const defaultIdGenerator = (genesis: number = 0): IdGeneratorFunc => {
  let epoch: number = genesis;
  return () => ({ next: () => epoch++ })
}

export const defaultComponentEvents = (): IComponentEvents => ({
  onUpdate: (component: IComponent, entity: IEntity) => null,
  onChange: (eventName: string, component: IComponent, entity: IEntity) => null,
})

export function partialSetValue(object: any) {
  return (path: (string | number)[], value: any) => setValue(object, path, value);
}

export function setValue(object: any, path: (string | number)[], value: any) {
  let a = path;
  let o = object;

  for (let i = 0; i < a.length - 1; i++) {
      let n = a[i];
      if (n in o) {
          o = o[n];
      } else {
          o[n] = {};
          o = o[n];
      }
  }

  o[a[a.length - 1]] = value;
}

export function getValue<T extends any>(object: T, path: string) {
  let o = object;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');
  let a = path.split('.');

  while (a.length) {
      let n = a.shift() as string;

      if (n in o) {
          o = o[n];
      } else {
          return;
      }
  }

  return o;
}

export function keys<O>(o: O) {
  return Object.keys(o) as (keyof O)[];
}

export function once(fn: AnonymousCB) {
  let called = false;
  return (...args: any[]) => {
    if (!called) {
      called = true;
      return fn(...args);
    }
    return undefined;
  }
}

export const clamp = (min: number, max: number, num: number) => {
  return num < min ? min : num > max ? max : num;
}

export const ifStateProp = (obj: any) => {
  return obj && obj.state !== undefined;
}

export function boxMullerRandomGeneratorFactory() {
  let phase:      number = 0;
  let random:     () => number;
  let x1:         number;
  let x2:         number;
  let w:          number;
  let z:          number;

  random = Math.random;

  return function () {
      if (!phase) {
          do {
              x1 = 2.0 * random() - 1.0;
              x2 = 2.0 * random() - 1.0;
              w = x1 * x1 + x2 * x2;
          } while (w >= 1.0);

          w = Math.sqrt((-2.0 * Math.log(w)) / w);
          z = x1 * w;
      } else {
          z = x2 * w;
      }

      phase ^= 1;

      return z;
  }
};

/**
 * limits your function to be called at most every W milliseconds, where W is wait.
 * Calls over W get dropped.
 * Thanks to Pat Migliaccio.
 * see https://medium.com/@pat_migliaccio/rate-limiting-throttling-consecutive-function-calls-with-queues-4c9de7106acc
 * @param fn
 * @param wait
 * @example let throttledFunc = throttle(myFunc,500);
 */
export function throttle<T>(fn: Function, wait: number){
  let isCalled = false;
  let last: T;
  return function(...args: any[]): T {
    if (!isCalled){
      last = fn(...args);
      isCalled = true;
      setTimeout(function(){
        isCalled = false;
      }, wait)
    }
    return last;
  };
}

export const defaultBoundary = {
  top:    0,
  left:   0,
  bottom: 600,
  right:  800,
}

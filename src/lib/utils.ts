import { ITypes, IEntity, IdGeneratorFunc, ISystem, IComponent, IComponentEvents } from "./types";

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
  onUpdate: (component: IComponent) => null,
  onChange: (component: IComponent, eventName: string) => null,
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

export const defaultBoundary = {
  top:    0,
  left:   0,
  bottom: 600,
  right:  800,
}

export enum KeysEnum {
  Backspace = 8,
  Tab = 9,
  Enter = 13,
  Shift = 16,
  Ctrl = 17,
  Alt = 18,
  PauseBreak = 19,
  CapsLock = 20,
  Escape = 27,
  Space = 32,
  PageUp = 33,
  PageDown = 34,
  End = 35,
  Home = 36,

  LeftArrow = 37,
  UpArrow = 38,
  RightArrow = 39,
  DownArrow = 40,

  Insert = 45,
  Delete = 46,

  Zero = 48,
  ClosedParen = Zero,
  One = 49,
  ExclamationMark = One,
  Two = 50,
  AtSign = Two,
  Three = 51,
  PoundSign = Three,
  Hash = PoundSign,
  Four = 52,
  DollarSign = Four,
  Five = 53,
  PercentSign = Five,
  Six = 54,
  Caret = Six,
  Hat = Caret,
  Seven = 55,
  Ampersand = Seven,
  Eight = 56,
  Star = Eight,
  Asterik = Star,
  Nine = 57,
  OpenParen = Nine,

  A = 65,
  B = 66,
  C = 67,
  D = 68,
  E = 69,
  F = 70,
  G = 71,
  H = 72,
  I = 73,
  J = 74,
  K = 75,
  L = 76,
  M = 77,
  N = 78,
  O = 79,
  P = 80,
  Q = 81,
  R = 82,
  S = 83,
  T = 84,
  U = 85,
  V = 86,
  W = 87,
  X = 88,
  Y = 89,
  Z = 90,

  LeftWindowKey = 91,
  RightWindowKey = 92,
  SelectKey = 93,

  Numpad0 = 96,
  Numpad1 = 97,
  Numpad2 = 98,
  Numpad3 = 99,
  Numpad4 = 100,
  Numpad5 = 101,
  Numpad6 = 102,
  Numpad7 = 103,
  Numpad8 = 104,
  Numpad9 = 105,

  Multiply = 106,
  Add = 107,
  Subtract = 109,
  DecimalPoint = 110,
  Divide = 111,

  F1 = 112,
  F2 = 113,
  F3 = 114,
  F4 = 115,
  F5 = 116,
  F6 = 117,
  F7 = 118,
  F8 = 119,
  F9 = 120,
  F10 = 121,
  F11 = 122,
  F12 = 123,

  NumLock = 144,
  ScrollLock = 145,

  SemiColon = 186,
  Equals = 187,
  Comma = 188,
  Dash = 189,
  Period = 190,
  UnderScore = Dash,
  PlusSign = Equals,
  ForwardSlash = 191,
  Tilde = 192,
  GraveAccent = Tilde,

  OpenBracket = 219,
  ClosedBracket = 221,
  Quote = 222
}
  
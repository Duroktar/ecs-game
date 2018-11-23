import { ITypes, IEntity } from "./types";

export function factory<T extends ITypes>(config: T): T {
  return config;
}

export function isSameEntity(a: IEntity, b: IEntity) {
  return a.id === b.id;
}

export function values(obj: any) {
  return Object.keys(obj).map(key => obj[key]);
}

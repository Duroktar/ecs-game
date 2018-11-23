import { ITypes, IEntity } from "./types";

export function factory<T extends ITypes>(config: T): T {
  return config;
}

export function isSameEntity(a: IEntity, b: IEntity) {
  return a.id === b.id;
}

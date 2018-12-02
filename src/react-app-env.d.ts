/// <reference types="react-scripts" />

export type primitive = string | number | boolean | undefined | null
export type DeepReadonly<T> =
  T extends primitive ? T :
  T extends Array<infer U> ? DeepReadonlyArray<U> :
  DeepReadonlyObject<T>

export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

export type Overwrite<T1, T2> = {
  [P in Exclude<keyof T1, keyof T2>]: T1[P]
} & T2;

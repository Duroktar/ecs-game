import { nameableFactory } from "../components/nameable";
import { killableFactory } from "../components/killable";
import { movableFactory } from "../components/moveable";
import { ageableFactory } from "../components/ageable";
import { controllableFactory } from "../components/controllable";
import { IComponentFactoryKey, IComponentFactories } from "../types";

const ComponentFactories = {
  name: nameableFactory,
  health: killableFactory,
  movement: movableFactory,
  age: ageableFactory,
  controls: controllableFactory,
}

export function componentFactory<T extends IComponentFactoryKey>(name: T): IComponentFactories[T] {
  return  ComponentFactories[name];
}
  
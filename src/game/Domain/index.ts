import { IComponentFactories, IComponentFactoryKey } from "../../lib/types";
import { nameableFactory } from "../../lib/components/nameable";
import { killableFactory } from "../../lib/components/killable";
import { movableFactory } from "../../lib/components/moveable";
import { ageableFactory } from "../../lib/components/ageable";
import { controllableFactory } from "../../lib/components/controllable";
import { combatableFactory } from "../../lib/components/combatable";
import { withMomentumFactory } from "../../lib/components/withMomentum";
import { withOffscreenFactory } from "../../lib/components/withOffscreen";
import { withGeometryFactory } from "../../lib/components/withGeometry";

const ComponentFactories = {
  name: nameableFactory,
  health: killableFactory,
  movement: movableFactory,
  age: ageableFactory,
  controls: controllableFactory,
  attack: combatableFactory,
  momentum: withMomentumFactory,
  offscreen: withOffscreenFactory,
  geometry: withGeometryFactory,
}

export function componentFactory<T extends IComponentFactoryKey>(name: T): IComponentFactories[T] {
  return  ComponentFactories[name];
}
  
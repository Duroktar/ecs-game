import { IComponentFactories, IComponentFactoryKey } from "../types";
import { ageableFactory } from "./ageable";
import { controllableFactory } from "./controllable";
import { combatableFactory } from "./combatable";
import { killableFactory } from "./killable";
import { withPositionFactory } from "./withPosition";
import { nameableFactory } from "./nameable";
import { isCollidableFactory } from "./isCollidable";
import { withCollisionsFactory } from "./withCollisions";
import { withGeometryFactory } from "./withGeometry";
import { withMomentumFactory } from "./withMomentum";
import { withOffscreenFactory } from "./withOffscreen";
import { lootableFactory } from "./lootable";
import { withBoundaryFactory } from "./withBoundary";
import { withTextureFactory } from "./withTexture";
import { withBugWiggleFactory } from "./withBugWiggle";
import { withHomePositionFactory } from "./withHomePosition";
import { withWrapAroundPositionFactory } from "./withWrapAroundPosition";

export const defaultComponentFactories: IComponentFactories = {
  name:         nameableFactory,
  health:       killableFactory,
  position:     withPositionFactory,
  age:          ageableFactory,
  controls:     controllableFactory,
  collisions:   withCollisionsFactory,
  collidable:   isCollidableFactory,
  attack:       combatableFactory,
  momentum:     withMomentumFactory,
  offscreen:    withOffscreenFactory,
  geometry:     withGeometryFactory,
  loot:         lootableFactory,
  boundary:     withBoundaryFactory,
  texture:      withTextureFactory,
  wiggle:       withBugWiggleFactory,
  homePosition: withHomePositionFactory,
  worldwrap:    withWrapAroundPositionFactory,
}

export function getComponentFactory<T extends IComponentFactoryKey>(name: T): IComponentFactories[T] {
  return  defaultComponentFactories[name];
}

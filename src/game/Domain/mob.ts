import { IEntity } from "../../engine/types";
import { ISystemManager } from "../../engine/interfaces/ISystemManager";
import { IPointsLoot } from "../types";
import { nameableFactory,               WithName } from "../../engine/components/nameable";
import { killableFactory,               WithHealthState } from "../../engine/components/killable";
import { withGeometryFactory,           WithGeometry } from "../../engine/components/withGeometry";
import { withRandomWalkFactory,         WithRandomWalkArgs } from "../../engine/components/withRandomWalk";
import { isCollidableFactory,           IsCollidable } from "../../engine/components/isCollidable";
import { lootableFactory,               IsLootable } from "../../engine/components/lootable";
import { withWrapAroundPositionFactory, WithPosition } from "../../engine/components/withWrapAroundPosition";
import { withBoundaryFactory,           WithBoundary } from "../../engine/components/withBoundary";
import { withTextureFactory,            WithTexture } from "../../engine/components/withTexture";
import { withBugWiggleFactory,          WithBugWiggle, WithBugWiggleArgs } from "../../engine/components/withBugWiggle";
import { WithPositionState } from "../../engine/components/withPosition";
import { registerComponentFactories } from "../../engine/registerComponents";

export function createMob(
  system:   ISystemManager,
  options:  MobModelArgs,
): IEntity {
  const entity = system.registerEntity();

  registerComponentFactories(system, entity, options, [
    nameableFactory,
    killableFactory,
    withWrapAroundPositionFactory,
    withGeometryFactory,
    withTextureFactory,
    withBoundaryFactory,
    withRandomWalkFactory,
    withBugWiggleFactory,
    isCollidableFactory,
    lootableFactory,
  ]);

  return entity;
}

export type MobModelArgs =
  WithName                &
  WithHealthState         &
  WithPosition            &
  WithGeometry            &
  WithTexture             &
  WithBoundary            &
  WithRandomWalkArgs      &
  WithBugWiggleArgs       &
  IsLootable<IPointsLoot> &
  IsCollidable;

export type MobModel =
  WithName                &
  WithHealthState         &
  WithPositionState       &
  WithGeometry            &
  WithTexture             &
  WithBoundary            &
  WithRandomWalkArgs      &
  WithBugWiggle           &
  IsLootable<IPointsLoot> &
  IsCollidable;

import { IEntity, ISystemManager } from "../../engine/types";
import { IPointsLoot } from "../types";

import { nameableFactory,               WithName } from "../../engine/components/nameable";
import { killableFactory,               WithHealthState } from "../../engine/components/killable";
import { withGeometryFactory,           WithGeometry } from "../../engine/components/withGeometry";
import { withRandomWalkFactory,         WithRandomWalkArgs } from "../../engine/components/withRandomWalk";
import { isCollidableFactory,           IsCollidable } from "../../engine/components/isCollidable";
import { lootableFactory,               IsLootable } from "../../engine/components/lootable";
import { withBoundaryFactory,           WithBoundary } from "../../engine/components/withBoundary";
import { withTextureFactory,            WithTexture } from "../../engine/components/withTexture";
import { withBugWiggleFactory,          WithBugWiggle, WithBugWiggleArgs } from "../../engine/components/withBugWiggle";
import { WithPositionState,             withPositionFactory, WithPosition } from "../../engine/components/withPosition";
import { withHomePositionFactory,       WithHomePosition } from "../../engine/components/withHomePosition";
import { withWrapAroundPositionFactory } from "../../engine/components/withWrapAroundPosition";


export function createMob(
  system:   ISystemManager,
  options:  MobModelArgs,
): IEntity {
  const withName          = nameableFactory(system);
  const withHealth        = killableFactory(system);
  const withGeometry      = withGeometryFactory(system);
  const withBoundary      = withBoundaryFactory(system);
  const withBugWiggle     = withBugWiggleFactory(system);
  const withRandomWalk    = withRandomWalkFactory(system);
  const withPosition      = withPositionFactory(system);
  const withWorldWrap     = withWrapAroundPositionFactory(system);
  const withHomePosition  = withHomePositionFactory(system);
  const isCollidable      = isCollidableFactory(system);
  const withTexture       = withTextureFactory(system);
  const isLootable        = lootableFactory<IPointsLoot>(system);

  const entity = system.registerEntity();

  system.registerComponent(
    withName(entity, options, system.events)
  );
  system.registerComponent(
    withHealth(entity, options, system.events)
  );
  system.registerComponent(
    withBoundary(entity, options, system.events)
  );
  system.registerComponent(
    withBugWiggle(entity, options, system.events)
  );
  system.registerComponent(
    withPosition(entity, options, system.events)
  );
  system.registerComponent(
    withRandomWalk(entity, options, system.events)
  );
  system.registerComponent(
    withWorldWrap(entity, options, system.events)
  );
  system.registerComponent(
    withHomePosition(entity, options, system.events)
  );
  system.registerComponent(
    withGeometry(entity, options, system.events)
  );
  system.registerComponent(
    withTexture(entity, options, system.events)
  );
  system.registerComponent(
    isCollidable(entity, options, system.events)
  );
  system.registerComponent(
    isLootable(entity, options, system.events)
  );
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
  WithHomePosition        &
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
  WithHomePosition        &
  IsLootable<IPointsLoot> &
  IsCollidable;

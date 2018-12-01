import { IEntity, ISystemManager } from "../../lib/types";
import { nameableFactory,               WithName } from "../../lib/components/nameable";
import { killableFactory,               WithHealthState } from "../../lib/components/killable";
import { withGeometryFactory,           WithGeometry } from "../../lib/components/withGeometry";
import { withRandomWalkFactory,         WithRandomWalkArgs } from "../../lib/components/withRandomWalk";
import { isCollidableFactory,           IsCollidable } from "../../lib/components/isCollidable";
import { lootableFactory,               IsLootable } from "../../lib/components/lootable";
import { withWarpAroundPositionFactory, WithPosition } from "../../lib/components/withWrapAroundPosition";
import { IPointsLoot } from "../types";
import { withBoundaryFactory, WithBoundary } from "../../lib/components/withBoundary";


export function createMob(
  system:   ISystemManager,
  options:  MobModel,
): IEntity {
  const withName        = nameableFactory(system);
  const withHealth      = killableFactory(system);
  const withPosition    = withWarpAroundPositionFactory(system);
  const withGeometry    = withGeometryFactory(system);
  const withRandomWalk  = withRandomWalkFactory(system);
  const isCollidable    = isCollidableFactory(system);
  const withBoundary    = withBoundaryFactory(system);
  const isLootable      = lootableFactory<IPointsLoot>(system);

  const entity = system.registerEntity();

  system.registerComponent(
    withName(entity, options, system.events)
  );
  system.registerComponent(
    withHealth(entity, options, system.events)
  );
  system.registerComponent(
    withGeometry(entity, options, system.events)
  );
  system.registerComponent(
    withPosition(entity, options, system.events)
  );
  system.registerComponent(
    withBoundary(entity, options, system.events)
  );
  system.registerComponent(
    withRandomWalk(entity, options, system.events)
  );
  system.registerComponent(
    isCollidable(entity, options, system.events)
  );
  system.registerComponent(
    isLootable(entity, options, system.events)
  );
  return entity;
}

export type MobModel =
  WithName                &
  WithHealthState         &
  WithGeometry            &
  WithPosition            &
  WithBoundary            &
  WithRandomWalkArgs      &
  IsLootable<IPointsLoot> &
  IsCollidable;

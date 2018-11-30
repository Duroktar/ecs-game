import { IEntity, ISystemManager } from "../../lib/types";
import { nameableFactory,     WithName } from "../../lib/components/nameable";
import { killableFactory,     WithHealthState } from "../../lib/components/killable";
import { withPositionFactory,      WithPosition } from "../../lib/components/withPosition";
import { withGeometryFactory, WithGeometry } from "../../lib/components/withGeometry";
import { isCollidableFactory, IsCollidable } from "../../lib/components/isCollidable";
import { lootableFactory,     IsLootable } from "../../lib/components/lootable";
import { IPointsLoot } from "../types";


export function createMob(
  system:   ISystemManager,
  options:  MobModel,
): IEntity {
  const withName     = nameableFactory(system);
  const withHealth   = killableFactory(system);
  const withPosition = withPositionFactory(system);
  const withGeometry = withGeometryFactory(system);
  const isCollidable = isCollidableFactory(system);
  const isLootable   = lootableFactory<IPointsLoot>(system);

  const entity = system.registerEntity();

  system.registerComponent(
    withName(entity, options, system.events)
  );
  system.registerComponent(
    withHealth(entity, options, system.events)
  );
  system.registerComponent(
    withPosition(entity, options, system.events)
  );
  system.registerComponent(
    withGeometry(entity, options, system.events)
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
  IsLootable<IPointsLoot> &
  IsCollidable;

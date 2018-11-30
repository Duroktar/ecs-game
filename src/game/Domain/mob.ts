import { IEntity, ISystemManager, IComponentEvents } from "../../lib/types";
import { nameableFactory,     WithName } from "../../lib/components/nameable";
import { killableFactory,     WithHealthState } from "../../lib/components/killable";
import { withPositionFactory,      WithPosition } from "../../lib/components/withPosition";
import { withGeometryFactory, WithGeometry } from "../../lib/components/withGeometry";
import { isCollidableFactory, IsCollidable } from "../../lib/components/isCollidable";
import { lootableFactory,     IsLootable } from "../../lib/components/lootable";
import { IPointsLoot } from "../types";
import { defaultComponentEvents } from "../../lib/utils";


export function createMob(
  system:   ISystemManager,
  options:  MobModel,
  events:   IComponentEvents = defaultComponentEvents(),
): IEntity {
  const withName     = nameableFactory(system);
  const withHealth   = killableFactory(system);
  const withPosition = withPositionFactory(system);
  const withGeometry = withGeometryFactory(system);
  const isCollidable = isCollidableFactory(system);
  const isLootable   = lootableFactory<IPointsLoot>(system);

  const entity = system.registerEntity();

  system.registerComponent(
    withName(entity, options, events)
  );
  system.registerComponent(
    withHealth(entity, options, events)
  );
  system.registerComponent(
    withPosition(entity, options, events)
  );
  system.registerComponent(
    withGeometry(entity, options, events)
  );
  system.registerComponent(
    isCollidable(entity, options, events)
  );
  system.registerComponent(
    isLootable(entity, options, events)
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

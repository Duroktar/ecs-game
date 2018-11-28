import { IEntity, ISystemManager } from "../../lib/types";
import { nameableFactory,     WithName } from "../../lib/components/nameable";
import { killableFactory,     WithHealth } from "../../lib/components/killable";
import { movableFactory,      WithPosition } from "../../lib/components/moveable";
import { withGeometryFactory, WithGeometry } from "../../lib/components/withGeometry";
import { isCollidableFactory, IsCollidable } from "../../lib/components/isCollidable";
import { lootableFactory,     IsLootable } from "../../lib/components/lootable";
import { IPointsLoot } from "../../types";


export function createMob(system: ISystemManager, options: MobModel): IEntity {
  const withName     = nameableFactory(system);
  const withHealth   = killableFactory(system);
  const withPosition = movableFactory(system);
  const withGeometry = withGeometryFactory(system);
  const isCollidable = isCollidableFactory(system);
  const isLootable   = lootableFactory<IPointsLoot>(system);

  const entity = system.registerEntity();

  system.registerComponent(
    withName(entity, options)
  );
  system.registerComponent(
    withHealth(entity, options)
  );
  system.registerComponent(
    withPosition(entity, options)
  );
  system.registerComponent(
    withGeometry(entity, options)
  );
  system.registerComponent(
    isCollidable(entity, options)
  );
  system.registerComponent(
    isLootable(entity, options)
  );
  return entity;
}

export type MobModel =
  WithName                &
  WithHealth              &
  WithGeometry            &
  WithPosition            &
  IsLootable<IPointsLoot> &
  IsCollidable;

import { IEntity, ISystemManager, IComponent } from "../../lib/types";
import { nameableFactory, WithName } from "../../lib/components/nameable";
import { killableFactory, WithHealth } from "../../lib/components/killable";
import { movableFactory, WithMovement } from "../../lib/components/moveable";
import { withGeometryFactory, WithGeometry } from "../../lib/components/withGeometry";


export function createMob(system: ISystemManager, options: MobModel): IEntity {
  const withName     = nameableFactory(system);
  const withHealth   = killableFactory(system);
  const withPosition = movableFactory(system);
  const withGeometry = withGeometryFactory(system);

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
  return entity;
}

export type MobBase =
  WithName     &
  WithHealth   &
  WithGeometry &
  WithMovement;

export type MobModel =
  IComponent &
  MobBase;

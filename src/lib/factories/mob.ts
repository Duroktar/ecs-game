import { ISystemManager, IEntity } from "../types";
import { nameableFactory, WithName } from "../components/nameable";
import { killableFactory, WithHealth } from "../components/killable";
import { movableFactory, WithMovement } from "../components/moveable";

export function createMob(system: ISystemManager, options: MobModel): IEntity {
  const withName     = nameableFactory(system);
  const withHealth   = killableFactory(system);
  const withPosition = movableFactory(system);

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
  return entity;
}

export type MobModel = WithName & WithHealth & WithMovement;

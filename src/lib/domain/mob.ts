import { ISystemManager } from "../types";
import { nameableFactory, WithName } from "../components/nameable";
import { killableFactory, WithHealth } from "../components/killable";
import { movableFactory, WithPosition } from "../components/moveable";

export function createMob(system: ISystemManager, options: MobModel) {
  const withName = nameableFactory(system);
  const withHealth = killableFactory(system);
  const withPosition = movableFactory(system);

  const entity = system.registerEntity();

  system.registerComponent(
    withName(entity, options.name)
  );
  system.registerComponent(
    withHealth(entity, options.health)
  );
  system.registerComponent(
    withPosition(entity, options.position)
  );
  return entity;
}

export type MobModel = WithName & WithHealth & WithPosition;

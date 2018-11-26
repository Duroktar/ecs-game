import { IEntity, ISystemManager } from "../../lib/types";
import { nameableFactory, WithName } from "../../lib/components/nameable";
import { ageableFactory, WithAge } from "../../lib/components/ageable";
import { killableFactory, WithHealth } from "../../lib/components/killable";
import { movableFactory, WithMovement } from "../../lib/components/moveable";
import { controllableFactory, WithControls } from "../../lib/components/controllable";
import { combatableFactory, WithAttack } from "../../lib/components/combatable";
import { withGeometryFactory, WithGeometry } from "../../lib/components/withGeometry";

export function createCharacter(system: ISystemManager, options: CharacterModel): IEntity {
  const withName     = nameableFactory(system);
  const withAge      = ageableFactory(system);
  const withHealth   = killableFactory(system);
  const withPosition = movableFactory(system);
  const withControls = controllableFactory(system);
  const withAttack   = combatableFactory(system);
  const withGeometry = withGeometryFactory(system);

  const entity = system.registerEntity();

  system.registerComponent(
    withName(entity, options)
  );
  system.registerComponent(
    withAge(entity, options)
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
    withAttack(entity, options)
  );
  system.registerComponent(
    withControls(entity, {
      direction: options.direction,
      moving: options.moving,
      speed: options.speed,
    })
  );
  return entity;
}

export type CharacterModel =
  WithName     &
  WithAge      &
  WithHealth   &
  WithMovement &
  WithControls &
  WithGeometry &
  WithAttack;

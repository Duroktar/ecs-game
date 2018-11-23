import { ISystemManager } from "../types";
import { nameableFactory, WithName } from "../components/nameable";
import { killableFactory, WithHealth } from "../components/killable";
import { movableFactory, WithPosition } from "../components/moveable";
import { ageableFactory, WithAge } from "../components/ageable";
import { controllableFactory, WithControls } from "../components/controllable";

export function createCharacter(system: ISystemManager, options: CharacterModel) {
  const withName = nameableFactory(system);
  const withAge = ageableFactory(system);
  const withHealth = killableFactory(system);
  const withPosition = movableFactory(system);
  const withControls = controllableFactory(system);

  const entity = system.registerEntity();

  system.registerComponent(
    withName(entity, options.name)
  );
  system.registerComponent(
    withAge(entity, options.age)
  );
  system.registerComponent(
    withHealth(entity, options.health)
  );
  system.registerComponent(
    withPosition(entity, options.position)
  );
  system.registerComponent(
    withControls(entity, {
      direction: options.direction,
      moving: options.moving,
    })
  );
  return entity;
}

export type CharacterModel = WithName & WithAge & WithHealth & WithPosition & WithControls;

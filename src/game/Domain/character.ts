import { IEntity, ISystemManager } from "../../lib/types";
import { nameableFactory,           WithName } from "../../lib/components/nameable";
import { killableFactory,           WithHealth } from "../../lib/components/killable";
import { withPositionFactory,       WithPosition, WithPositionState } from "../../lib/components/withPosition";
import { combatableFactory,         WithAttack } from "../../lib/components/combatable";
import { withGeometryFactory,       WithGeometry } from "../../lib/components/withGeometry";
import { isCollidableFactory,       IsCollidable } from "../../lib/components/isCollidable";
import { withBoundaryFactory,       WithBoundary } from "../../lib/components/withBoundary";
import { withPlayerControlsFactory, WithPlayerControls } from "../../lib/components/withPlayerControls";

export function createCharacter(
  system:   ISystemManager,
  options:  CharacterModelArgs,
): IEntity {
  const withName        = nameableFactory(system);
  const withHealth      = killableFactory(system);
  const withPosition    = withPositionFactory(system);
  const withControls    = withPlayerControlsFactory(system);
  const withAttack      = combatableFactory(system);
  const withGeometry    = withGeometryFactory(system);
  const isCollidable    = isCollidableFactory(system);
  const withBoundary    = withBoundaryFactory(system);

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
    withAttack(entity, options, system.events)
  );
  system.registerComponent(
    isCollidable(entity, options, system.events)
  );
  system.registerComponent(
    withBoundary(entity, options, system.events)
  );
  system.registerComponent(
    withControls(entity, {
      direction: options.direction,
      moving: options.moving,
      speed: options.speed,
    }, system.events)
  );
  return entity;
}

export type CharacterModelArgs =
  WithName          &
  WithHealth        &
  WithPosition      &
  WithGeometry      &
  WithAttack        &
  WithBoundary      &
  IsCollidable      &
  WithPlayerControls;

export type CharacterModel =
  WithName          &
  WithHealth        &
  WithPositionState &
  WithGeometry      &
  WithAttack        &
  WithBoundary      &
  IsCollidable      &
  WithPlayerControls;

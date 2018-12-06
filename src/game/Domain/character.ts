import { IEntity, ISystemManager } from "../../engine/types";
import { combatableFactory,         WithAttack } from "../../engine/components/combatable";
import { nameableFactory,           WithName } from "../../engine/components/nameable";
import { killableFactory,           WithHealth, WithHealthState } from "../../engine/components/killable";
import { withPositionFactory,       WithPosition, WithPositionState } from "../../engine/components/withPosition";
import { withGeometryFactory,       WithGeometry } from "../../engine/components/withGeometry";
import { withBoundaryFactory,       WithBoundary } from "../../engine/components/withBoundary";
import { withTextureFactory,        WithTexture } from "../../engine/components/withTexture";
import { withPlayerControlsFactory, WithControls } from "../../engine/components/withPlayerControls";
import { isCollidableFactory,       IsCollidable } from "../../engine/components/isCollidable";
import { withCollisionsFactory } from "../../engine/components/withCollisions";
import { withHomePositionFactory, WithHomePosition } from "../../engine/components/withHomePosition";

export function createCharacter(
  system:   ISystemManager,
  options:  CharacterModelArgs,
): IEntity {
  const withName          = nameableFactory(system);
  const withHealth        = killableFactory(system);
  const withPosition      = withPositionFactory(system);
  const withControls      = withPlayerControlsFactory(system);
  const withAttack        = combatableFactory(system);
  const withGeometry      = withGeometryFactory(system);
  const withTexture       = withTextureFactory(system);
  const isCollidable      = isCollidableFactory(system);
  const withCollisions    = withCollisionsFactory(system);
  const withBoundary      = withBoundaryFactory(system);
  const withHomePosition  = withHomePositionFactory(system);

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
    withHomePosition(entity, options, system.events)
  );
  system.registerComponent(
    withGeometry(entity, options, system.events)
  );
  system.registerComponent(
    withTexture(entity, options, system.events)
  );
  system.registerComponent(
    withAttack(entity, options, system.events)
  );
  system.registerComponent(
    isCollidable(entity, options, system.events)
  );
  system.registerComponent(
    withCollisions(entity, options, system.events)
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
  WithTexture       &
  WithAttack        &
  WithBoundary      &
  IsCollidable      &
  WithHomePosition  &
  WithControls;

export type CharacterModel =
  WithName          &
  WithHealthState   &
  WithPositionState &
  WithGeometry      &
  WithTexture       &
  WithAttack        &
  WithBoundary      &
  IsCollidable      &
  WithHomePosition  &
  WithControls;

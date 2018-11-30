import { IEntity, ISystemManager, IComponentEvents } from "../../lib/types";
import { nameableFactory,           WithName } from "../../lib/components/nameable";
import { killableFactory,           WithHealth } from "../../lib/components/killable";
import { withPositionFactory,       WithPosition } from "../../lib/components/withPosition";
import { combatableFactory,         WithAttack } from "../../lib/components/combatable";
import { withGeometryFactory,       WithGeometry } from "../../lib/components/withGeometry";
import { isCollidableFactory,       IsCollidable } from "../../lib/components/isCollidable";
import { withBoundaryFactory,       WithBoundary } from "../../lib/components/withBoundary";
import { withPlayerControlsFactory, WithPlayerControls } from "../../lib/components/withPlayerControls";
import { defaultComponentEvents } from "../../lib/utils";

export function createCharacter(
  system:   ISystemManager,
  options:  CharacterModel,
  events:   IComponentEvents = defaultComponentEvents(),
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
    withAttack(entity, options, events)
  );
  system.registerComponent(
    isCollidable(entity, options, events)
  );
  system.registerComponent(
    withBoundary(entity, options, events)
  );
  system.registerComponent(
    withControls(entity, {
      direction: options.direction,
      moving: options.moving,
      speed: options.speed,
    }, events)
  );
  return entity;
}

export type CharacterModel =
  WithName          &
  WithHealth        &
  WithPosition      &
  WithGeometry      &
  WithAttack        &
  WithBoundary      &
  IsCollidable      &
  WithPlayerControls;

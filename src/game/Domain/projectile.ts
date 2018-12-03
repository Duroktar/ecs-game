import { IEntity, ISystemManager, IComponent } from "../../engine/types";
import { withPositionFactory,     WithPosition, WithPositionState } from "../../engine/components/withPosition";
import { withMomentumFactory,     WithMomentum } from "../../engine/components/withMomentum";
import { withOffscreenFactory,    WithOffscreen } from "../../engine/components/withOffscreen";
import { withGeometryFactory,     WithGeometry } from "../../engine/components/withGeometry";
import { withCollisionsFactory,   WithCollisionArgs, WithCollisions } from "../../engine/components/withCollisions";
import { nameableFactory,         WithName } from "../../engine/components/nameable";


export function createProjectile(
  system:   ISystemManager,
  options:  ProjectileBaseArgs,
): IEntity {
  const withName        = nameableFactory(system);
  const withPosition    = withPositionFactory(system);
  const withMomentum    = withMomentumFactory(system);
  const withOffscreen   = withOffscreenFactory(system);
  const withGeometry    = withGeometryFactory(system);
  const withCollisions  = withCollisionsFactory(system);

  const entity = system.registerEntity();

  system.registerComponent(
    withName(entity, options, system.events)
  );
  system.registerComponent(
    withPosition(entity, options, system.events)
  );
  system.registerComponent(
    withGeometry(entity, options, system.events)
  );
  system.registerComponent(
    withMomentum(entity, options, system.events)
  );
  system.registerComponent(
    withCollisions(entity, options, system.events)
  );
  system.registerComponent(
    withOffscreen(entity, options, system.events)
  );
  return entity;
}

export type ProjectileBaseArgs =
  WithPosition        &
  WithMomentum        &
  WithGeometry        &
  WithCollisionArgs   &
  WithName            &
  WithOffscreen;

export type ProjectileBase =
  WithPosition        &
  WithMomentum        &
  WithGeometry        &
  WithCollisions      &
  WithName            &
  WithOffscreen;

export type ProjectileModel = 
  IComponent &
  ProjectileBase;

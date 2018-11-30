import { IEntity, ISystemManager, IComponent } from "../../lib/types";
import { withPositionFactory,     WithPosition } from "../../lib/components/withPosition";
import { withMomentumFactory,     WithMomentum } from "../../lib/components/withMomentum";
import { withOffscreenFactory,    WithOffscreen } from "../../lib/components/withOffscreen";
import { withGeometryFactory,     WithGeometry } from "../../lib/components/withGeometry";
import { withCollisionsFactory,   WithCollisions } from "../../lib/components/withCollisions";
import { nameableFactory,         WithName } from "../../lib/components/nameable";


export function createProjectile(
  system:   ISystemManager,
  options:  ProjectileBase,
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

export type ProjectileBase =
  WithPosition        &
  WithMomentum        &
  WithGeometry        &
  WithCollisions      &
  WithName            &
  WithOffscreen;

export type ProjectileModel =
  IComponent          &
  ProjectileBase;
  
import { IEntity, ISystemManager, IComponent } from "../../lib/types";
import { killableFactory,         WithHealth } from "../../lib/components/killable";
import { movableFactory,          WithPosition } from "../../lib/components/moveable";
import { withMomentumFactory,     WithMomentum } from "../../lib/components/withMomentum";
import { withOffscreenFactory,    WithOffscreen } from "../../lib/components/withOffscreen";
import { withGeometryFactory,     WithGeometry } from "../../lib/components/withGeometry";
import { withCollisionsFactory,   WithCollisions } from "../../lib/components/withCollisions";
import { nameableFactory,         WithName } from "../../lib/components/nameable";


export function createProjectile(
  system:  ISystemManager,
  options: ProjectileBase,
): IEntity {
  const withName        = nameableFactory(system);
  const withHealth      = killableFactory(system);
  const withPosition    = movableFactory(system);
  const withMomentum    = withMomentumFactory(system);
  const withOffscreen   = withOffscreenFactory(system);
  const withGeometry    = withGeometryFactory(system);
  const withCollisions  = withCollisionsFactory(system);

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
  system.registerComponent(
    withMomentum(entity, options)
  );
  system.registerComponent(
    withCollisions(entity, options)
  );
  system.registerComponent(
    withOffscreen(entity, options)
  );
  return entity;
}

export type ProjectileBase =
  WithHealth          &
  WithPosition        &
  WithMomentum        &
  WithGeometry        &
  WithCollisions      &
  WithName            &
  WithOffscreen;

export type ProjectileModel =
  IComponent          &
  ProjectileBase;
  
import { IEntity, ISystemManager, IComponent } from "../../lib/types";
import { killableFactory, WithHealth } from "../../lib/components/killable";
import { movableFactory, WithMovement } from "../../lib/components/moveable";
import { withMomentumFactory, WithMomentum } from "../../lib/components/withMomentum";
import { withOffscreenFactory, WithOffscreen } from "../../lib/components/withOffscreen";
import { withGeometryFactory, WithGeometry } from "../../lib/components/withGeometry";

export function createProjectile(
  system:  ISystemManager,
  options: ProjectileBase,
): IEntity {
  const withHealth    = killableFactory(system);
  const withPosition  = movableFactory(system);
  const withMomentum  = withMomentumFactory(system);
  const withOffscreen = withOffscreenFactory(system);
  const withGeometry  = withGeometryFactory(system);

  const entity = system.registerEntity();

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
    withOffscreen(entity, options)
  );
  return entity;
}

export type ProjectileBase =
  WithHealth       &
  WithMovement     &
  WithMomentum     &
  WithGeometry     &
  WithOffscreen;

export type ProjectileModel =
  IComponent       &
  ProjectileBase;
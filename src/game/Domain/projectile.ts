import { IEntity, ISystemManager, IComponent, IComponentEvents } from "../../lib/types";
import { killableFactory,         WithHealth } from "../../lib/components/killable";
import { withPositionFactory,          WithPosition } from "../../lib/components/withPosition";
import { withMomentumFactory,     WithMomentum } from "../../lib/components/withMomentum";
import { withOffscreenFactory,    WithOffscreen } from "../../lib/components/withOffscreen";
import { withGeometryFactory,     WithGeometry } from "../../lib/components/withGeometry";
import { withCollisionsFactory,   WithCollisions } from "../../lib/components/withCollisions";
import { nameableFactory,         WithName } from "../../lib/components/nameable";
import { defaultComponentEvents } from "../../lib/utils";


export function createProjectile(
  system:   ISystemManager,
  options:  ProjectileBase,
  events:   IComponentEvents = defaultComponentEvents(),
): IEntity {
  const withName        = nameableFactory(system);
  const withHealth      = killableFactory(system);
  const withPosition    = withPositionFactory(system);
  const withMomentum    = withMomentumFactory(system);
  const withOffscreen   = withOffscreenFactory(system);
  const withGeometry    = withGeometryFactory(system);
  const withCollisions  = withCollisionsFactory(system);

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
    withMomentum(entity, options, events)
  );
  system.registerComponent(
    withCollisions(entity, options, events)
  );
  system.registerComponent(
    withOffscreen(entity, options, events)
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
  
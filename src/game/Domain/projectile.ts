import { IEntity, IComponent } from "../../engine/types";
import { ISystemManager } from "../../engine/interfaces/ISystemManager";
import { withPositionFactory,     WithPosition } from "../../engine/components/withPosition";
import { withMomentumFactory,     WithMomentum } from "../../engine/components/withMomentum";
import { withOffscreenFactory,    WithOffscreen } from "../../engine/components/withOffscreen";
import { withGeometryFactory,     WithGeometry } from "../../engine/components/withGeometry";
import { withCollisionsFactory,   WithCollisionArgs, WithCollisions } from "../../engine/components/withCollisions";
import { nameableFactory,         WithName } from "../../engine/components/nameable";
import { registerComponentFactories } from "../../engine/registerComponents";


export function createProjectile(
  system:   ISystemManager,
  options:  ProjectileBaseArgs,
): IEntity {
  const entity = system.registerEntity();

  registerComponentFactories(system, entity, options, [
    nameableFactory,
    withPositionFactory,
    withGeometryFactory,
    withMomentumFactory,
    withCollisionsFactory,
    withOffscreenFactory,
  ]);

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

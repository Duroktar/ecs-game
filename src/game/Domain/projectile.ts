import { IEntity, IComponent } from "../../engine/types";
import { ISystemManager } from "../../engine/interfaces/ISystemManager";
import { withPositionFactory,     WithPosition } from "../../engine/components/withPosition";
import { withMomentumFactory,     WithMomentum } from "../../engine/components/withMomentum";
import { withOffscreenFactory,    WithOffscreen } from "../../engine/components/withOffscreen";
import { withGeometryFactory,     WithGeometry } from "../../engine/components/withGeometry";
import { withCollisionsFactory,   WithCollisionArgs, WithCollisions } from "../../engine/components/withCollisions";
import { nameableFactory,         WithName } from "../../engine/components/nameable";
import { isCollidableFactory,     IsCollidable } from "../../engine/components/isCollidable";
import { registerComponentFactories } from "../../engine/utils";


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
    isCollidableFactory,
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
  WithOffscreen       &
  IsCollidable;

export type ProjectileBase =
  WithPosition        &
  WithMomentum        &
  WithGeometry        &
  WithCollisions      &
  WithName            &
  WithOffscreen       &
  IsCollidable;

export type ProjectileModel =
  IComponent &
  ProjectileBase;

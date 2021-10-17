import { IEntity } from "../../engine/types";
import { ISystemManager } from "../../engine/interfaces/ISystemManager";
import { combatableFactory,         WithAttack } from "../../engine/components/combatable";
import { nameableFactory,           WithName } from "../../engine/components/nameable";
import { killableFactory,           WithHealth, WithHealthState } from "../../engine/components/killable";
import { withPositionFactory,       WithPosition, WithPositionState } from "../../engine/components/withPosition";
import { withGeometryFactory,       WithGeometry } from "../../engine/components/withGeometry";
import { withBoundaryFactory,       WithBoundary } from "../../engine/components/withBoundary";
import { withTextureFactory,        WithTexture } from "../../engine/components/withTexture";
import { isCollidableFactory,       IsCollidable } from "../../engine/components/isCollidable";
import { withCollisionsFactory,     WithCollisions } from "../../engine/components/withCollisions";
import { withHomePositionFactory,   WithHomePosition } from "../../engine/components/withHomePosition";
import { withPlayerControlsFactory, WithPlayerControls } from "../../engine/components/withPlayerControls";
import { registerComponentFactories } from "../../engine/registerComponents";
import { WithControls } from "../../engine/components/controllable";

export function createCharacter(
  system:   ISystemManager,
  options:  CharacterModelArgs,
): IEntity {
  const entity = system.registerEntity();

  registerComponentFactories(system, entity, options, [
    nameableFactory,
    killableFactory,
    withPositionFactory,
    withGeometryFactory,
    withTextureFactory,
    combatableFactory,
    isCollidableFactory,
    withCollisionsFactory,
    withBoundaryFactory,
    withPlayerControlsFactory,
    withHomePositionFactory,
  ]);

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
  WithPlayerControls;

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
  WithPlayerControls;

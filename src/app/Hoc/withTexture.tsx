
import { IEntity, WithComponentMeta } from "../../engine/types";
import { ISystemManager } from "../../engine/interfaces/ISystemManager";
import * as React from 'react';

import { MobModel } from "../../game/Domain/mob";
import { CharacterModel } from "../../game/Domain/character";

import { SpriteTextureCollection } from "../Containers/Sprites";
import { SpriteTextureIds } from "../../game/catalogue";

export interface WithTextureProps {
  entity:     IEntity;
  system:     ISystemManager;
  onDeath?:   (entity: IEntity) => void;
}

export type IModelType<P> = { model: WithComponentMeta<P>; system: ISystemManager };

export const withTexture = <P extends MobModel | CharacterModel> (
  textureId: SpriteTextureIds,
): React.ComponentType<WithTextureProps> => {
  const ConnectedComponent: React.ComponentType<IModelType<P>> = SpriteTextureCollection[textureId]
  function WithTextureHOC(props: WithTextureProps) {
    const { entity, system, ...rest } = props;
    const model = system.getEntityModel<P>(props.entity);
    return <ConnectedComponent {...rest} model={model} system={system} />;
  };

  return WithTextureHOC;
}

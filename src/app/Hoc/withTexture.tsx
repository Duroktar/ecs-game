
import { IEntity, WithComponentMeta } from "../../engine/types";
import { ISystemManager } from "../../engine/interfaces/ISystemManager";
import * as React from 'react';

import { SpriteTextureCollection } from "../Containers/Sprites";
import { SpriteTextureIds } from "../../game/catalogue";

export interface WithTextureProps {
  entity:     IEntity;
  system:     ISystemManager;
  onDeath?:   (entity: IEntity) => void;
}

export type IModelType<P> = { model: WithComponentMeta<P>; system: ISystemManager };

export const withTexture = (
  textureId: SpriteTextureIds,
): React.ComponentType<WithTextureProps> => {

  return SpriteTextureCollection[textureId]
}

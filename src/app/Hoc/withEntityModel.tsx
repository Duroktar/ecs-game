import { IEntity, WithComponentMeta } from "../../engine/types";
import { ISystemManager } from "../../engine/interfaces/ISystemManager";
import * as React from 'react';
import { MobModel } from "../../game/Domain/mob";
import { CharacterModel } from "../../game/Domain/character";

interface WithEntityProps {
  entity:     IEntity;
  system:     ISystemManager;
  onDeath?:   (entity: IEntity) => void;
}

export type IModelType<P> = { model: WithComponentMeta<P>; system: ISystemManager };

export const withEntityModel = <P extends MobModel | CharacterModel> (
  Component: React.ComponentType<IModelType<P>>,
): React.ComponentType<WithEntityProps> => {

  return function WithEntityModelHOC(props: WithEntityProps) {
    const model = props.system.getEntityModel<P>(props.entity);
    return <Component {...props} model={model} />;
  };
}

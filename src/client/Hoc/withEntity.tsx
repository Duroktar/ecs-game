import { IEntity, WithComponentMeta, ISystemManager } from "../../engine/types";
import * as React from 'react';
import { MobModel } from "../../game/Domain/mob";
import { CharacterModel } from "../../game/Domain/character";

interface WithEntityProps {
  entity:     IEntity;
  system:     ISystemManager;
  onDeath?:   (entity: IEntity) => void;
}

export type IModelType<P> = { model: WithComponentMeta<P>; system: ISystemManager };

export const withEntity = <P extends MobModel | CharacterModel> (
    Component: React.ComponentType<IModelType<P>>,
): React.ComponentType<WithEntityProps> => {
  function WithEntity(props: WithEntityProps) {
    const { entity, system, ...rest } = props;
    const model = system.getEntityModel<P>(props.entity);
    return <Component {...rest} model={model} system={system} />;
  };

  return WithEntity;
}

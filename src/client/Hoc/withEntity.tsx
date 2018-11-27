import { IEntity, WithComponentMeta, ISystemManager } from "../../lib/types";
import * as React from 'react';
import { DeepReadonly } from "../../react-app-env";
import { MobModel } from "../../game/Domain/mob";
import { CharacterModel } from "../../game/Domain/character";

interface WithEntityProps {
  entity:     IEntity;
  system:     ISystemManager;
  onDeath?:    (entity: IEntity) => void;
}

type IModelType<P> = { model: DeepReadonly<WithComponentMeta<P>> };

export const withEntity = <P extends MobModel | CharacterModel> (
    Component:    React.ComponentType<IModelType<P>>,
): React.ComponentType<WithEntityProps> => {
  function WithEntity(props: WithEntityProps) {
    const { entity, system, ...rest } = props;
    const model = system.getEntityModel<P>(props.entity);
    return <Component {...rest} model={model} />;
  };

  return WithEntity;
}

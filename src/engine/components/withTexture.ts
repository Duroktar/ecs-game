import { IComponent, IEntity, IComponentEvents } from "../types";
import { ISystemManager } from "../interfaces/ISystemManager";
import { factory } from "../utils";

const COMPONENT_NAMESPACE = 'texture';

export type WithTexture = { texture: string | number; };

export function withTextureFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithTexture, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithTexture>>({
        id,
        entityId: entity.id,
        name:     COMPONENT_NAMESPACE,
        state:    { texture: state.texture },
        update:   (system: ISystemManager, component: IWithTextureEntity) => null,
      }))
  }
}

export type IWithTextureEntity = IComponent<WithTexture>

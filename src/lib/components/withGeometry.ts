import { IComponent, ISystemManager, IVector, IEntity } from "../types";
import { factory } from "../utils";

const COMPONENT_NAMESPACE = 'geometry';

export type WithGeometry = { geometry: { width: number; height: number; } };

export function withGeometryFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithGeometry, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithGeometry>>({
        id,
        entityId: entity.id,
        name: COMPONENT_NAMESPACE,
        state: { geometry: { width: state.geometry.width, height: state.geometry.height } },
        update: (system: ISystemManager, component: IWithGeometryEntity) => {
            // handle(entity, component, system);
        },
      }))
  }
}

export type IWithGeometryEntity = IComponent<WithGeometry>

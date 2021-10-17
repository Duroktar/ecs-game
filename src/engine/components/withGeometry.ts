import { IComponent, IEntity, IComponentEvents } from "../types";
import { ISystemManager } from "../interfaces/ISystemManager";
import { factory } from "../utils";

const COMPONENT_NAMESPACE = 'geometry';

export type IGeometry  = { width: number; height: number; };
export type WithGeometry = { geometry: IGeometry };

export function withGeometryFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithGeometry, events: IComponentEvents, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithGeometry>>({
        id,
        entityId: entity.id,
        name: COMPONENT_NAMESPACE,
        state: { geometry: { width: state.geometry.width, height: state.geometry.height } },
        update: (system: ISystemManager, component: IWithGeometryEntity) => null,
      }))
  }
}

export type IWithGeometryEntity = IComponent<WithGeometry>

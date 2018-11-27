import { IComponent, ISystemManager, IVector, IEntity, ISystem } from "../types";
import { factory, isSameEntity, first } from "../utils";

const COMPONENT_NAMESPACE = 'position';

export type WithPosition = { position: IVector; }

export function movableFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithPosition, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithPosition>>({
        id,
        name: COMPONENT_NAMESPACE,
        entityId: entity.id,
        state: { position: state.position },
        update: (system: ISystemManager, component: IComponent<WithPosition>) => { },
      }))
  }
}

export function selectPositionState(system: ISystem, entity: IEntity): null | IComponent<WithPosition> {
  const searchResult = system
    .components
    .filter(o =>
      isSameEntity(o, entity)
      && hasPosition(o.state));

  if (searchResult.length === 0) {
    return null;
  };

  return first(searchResult);
}

export function setPositionState(system: ISystem, entity: IEntity, state: IVector) {
  const component = selectPositionState(system, entity);

  if (component === null) {
    return component;
  }

  component.state.position = state;
}

function hasPosition(state: any) {
  return state.position !== undefined;
}

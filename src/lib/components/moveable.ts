import { IComponent, ISystemManager, IVector, IEntity, ISystem } from "../types";
import { factory, isSameEntity, first } from "../utils";

export type WithMovement = { position: IVector; }

export function movableFactory(system: ISystemManager) {
  return (entity: IEntity, state: WithMovement, id = -1) => {
    return system.registerComponent(
      factory<IComponent<WithMovement>>({
        id,
        name: 'movement',
        entityId: entity.id,
        state: { position: state.position },
        update: (system: ISystemManager, component: IComponent<WithMovement>) => { },
      }))
  }
}

export function selectMovableState(system: ISystem, entity: IEntity): null | IComponent<WithMovement> {
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

export function setMovableState(system: ISystem, entity: IEntity, state: IVector) {
  const component = selectMovableState(system, entity);

  if (component === null) {
    return component;
  }

  component.state.position = state;
}

function hasPosition(state: any) {
  return state.position !== undefined;
}

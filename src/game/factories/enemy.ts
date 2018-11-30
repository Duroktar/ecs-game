import { ISystemManager, IVector, IDimensions, IComponent } from "../../lib/types";
import { createMob } from "../Domain/mob";

export function createEnemy(
    system:     ISystemManager,
    name:       string,
    position?:  IVector,
    geometry?:  IDimensions,
    // sprite?: string,
) {

  const entity = createMob(system, {
    name,

    health: {
      value: 1,
    },

    position: position || {
      x: -999,
      y: -999,
    },

    geometry: geometry ||{
      width:  64,
      height: 64,
    },

    loot: {
      points: 10,
    },
  }, {
    onChange: (component: IComponent, eventName: string) =>
      console.log(`Event: ${eventName}`, component),

    onUpdate: (component: IComponent) => null,
  });

  return entity;
}

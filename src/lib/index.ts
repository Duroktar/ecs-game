import SystemManager from "./SystemManager";
import { createCharacter } from "./domain/character";
import { createMob } from "./domain/mob";
import { saveState, loadStateFromKey, hydrateLoadedComponents } from "./loader";
import { ISerializableState } from "./types";


let system = new SystemManager({
  components: [],
  entities: [],
}, {
  name: 'ECS demo',
  version: '0.0.1',
  logging: true,
})

const player1Entity = createCharacter(system, {
  name: 'Scott',
  health: 100,
  position: {
    x: 150,
    y: 150,
  },
  age: 33,
  direction: {
    x: 0,
    y: 0,
  },
  moving: false,
});

const mobEntity = createMob(system, {
  name: 'Roach',
  health: 150,
  position: {
    x: 100,
    y: 100,
  },
});

const saveGame = () => saveState('ecs', system.getSerializableState());

const loadGame = () => {
  const loaded = loadStateFromKey('ecs');
  if (loaded === null) {
    return;
  }
  const hydratedComponents = hydrateLoadedComponents(system, loaded);
  loaded.system.components = hydratedComponents
  system.loadHydratedState(loaded);
}

export { system, player1Entity, mobEntity, saveGame, loadGame };

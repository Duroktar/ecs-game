import SystemManager from "./SystemManager";
import { createCharacter, CharacterModel } from "./domain/character";
import { createMob } from "./domain/mob";


const system = new SystemManager({
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


export { system, player1Entity, mobEntity };

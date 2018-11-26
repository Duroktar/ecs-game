import SystemManager from "../lib/services/SystemManager";
import StorageManager from "../lib/services/StorageManager";

import { createCharacter } from "./Domain/character";
import { createProjectile } from "./Domain/projectile";


const system = new SystemManager({
  components: [],
  entities: [],
}, {
  name: 'ECS demo',
  version: '0.0.1',
  logging: true,
  screenSize: {
    x: 800,
    y: 600,
  }
})

const playerEntity = createCharacter(system, {
  name: 'Scott',
  age: 33,
  health: 100,
  attackPower: 10,
  speed: 5,

  position: {
    x: 150,
    y: 150,
  },

  direction: {
    x: 0,
    y: 0,
  },

  geometry: {
    width:  64,
    height: 64,
  },

  moving: false,

  attacking: false,
});

function createBullet(x: number = -100, speed: number = 8) {
  return createProjectile(system, {
    health: 0,

    momentum: {
      direction: {
        x: 0,
        y: 1,
      },
      speed,
    },

    position: {
      x: x,
      y: 0,
    },

    geometry: {
        width:  64,
        height: 64,
    },
  });
}

const storage = new StorageManager(system);

const bulletEntity1 = createBullet();
const bulletEntity2 = createBullet();

export { system, playerEntity, storage, bulletEntity1, bulletEntity2 };

import SystemManager from "../lib/services/SystemManager";
import StorageManager from "../lib/services/StorageManager";

import { createCharacter } from "./Domain/character";
import { createProjectile } from "./Domain/projectile";
import { Dimensions, IVector } from "../lib/components/withCollisions";
import { createMob } from "./Domain/mob";


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
  health: 1,
  attackPower: 10,
  speed: {
    y: 0,
    x: 6,
  },

  position: {
    x: 400,
    y: 475,
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

export function createBullet(name: string, x: number = -100, speed: number = 8) {
  return createProjectile(system, {
    name,
    health: 0,

    momentum: {
      direction: {
        x: 0,
        y: -1,
      },
      speed,
    },

    position: {
      x: x,
      y: 440,
    },

    geometry: {
      width:  2,
      height: 32,
    },
  });
}

export function createEnemy(name: string, position?: IVector, geometry?: Dimensions, sprite?: string) {
  return createMob(system, {
    name,
    
    health: 1,

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
    }
  });
}

const storage = new StorageManager(system);

const bulletEntity1 = createBullet('Bullet of destiny');
const bulletEntity2 = createBullet('Bullet of greater ham');

const enemy1 = createEnemy('Godzilla');

export { system, playerEntity, storage, bulletEntity1, bulletEntity2, enemy1 };

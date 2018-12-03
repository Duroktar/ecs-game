import { ISystemManager, EntityIdType, IEntity } from '../../engine/types';
import { ILoadedEnemy } from '../Levels/types';
import {useEffect, useState} from 'react';

import { loadLevel } from '../utils';

import { once } from '../../engine/utils';
import { ON_ENEMY_DEATH, ON_LEVEL_COMPLETE } from '../../events';

function arrayRandom(items: any[]) {
  return items[Math.floor(Math.random()*items.length)];
}


export const withGameLevelState = (options: WithGameLevelStateOptions) => {
  const [ready, setReady] = useState(false);
  const [enemies, setEnemies] = useState([] as ILoadedEnemy[]);
  const [alive, setAlive] = useState([] as EntityIdType[]);
  const [enemiesDead, setEnemiesDead] = useState(0);

  const onLevelComplete = (system: ISystemManager, level: number | string) => {
    once(() => system.events.emit(ON_LEVEL_COMPLETE, level))
  }

  const countDeath = (entity: IEntity) => {
    if (!ready) {
      return;
    }

    setEnemiesDead(enemiesDead + 1);

    debugger;
    setAlive(alive.filter(o => o !== entity.id));
  }

  if (enemiesDead === enemies.length) {
    ready && onLevelComplete(options.system, options.levelId);
  }

  useEffect(() => {
    const enemies = loadLevel(options.system, options.enemyPositions);
        
    setEnemies(enemies);
    setAlive(enemies.map(o => o.entity.id));

    options.system.events.registerEvent(ON_ENEMY_DEATH, countDeath)

    setReady(true);

    return function cleanup() {
      options.system.events
        .unRegisterEvent(ON_ENEMY_DEATH, countDeath);
      
      enemies.forEach(o => options.system
        .unRegisterEntity(o.entity.id)
      );
    }
  }, [options.levelId]);

  return { enemies, enemiesDead, ready };
};

type WithGameLevelStateOptions = {
  system:         ISystemManager;
  enemyPositions: number[][];
  levelId:        string | number;
}

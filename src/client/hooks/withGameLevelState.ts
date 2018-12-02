import { ISystemManager, IEntity } from '../../lib/types';
import {useEffect, useState} from 'react';

import { loadLevel } from '../utils';

import { once } from '../../lib/utils';
import { ON_ENEMY_DEATH, ON_LEVEL_COMPLETE } from '../../events';


export const withGameLevelState = (options: WithGameLevelStateOptions) => {
  const [ready, setReady] = useState(false);
  const [enemies, setEnemies] = useState([] as IEntity[]);
  const [enemiesDead, setEnemiesDead] = useState(0);

  const onLevelComplete = (system: ISystemManager, level: number | string) => {
    once(() => system.events.emit(ON_LEVEL_COMPLETE, level))
  }

  const countDeath = () => {
    ready && setEnemiesDead(enemiesDead + 1)
  }

  if (enemiesDead === enemies.length) {
    ready && onLevelComplete(options.system, options.levelId);
  }

  useEffect(() => {
    const enemies = loadLevel(options.system, options.enemyPositions);

    setEnemies(enemies);
    setReady(true);

    options.system.events.registerEvent(ON_ENEMY_DEATH, countDeath)

    return function cleanup() {
      options.system.events
        .unRegisterEvent(ON_ENEMY_DEATH, countDeath);
      
      enemies.forEach(o => options.system
        .unRegisterEntity(o.id)
      );
    }
  })

  return { enemies, enemiesDead, ready };
};

type WithGameLevelStateOptions = {
  system:         ISystemManager;
  enemyPositions: number[][];
  levelId:        string | number;
}

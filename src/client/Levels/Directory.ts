import { Demo } from "./Demo/Demo";
import { Level1 } from "./1/Level.1";
import { Level2 } from "./2/Level.2";
import { Level3 } from "./3/Level.3";
import { End } from "./End/End";
import { ILevel, ILevels } from "./types";

export const Levels = {
	demo: 		{
    level: Demo,
    next: 'level1',
  },
	level1: 	{
    level: Level1,
    next: 'level2',
  },
	level2: 	{
    level: Level2,
    next: 'level3',
  },
	level3: 	{
    level: Level3,
    next: 'end',
  },
	end: 	{
    level: End,
    next: 'demo',
  },
}

export const humanizedLevelNames = {
  demo:   'Demo',
  level1: '1',
  level2: '2',
  level3: '3',
  end:    'End',
}

export function getThisLevel(current: ILevel, directory: ILevels = Levels) {
  return directory[current].level;
}

export function getNextLevel(current: ILevel, directory: ILevels = Levels) {
  return directory[current].next as ILevel;
}

import { ISystemManager, IEntity } from "../../lib/types";
import { IGameState } from "../../game/types";
import { Levels } from "./Directory";

export type LoaderFunc = (system: ISystemManager, enemyPositions: number[][]) => IEntity[];

export interface LevelProps {
  system:       ISystemManager;
  loadLevel:    LoaderFunc;
  state:        IGameState;
}

export type ILevels = typeof Levels;
export type ILevel = keyof ILevels;

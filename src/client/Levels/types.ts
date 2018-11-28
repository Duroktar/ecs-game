import { ISystemManager, IEntity } from "../../lib/types";
import { IGameState } from "../../types";
import { Levels } from "./Loader";

export type LoaderFunc = (system: ISystemManager, enemyPositions: number[][]) => IEntity[];

export interface LevelProps {
  system:       ISystemManager;
  loadLevel:    LoaderFunc;
  state:        IGameState;
  onEnemyDeath: (entity: IEntity) => void;
}

export type ILevels = typeof Levels;
export type ILevel = keyof ILevels;

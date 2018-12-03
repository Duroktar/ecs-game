import { ISystemManager, IEntity } from "../../engine/types";
import { IGameState } from "../../game/types";
import { Levels } from "./Directory";
import { WithTextureProps } from "../Hoc/withTexture";

export type LoaderFunc = (system: ISystemManager, enemyPositions: number[][]) => ILoadedEnemy[];

export type ILoadedEnemy = {
  entity: IEntity;
  component: React.ComponentType<WithTextureProps>;
};

export interface LevelProps {
  system:       ISystemManager;
  loadLevel:    LoaderFunc;
  state:        IGameState;
}

export type ILevels = typeof Levels;
export type ILevel = keyof ILevels;

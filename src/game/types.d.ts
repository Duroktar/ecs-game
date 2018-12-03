import { ISystemManager, WithId } from "../engine/types";
import { CharacterModel } from "./Domain/character";
import { ProjectileModel } from "./Domain/projectile";
import { ILevel } from "../client/Levels/types";

export interface IGameState {
  system:   ISystemManager;
  player:   WithId<CharacterModel>;
  bullet1:  WithId<ProjectileModel>;
  bullet2:  WithId<ProjectileModel>;
}

export interface ICurrentGameState {
  shots:          number;
  hits:           number;
  score:          number;
  credits:        number;
  lives:          number;
  complete:       boolean;
  completed:      (string | number)[];
  currentLevel:   ILevel;
}

export interface IPointsLoot {
  points: number;
}

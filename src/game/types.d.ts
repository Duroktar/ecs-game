import { ISystemManager, WithId } from "../lib/types";
import { CharacterModel } from "./Domain/character";
import { ProjectileModel } from "./Domain/projectile";

export interface IGameState {
  system:   ISystemManager;
  player:   WithId<CharacterModel>;
  bullet1:  WithId<ProjectileModel>;
  bullet2:  WithId<ProjectileModel>;
}

export interface IPointsLoot {
  points: number;
}

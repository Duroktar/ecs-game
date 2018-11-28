import { ISystemManager, WithId } from "../lib/types";
import { CharacterModel } from "./Domain/character";
import { ProjectileModel } from "./Domain/projectile";

interface IGameState {
  system:   ISystemManager;
  player:   WithId<CharacterModel>;
  bullet1:  WithId<ProjectileModel>;
  bullet2:  WithId<ProjectileModel>;
}

interface IPointsLoot {
  points: number;
}

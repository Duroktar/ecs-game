import { WithId } from "../engine/types";
import { ISystemManager } from "../engine/interfaces/ISystemManager";
import { CharacterModel } from "./Domain/character";
import { ProjectileModel } from "./Domain/projectile";
import { ILevel } from "../app/Levels/types";
import { Screens } from "../app/Screens";

export interface IGameState {
  epoch:    number;
  player:   WithId<CharacterModel>;
  bullet1:  WithId<ProjectileModel>;
  bullet2:  WithId<ProjectileModel>;
  final?:   ICurrentGameState;
  screen:   Screens;
  system:   ISystemManager;
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

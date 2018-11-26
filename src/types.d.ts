import { ISystemManager } from "./lib/types";
import { CharacterModel } from "./game/Domain/character";
import { ProjectileModel } from "./game/Domain/projectile";

interface GameState {
    system:  ISystemManager;
    player:  CharacterModel;
    bullet1: ProjectileModel;
    bullet2: ProjectileModel;
  }
  
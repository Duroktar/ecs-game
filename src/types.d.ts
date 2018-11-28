import { ISystemManager, WithId } from "./lib/types";
import { CharacterModel } from "./game/Domain/character";
import { ProjectileModel } from "./game/Domain/projectile";
import { MobModel } from "./game/Domain/mob";

interface IGameState {
  system:   ISystemManager;
  player:   WithId<CharacterModel>;
  bullet1:  WithId<ProjectileModel>;
  bullet2:  WithId<ProjectileModel>;
}

interface IPointsLoot {
  points: number;
}

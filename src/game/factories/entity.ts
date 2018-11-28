import { ISystemManager } from "../../lib/types";
import { createCharacter,   CharacterModel } from "../Domain/character";
import { createProjectile,  ProjectileBase } from "../Domain/projectile";
import { createMob,         MobModel } from "../Domain/mob";

interface EntityFactories {
  character:  CharacterModel;
  mob:        MobModel;
  projectile: ProjectileBase;
}

const entityFactory = (system: ISystemManager) => {
  return {
    create: <K extends keyof EntityFactories>(type: K, options: EntityFactories[K]) => {

      if (type === 'character') {
        return createCharacter(system, options as CharacterModel);
      }

      if (type === 'mob') {
        return createMob(system, options as MobModel);
      }

      if (type === 'projectile') {
        return createProjectile(system, options as ProjectileBase);
      }

      throw new Error(`No factory for type: ${type} `);
    }
  }
}

export default entityFactory;

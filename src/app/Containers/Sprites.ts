
import { SpriteTextureIds } from "../../game/catalogue";
import { ConnectedPlayer } from "./Player/Player";
import { AnimatedBug, AnimatedCrabBug, AnimatedHelmetBug, AnimatedPincerBug, AnimatedSonicBug } from "./NPCs";


export const SpriteTextureCollection: TextureIdIndexed = {
    [SpriteTextureIds.Player]:      ConnectedPlayer,
    [SpriteTextureIds.Bug]:         AnimatedBug,
    [SpriteTextureIds.CrabBug]:     AnimatedCrabBug,
    [SpriteTextureIds.HelmetBug]:   AnimatedHelmetBug,
    [SpriteTextureIds.PincerBug]:   AnimatedPincerBug,
    [SpriteTextureIds.SonicBug]:    AnimatedSonicBug,
}

type TextureIdIndexed = { [K in SpriteTextureIds]: any; }

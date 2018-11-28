import StorageManager from "../lib/services/StorageManager";
import { createSystem } from "./factories/system";

const system = createSystem({ name: 'Galaga' })
const storage = new StorageManager(system);

export { system, storage };

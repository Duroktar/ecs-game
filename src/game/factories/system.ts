import SystemManager from "../../lib/services/SystemManager";

type SystemArgs = { name: string; version?: string; logging?: boolean; }

export function createSystem({
  name,
  version = '1',
  logging = true,
}: SystemArgs) {

  const system = new SystemManager({
    components: [],
    entities: [],
  }, {
    name,
    version,
    logging,
    screenSize: {
      x: 800,
      y: 600,
    }
  })

  return system;
}

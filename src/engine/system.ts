import SystemManager from "./services/SystemManager";

type SystemArgs = {
  name:     string;
  version?: string;
  logging?: boolean;
  screenSize?: {
    x: number
    y: number
  }
}

export function createSystem({
  name,
  version = '1',
  logging = true,
  screenSize = {
    x: 800,
    y: 600,
  },
}: SystemArgs) {

  const system = new SystemManager({
    name,
    version,
    logging,
    screenSize,
  })

  return system;
}

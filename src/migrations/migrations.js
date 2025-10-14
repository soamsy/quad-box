import { migrateToV2 } from "./v2"
import { migrateToV3 } from "./v3"

export const migrateSettings = (settings) => {
  settings = migrateToV2(settings)
  settings = migrateToV3(settings)
  return settings
}
import "server-only";

import { z } from "zod";
import { serverOnlyEnvSchema } from "./schemas/server_only_env_schema";

enum ServerOnlyEnv {
  EMAIL_HOST = "EMAIL_HOST",
  EMAIL_ADDRESS = "EMAIL_ADDRESS",
  EMAIL_PASSWORD = "EMAIL_PASSWORD",
  RECAPTCHA_SECRET_KEY = "RECAPTCHA_SECRET_KEY",
  GOOGLE_PLACES_API_KEY = "GOOGLE_PLACES_API_KEY",
  MONGO_DB_URI = "MONGO_DB_URI",
}

let cached: z.infer<typeof serverOnlyEnvSchema> | undefined;

export function getServerOnlyEnv() {
  if (!cached) {
    cached = serverOnlyEnvSchema.parse({
      EMAIL_HOST: globalThis.process.env[ServerOnlyEnv.EMAIL_HOST],
      EMAIL_ADDRESS: globalThis.process.env[ServerOnlyEnv.EMAIL_ADDRESS],
      EMAIL_PASSWORD: globalThis.process.env[ServerOnlyEnv.EMAIL_PASSWORD],
      RECAPTCHA_SECRET_KEY:
        globalThis.process.env[ServerOnlyEnv.RECAPTCHA_SECRET_KEY],
      GOOGLE_PLACES_API_KEY:
        globalThis.process.env[ServerOnlyEnv.GOOGLE_PLACES_API_KEY],
      MONGO_DB_URI: globalThis.process.env[ServerOnlyEnv.MONGO_DB_URI],
    });
  }

  return cached;
}

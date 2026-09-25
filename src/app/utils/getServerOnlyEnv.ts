import "server-only";

import { serverOnlyEnvSchema } from "./schemas/server_only_env_schema";

const ENV_KEYS = [
  "EMAIL_HOST",
  "EMAIL_ADDRESS",
  "EMAIL_PASSWORD",
  "RECAPTCHA_SECRET_KEY",
  "GOOGLE_PLACES_API_KEY",
  "GOOGLE_MAPS_API_KEY",
  "MONGO_DB_URI",
];

export type ServerOnlyEnv = {
  EMAIL_HOST: string;
  EMAIL_ADDRESS: string;
  EMAIL_PASSWORD: string;
  RECAPTCHA_SECRET_KEY: string;
  GOOGLE_PLACES_API_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  MONGO_DB_URI: string;
};

let cached: ServerOnlyEnv | undefined;

export function getServerOnlyEnv(): ServerOnlyEnv {
  if (cached) {
    return cached;
  }

  const source = Object.fromEntries(
    ENV_KEYS.map((key) => [key, globalThis.process.env[key]]),
  );

  cached = serverOnlyEnvSchema.parse(source);
  return cached;
}

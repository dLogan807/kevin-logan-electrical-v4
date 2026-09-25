import { z } from "zod";

const optionalEnvString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

export const serverOnlyEnvSchema = z.object({
  EMAIL_HOST: z.string().min(1),
  EMAIL_ADDRESS: z.email(),
  EMAIL_PASSWORD: z.string().min(1),
  RECAPTCHA_SECRET_KEY: z.string().min(1),
  GOOGLE_PLACES_API_KEY: optionalEnvString,
  GOOGLE_MAPS_API_KEY: optionalEnvString,
  MONGO_DB_URI: z.string().min(1),
});

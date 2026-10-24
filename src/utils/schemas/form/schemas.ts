import { contactFormSchema } from "./contactFormSchema";
import { loginFormSchema } from "./loginFormSchema";

export const schemas = {
  login: loginFormSchema,
  contact: contactFormSchema,
} as const;

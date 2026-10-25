import { LoginFormValues } from "@/types/formValues";
import { z, ZodType } from "zod";

export const loginFormSchema: ZodType<LoginFormValues> = z.object({
  username: z.string().min(1, { message: "Please enter a username" }),
  password: z.string().min(1, { message: "Please enter a password" }),
  turnstileToken: z
    .string()
    .min(1, { message: "Please complete the turnstile" }),
  website: z.string().optional(),
});

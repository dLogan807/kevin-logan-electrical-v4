import { LoginFormData } from "@/components/login/login_form";
import { z, ZodType } from "zod";

export const loginFormSchema: ZodType<LoginFormData> = z.object({
  username: z.string().min(1, { message: "Please enter a username" }),
  password: z.string().min(1, { message: "Please enter a password" }),
});

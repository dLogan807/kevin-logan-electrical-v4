import { ContactFormValues } from "@/types/formValues";
import { z, ZodType } from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

export const contactFormSchema: ZodType<ContactFormValues> = z.object({
  name: z.string().min(1, { message: "Please enter your name" }),
  email: z.email({ message: "Please enter a valid email" }),
  phone: z.union([
    z
      .string()
      .regex(phoneRegex, { message: "Please enter a valid phone number" }),
    z.literal(""),
  ]),
  jobDetails: z.intersection(
    z.string().min(1, { message: "Please enter a few details" }),
    z.string().max(2000, { message: "Sorry, maximum 2000 characters" }),
  ),
  turnstileToken: z
    .string()
    .min(1, { message: "Please complete the turnstile" }),
  website: z.string().optional(),
});

import { ContactFormData } from "@/components/contact_form";
import { z, ZodType } from "zod";

export const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const schema: ZodType<ContactFormData> = z.object({
  name: z.string().min(1, { message: "Please enter your name" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.union([
    z
      .string()
      .regex(phoneRegex, { message: "Please enter a valid phone number" }),
    z.literal(""),
  ]),
  jobDetails: z.intersection(
    z.string().min(1, { message: "Please enter a few details" }),
    z.string().max(2000, { message: "Sorry, maximum 2000 characters" })
  ),
});

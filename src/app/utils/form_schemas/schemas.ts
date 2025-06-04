import { ContactFormData } from "@/components/contact_form/contact_form";
import { contactFormSchema } from "./contact";
import { loginFormSchema } from "./login";
import { LoginFormData } from "@/components/login/login_form";

export enum FormType {
  // eslint-disable-next-line no-unused-vars
  CONTACT_US = "contact_us",
  // eslint-disable-next-line no-unused-vars
  LOGIN = "login",
}

export type FormSchema = typeof contactFormSchema | typeof loginFormSchema;

export type FormValues = ContactFormData | LoginFormData;

//Map of form types to their schemas
const formSchemas: Record<FormType, FormSchema> = {
  [FormType.CONTACT_US]: contactFormSchema,
  [FormType.LOGIN]: loginFormSchema,
} as const;

export function getFormSchema(formType: FormType): FormSchema {
  return formSchemas[formType];
}

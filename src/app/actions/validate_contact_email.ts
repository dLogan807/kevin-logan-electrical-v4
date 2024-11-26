"use server";

import { ContactFormData } from "@/components/contact_form";
import { schema } from "@/utils/contact_form_validation";

export type ContactFormResponse = {
  validated: boolean;
  errors: { [k: string]: string };
};

//Validate and return whether successful and any errors
export async function validateContactEmail(
  fieldsJSON: string
): Promise<string> {
  const fields: ContactFormData = JSON.parse(fieldsJSON);

  const result = schema.safeParse({
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    jobDetails: fields.jobDetails,
  });

  //Map zod errors to form errors
  const errors = Object.fromEntries(
    result.error?.issues?.map((issue) => [issue.path[0], issue.message]) || []
  );

  const response: ContactFormResponse = {
    validated: result.success,
    errors: errors,
  };

  return JSON.stringify(response);
}

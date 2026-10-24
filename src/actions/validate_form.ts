"use server";

import { verifyRecaptcha } from "@/actions/validate_recaptcha";
import { FormKind } from "@/types/formKind";
import { schemas } from "@/utils/schemas/form/schemas";

export type FormResponse = {
  validated: boolean;
  formErrors: { [k: string]: string };
  recaptchaVerified: boolean;
  submitError?: boolean;
};

//Validate and return whether successful and any errors
export async function validateForm<T>(
  kind: FormKind,
  formValues: T,
  token: string,
  action: string,
): Promise<FormResponse> {
  const schema = schemas[kind];
  const parseResult = schema.safeParse(formValues);

  //Map zod errors to form errors
  const formParseErrors = Object.fromEntries(
    parseResult.error?.issues?.map((issue) => [issue.path[0], issue.message]) ||
      [],
  );

  const response: FormResponse = {
    validated: parseResult.success,
    formErrors: formParseErrors,
    recaptchaVerified: false,
  };

  if (Object.values(formParseErrors).length > 0) {
    return response;
  }

  //Check recaptcha
  response.recaptchaVerified = token
    ? await verifyRecaptcha(token, action)
    : true;

  return response;
}

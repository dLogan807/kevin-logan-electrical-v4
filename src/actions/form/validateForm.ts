"use server";

import { verifyTurnstileCaptcha } from "@/actions/cloudflare/verifyTurnstileCaptcha";
import { FormKind } from "@/types/formKind";
import { FormResponse } from "@/types/formReponse";
import { CloudflareTurnstileFormValues } from "@/types/formValues";
import { schemas } from "@/utils/schemas/form/schemas";

//Validate and return whether successful and any errors
export async function validateForm<T extends CloudflareTurnstileFormValues>(
  kind: FormKind,
  formValues: T,
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
    turnstileVerfied: false,
  };

  if (Object.values(formParseErrors).length > 0) {
    return response;
  }

  //Check recaptcha
  response.turnstileVerfied = await verifyTurnstileCaptcha(
    formValues.turnstileToken,
  );

  return response;
}

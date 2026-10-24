"use server";

import { validateForm } from "@/actions/form/validateForm";
import { ContactFormValues } from "@/types/formValues";
import { sendContactEmail } from "@/actions/email/sendContactEmail";
import { ContactFormResponse } from "@/types/formReponse";

//Validate and return whether successful and any errors
export async function validateContactEmail(
  formValues: ContactFormValues,
  token: string,
  action: string,
): Promise<ContactFormResponse> {
  const validationResult = await validateForm<ContactFormValues>(
    "contact",
    formValues,
    token,
    action,
  );

  const response: ContactFormResponse = {
    ...validationResult,
    sendSuccess: false,
  };

  if (!response.validated || !response.recaptchaVerified) {
    return response;
  }

  //Likely bot if filled
  if (formValues.website) {
    response.recaptchaVerified = false;
    return response;
  }

  response.sendSuccess = await sendContactEmail(formValues);

  return response;
}

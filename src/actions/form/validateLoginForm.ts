"use server";

import { LoginFormResponse } from "@/types/formReponse";
import { LoginFormValues } from "@/types/formValues";
import { setSessionTokenCookie } from "@/actions/mongodb/sessions/cookie";
import { validateForm } from "./validateForm";
import { login } from "@/actions/mongodb/sessions/login";

export async function validateLoginForm(
  formValues: LoginFormValues,
  token: string,
  action: string,
): Promise<LoginFormResponse> {
  const validationResult = await validateForm<LoginFormValues>(
    "login",
    formValues,
    token,
    action,
  );

  const response: LoginFormResponse = {
    ...validationResult,
    sessionCreated: false,
  };

  if (!response.validated || !response.recaptchaVerified) {
    return response;
  }

  //Likely bot if filled
  if (formValues.website) {
    response.recaptchaVerified = false;
    return response;
  }

  const session = await login(formValues);

  if (session !== null) {
    await setSessionTokenCookie(session.token, session.expires_at);
    response.sessionCreated = true;
  }

  return response;
}

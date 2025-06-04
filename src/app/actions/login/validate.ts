"use server";

import { LoginFormData } from "@/components/login/login_form";
import { verifyPasswordHash } from "@/actions/login/password";
import MongoDatabase from "@/actions/mongodb/db";
import {
  createSession,
  generateSessionToken,
  UserDocument,
} from "@/actions/mongodb/sessions/management";
import { FormResponse, validateForm } from "@/actions/validate_form";
import { FormType } from "@/utils/form_schemas/schemas";
import { setSessionTokenCookie } from "@/actions/mongodb/sessions/cookie";

type SessionInfo = {
  token: string;
  expires_at: Date;
};

export type LoginFormResponse = FormResponse & {
  sessionCreated: boolean;
};

async function validateUser(
  formValues: LoginFormData
): Promise<SessionInfo | null> {
  const query = {
    username: formValues.username,
  };
  const userDocument: UserDocument | null = await MongoDatabase.getDocument(
    "users",
    query
  );

  if (
    userDocument &&
    (await verifyPasswordHash(userDocument.hashedPassword, formValues.password))
  ) {
    const token = await generateSessionToken();
    const session = await createSession(token, userDocument._id);

    return {
      token: token,
      expires_at: session.expires_at,
    };
  }

  return null;
}

//Validate and return whether successful and any errors
export async function validateLoginForm(
  formValues: LoginFormData,
  token: string,
  action: string
): Promise<LoginFormResponse> {
  const validationResult: FormResponse = await validateForm(
    FormType.LOGIN,
    formValues,
    token,
    action
  );

  var response: LoginFormResponse = {
    ...validationResult,
    sessionCreated: false,
  };

  if (!response.validated || !response.recaptchaVerified) {
    return response;
  }

  //Likely bot if filled
  if (formValues.email) {
    response.recaptchaVerified = false;
    return response;
  }

  const session: SessionInfo | null = await validateUser(formValues);

  if (session !== null) {
    await setSessionTokenCookie(session.token, session.expires_at);
    response.sessionCreated = true;
  }

  return response;
}

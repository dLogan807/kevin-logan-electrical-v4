"use server";

import { schema } from "@/utils/login_form_validation";
import { verifyRecaptcha } from "../validate_recaptcha";
import { LoginFormData } from "@/components/login/login_form";
import { verifyPasswordHash } from "./password";
import MongoDatabase from "@/actions/mongodb/db";
import {
  createSession,
  generateSessionToken,
  UserDocument,
} from "../mongodb/sessions/management";

type SessionInfo = {
  token: string;
  expires_at: Date;
};

export type LoginFormResponse = {
  validated: boolean;
  recaptchaVerified: boolean;
  formErrors: { [k: string]: string };
  session: SessionInfo | null;
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
  const parseResult = schema.safeParse({
    username: formValues.username,
    password: formValues.password,
  });

  //Map zod errors to form errors
  const errors = Object.fromEntries(
    parseResult.error?.issues?.map((issue) => [issue.path[0], issue.message]) ||
      []
  );

  var response: LoginFormResponse = {
    validated: parseResult.success,
    recaptchaVerified: false,
    formErrors: errors,
    session: null,
  };

  //Likely bot if filled
  if (formValues.email != undefined && formValues.email != "") return response;

  //Check recaptcha
  response.recaptchaVerified = token
    ? await verifyRecaptcha(token, action)
    : true;

  if (response.validated && response.recaptchaVerified) {
    response.session = await validateUser(formValues);
  }

  return response;
}

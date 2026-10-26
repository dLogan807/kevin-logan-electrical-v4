"use server";

import MongoDatabase from "@/actions/mongodb/db";
import {
  createSession,
  generateSessionToken,
  UserDocument,
} from "@/actions/mongodb/sessions/management";
import { verify } from "@node-rs/argon2";
import { LoginFormValues } from "@/types/formValues";

export type SessionInfo = {
  token: string;
  expires_at: Date;
};

export async function login(
  formValues: LoginFormValues,
): Promise<SessionInfo | null> {
  const query = {
    username: formValues.username,
  };
  const userDocument: UserDocument | null =
    await MongoDatabase.getDocument<UserDocument>("users", query);

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

async function verifyPasswordHash(
  hashedPassword: string,
  password: string,
): Promise<boolean> {
  return await verify(hashedPassword, password);
}

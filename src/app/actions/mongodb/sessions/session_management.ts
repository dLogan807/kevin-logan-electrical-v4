"use server";

import MongoDatabase, { JoinMatchInput } from "../db_handler";
import { SessionMongoSchema } from "./session_schemas";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { ObjectId } from "mongodb";

//Derived from Lucia under their Zero-Clause BSD license (https://github.com/lucia-auth/lucia/blob/main/LICENSE-0BSD)

export interface SessionDocument {
  session_id: string;
  user_id: ObjectId;
  expires_at: Date;
}

export interface UserDocument {
  username: string;
}

export type SessionValidationResult =
  | { session: SessionDocument; user: UserDocument }
  | { session: null; user: null };

export function generateSessionToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: ObjectId
): Promise<SessionDocument> {
  if (!token || !userId) throw "token and userId must be provided";

  const sessionId: string = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token))
  );
  const day: number = 1000 * 60 * 60 * 24;
  const session: SessionDocument = {
    session_id: sessionId,
    user_id: userId,
    expires_at: new Date(Date.now() + day * 30),
  };
  const collectionName = "user_sessions";

  await MongoDatabase.createCollection(collectionName, SessionMongoSchema);
  await MongoDatabase.addDocument(collectionName, session);

  return session;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  //Hash token
  const sessionId: string = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token))
  );

  const joinRequiredValues: JoinMatchInput = {
    localCollection: "user_sessions",
    localField: "user_id",
    localMatchFieldName: "session_id",
    matchWithValue: sessionId,
    foreignCollection: "users",
    foreignField: "_id",
  };

  const result: any | null =
    await MongoDatabase.getJoinedDocumentMatchingValue(joinRequiredValues);
  if (result === null) return { session: null, user: null };

  const session: SessionDocument = {
    session_id: result.session_id,
    user_id: result.user_id,
    expires_at: result.expires_at,
  };

  const user: UserDocument = {
    username: result.joined_document[0].username,
  };

  //If session expired, invalidate by deleting
  if (Date.now() >= session.expires_at.getTime()) {
    await MongoDatabase.deleteDocument(
      "user_sessions",
      "session_id",
      sessionId,
      false
    );
    return { session: null, user: null };
  }

  //Extend session
  const day: number = 1000 * 60 * 60 * 24;
  if (Date.now() >= session.expires_at.getTime() - day * 15) {
    session.expires_at = new Date(Date.now() + day * 30);
    MongoDatabase.updateDocument(
      "user_sessions",
      "session_id",
      session.session_id,
      "expires_at",
      session.expires_at
    );
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  MongoDatabase.deleteDocument("user_sessions", "session_id", sessionId, false);
}

export async function invalidateAllSessions(userId: ObjectId): Promise<void> {
  MongoDatabase.deleteDocument("user_sessions", "user_id", userId, true);
}

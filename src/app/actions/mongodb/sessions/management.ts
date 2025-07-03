"use server";

//Derived from Lucia under their Zero-Clause BSD license (https://github.com/lucia-auth/lucia/blob/main/LICENSE-0BSD)

import MongoDatabase from "../db";
import { Document, Filter, ObjectId, UpdateFilter } from "mongodb";

import { SessionMongoSchema } from "./schemas";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { deleteSessionTokenCookie, getCurrentSession } from "./cookie";
import { redirect } from "next/navigation";

export interface SessionDocument {
  session_id: string;
  user_id: ObjectId;
  expires_at: Date;
}

export interface UserDocument {
  _id: ObjectId;
  username: string;
  hashedPassword: string;
}

export type SessionValidationResult =
  | { session: SessionDocument; user: UserDocument }
  | { session: null; user: null };

export async function generateSessionToken(): Promise<string> {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

async function hashSessionToken(token: string): Promise<string> {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export async function createSession(
  token: string,
  userId: ObjectId
): Promise<SessionDocument> {
  if (!token || !userId) throw new Error("token and userId must be provided");

  const sessionId: string = await hashSessionToken(token);
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
  const sessionId: string = await hashSessionToken(token);

  const match: Document = {
    $match: {
      session_id: sessionId,
    },
  };

  const lookup: Document = {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "joined_document",
    },
  };

  const result: Document | null = await MongoDatabase.getInnerJoinedDocument(
    "user_sessions",
    match,
    lookup
  );
  if (result === null) return { session: null, user: null };

  const session: SessionDocument = {
    session_id: result.session_id,
    user_id: result.user_id,
    expires_at: result.expires_at,
  };

  const user: UserDocument = {
    _id: result.joined_document[0]._id,
    username: result.joined_document[0].username,
    hashedPassword: result.joined_document[0].password,
  };

  //If session expired
  if (Date.now() >= session.expires_at.getTime()) {
    await invalidateSession(sessionId);
    return { session: null, user: null };
  }

  //Extend session
  const day: number = 1000 * 60 * 60 * 24;
  if (Date.now() >= session.expires_at.getTime() - day * 15) {
    session.expires_at = new Date(Date.now() + day * 30);

    const query: Filter<Document> = {
      session_id: session.session_id,
    };
    const document: UpdateFilter<Document> = {
      $set: {
        expires_at: session.expires_at,
      },
    };

    MongoDatabase.updateDocument("user_sessions", query, document);
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  const query: Filter<Document> = {
    session_id: sessionId,
  };
  MongoDatabase.deleteDocument("user_sessions", query, false);
}

export async function invalidateAllSessions(userId: ObjectId): Promise<void> {
  const query: Filter<Document> = {
    user_id: userId,
  };
  MongoDatabase.deleteDocument("user_sessions", query, true);
}

export async function logout() {
  const sessionId = (await getCurrentSession()).session?.session_id;
  if (sessionId) await invalidateSession(sessionId);

  await deleteSessionTokenCookie();

  redirect("/login?logout=success");
}

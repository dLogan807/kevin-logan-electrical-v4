"use server";

import { getServerOnlyEnv } from "@/utils/getServerOnlyEnv";

export type RecaptchaResponse = {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  "error-codes"?: string[];
};

export async function verifyRecaptcha(
  token: string,
  action: string,
): Promise<boolean> {
  if (process.env.NODE_ENV === "development") return true;

  const secretKey = getServerOnlyEnv().RECAPTCHA_SECRET_KEY;

  if (!token || !action || !secretKey) return false;

  let data: RecaptchaResponse;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      cache: "no-store",
      body: new URLSearchParams({ secret: secretKey, response: token }),
    });

    if (!res.ok) return false;

    data = await res.json();
  } catch {
    return false;
  }

  return data.success && data.score > 0.5 && data.action === action;
}

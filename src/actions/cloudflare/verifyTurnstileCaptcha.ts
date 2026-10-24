"use server";

import { getServerOnlyEnv } from "@/utils/getServerOnlyEnv";

export type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileCaptcha(token?: string): Promise<boolean> {
  if (process.env.NODE_ENV === "development") return true;

  const turnstileSecretKey = getServerOnlyEnv().CLOUDFLARE_TURNSTILE_SECRET_KEY;

  if (!token) return false;

  let result: TurnstileResponse;
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: new URLSearchParams({
          secret: turnstileSecretKey,
          response: token,
        }),
      },
    );

    if (!response.ok) return false;

    result = await response.json();
  } catch {
    return false;
  }

  return result.success;
}

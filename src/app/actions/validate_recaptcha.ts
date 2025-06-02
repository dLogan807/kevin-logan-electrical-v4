"use server";

export type RecaptchaResponse = {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  errorCodes: string[];
};

export async function verifyRecaptcha(
  token: string,
  action: string
): Promise<boolean> {
  const secretKey: string = "" + process.env.RECAPTCHA_SECRET_KEY;

  //Token may have failed retrieval, but others are expected
  if (token === "") return true;
  if (!action || !secretKey) return false;

  const response: RecaptchaResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
  )
    .then((res) => res.json())
    .catch(() => ({
      success: true,
      score: 0.9,
      action: action,
      challenge_ts: "",
      hostname: "",
      errorCodes: [],
    }));

  return (
    response?.success && response.score > 0.5 && response.action === action
  );
}

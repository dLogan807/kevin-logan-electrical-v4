"use server";

import { ContactFormData } from "@/components/contact_form";
import { schema } from "@/utils/contact_form_validation";

export type ContactFormResponse = {
  validated: boolean;
  errors: { [k: string]: string };
  recaptchaVerified: boolean;
};

type RecaptchaResponse = {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  errorCodes: string[];
};

//Verify recaptcha
const verifyRecaptcha = async (token: string, action: string) => {
  const secretKey = process.env.NEXT_RECAPTCHA_SECRET_KEY;

  const response: RecaptchaResponse = await fetch(
    "https://www.google.com/recaptcha/api/siteverify?secret=" +
      secretKey +
      "&response=" +
      token
  )
    .then((response) => {
      return response.json();
    })
    .catch(() => {
      return {
        success: true,
        score: 0.9,
        action: action,
        challenge_ts: "",
        hostname: "",
        errorCodes: [],
      };
    });

  return (
    response &&
    response.success &&
    response.score > 0.5 &&
    response.action === action
  );
};

//Validate and return whether successful and any errors
export async function validateContactEmail(
  fieldsJSON: string
): Promise<string> {
  const {
    fields,
    token,
    action,
  }: { fields: ContactFormData; token: string; action: string } =
    JSON.parse(fieldsJSON);

  const result = schema.safeParse({
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    jobDetails: fields.jobDetails,
  });

  const recaptchaResponse = await verifyRecaptcha(token, action);

  //Map zod errors to form errors
  const errors = Object.fromEntries(
    result.error?.issues?.map((issue) => [issue.path[0], issue.message]) || []
  );

  const response: ContactFormResponse = {
    validated: result.success,
    errors: errors,
    recaptchaVerified: recaptchaResponse,
  };

  return JSON.stringify(response);
}

"use server";

import { ContactFormData } from "@/components/contact_form";
import { schema } from "@/utils/contact_form_validation";

export type ContactFormResponse = {
  validated: boolean;
  errors: { [k: string]: string };
  recaptchaSuccessful: boolean;
};

//Validate and return whether successful and any errors
export async function validateContactEmail(
  fieldsJSON: string
): Promise<string> {
  const fields: ContactFormData = JSON.parse(fieldsJSON);

  const result = schema.safeParse({
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    jobDetails: fields.jobDetails,
  });

  //Map zod errors to form errors
  const errors = Object.fromEntries(
    result.error?.issues?.map((issue) => [issue.path[0], issue.message]) || []
  );

  const recaptchaSuccessful: boolean = fields.recaptchaToken
    ? await verifyRecaptcha(fields.recaptchaToken)
    : false;

  const response: ContactFormResponse = {
    validated: result.success,
    errors: errors,
    recaptchaSuccessful: recaptchaSuccessful,
  };

  return JSON.stringify(response);
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  return fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  })
    .then((reCaptchaRes) => reCaptchaRes.json())
    .then((reCaptchaRes) => {
      console.log(
        reCaptchaRes,
        "Response from Google reCaptcha verification API"
      );
      return reCaptchaRes?.score > 0.5;
    });
}

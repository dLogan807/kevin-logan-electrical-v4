"use server";

import { ContactFormData } from "@/components/contact_form";
import { schema } from "@/utils/contact_form_validation";
import { EmailSendResponse, sendContactEmail } from "./send";

export type ContactFormResponse = {
  validated: boolean;
  recaptchaVerified: boolean;
  formErrors: { [k: string]: string };
  sendSuccess: boolean;
  notifyTitle: string;
  notifyMessage: string;
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
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

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

  //Map zod errors to form errors
  const errors = Object.fromEntries(
    result.error?.issues?.map((issue) => [issue.path[0], issue.message]) || []
  );

  //Check recaptcha
  const recaptchaResponse: boolean =
    token === "" ? true : await verifyRecaptcha(token, action);

  var response: ContactFormResponse = {
    validated: result.success,
    formErrors: errors,
    recaptchaVerified: recaptchaResponse,
    sendSuccess: false,
    notifyTitle: "Could not send the email. Please try again.",
    notifyMessage: "A server error occured.",
  };

  //If validated, send email and add to response
  if (result.success && recaptchaResponse) {
    const emailResponse: EmailSendResponse = await sendContactEmail(fields);

    response = { ...response, ...emailResponse };
  }

  return JSON.stringify(response);
}

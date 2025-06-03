"use server";

import { ContactFormData } from "@/components/contact_form/contact_form";
import { schema } from "@/utils/contact_form_validation";
import { EmailSendResponse, sendContactEmail } from "./send";
import { verifyRecaptcha } from "../validate_recaptcha";

export type ContactFormResponse = {
  validated: boolean;
  recaptchaVerified: boolean;
  formErrors: { [k: string]: string };
  sendSuccess: boolean;
  notifyMessage: string;
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

  var response: ContactFormResponse = {
    validated: result.success,
    formErrors: errors,
    recaptchaVerified: false,
    sendSuccess: false,
    notifyMessage:
      Object.keys(errors).length === 0
        ? "Email not sent. reCAPTCHA failed"
        : "Email not sent. Check required fields for errors",
  };

  //Likely bot if filled
  if (fields.website != undefined && fields.website != "") {
    response.notifyMessage = "Email not sent. reCAPTCHA failed";

    return JSON.stringify(response);
  }

  //Check recaptcha
  response.recaptchaVerified = token
    ? await verifyRecaptcha(token, action)
    : true;

  //If validated, send email (message to user will change)
  if (response.validated && response.recaptchaVerified) {
    const emailResponse: EmailSendResponse = await sendContactEmail(fields);

    response = { ...response, ...emailResponse };
  }

  return JSON.stringify(response);
}

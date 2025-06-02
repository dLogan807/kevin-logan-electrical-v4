"use server";

import { ContactFormData } from "@/components/contact_form/contact_form";
import { schema } from "@/utils/contact_form_validation";
import { EmailSendResponse, sendContactEmail } from "./send";
import { verifyRecaptcha } from "../recaptcha/validate";

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

  //Check recaptcha
  const recaptchaResponse: boolean = token
    ? await verifyRecaptcha(token, action)
    : true;

  var response: ContactFormResponse = {
    validated: result.success,
    formErrors: errors,
    recaptchaVerified: recaptchaResponse,
    sendSuccess: false,
    notifyMessage:
      Object.keys(errors).length === 0
        ? "Email not sent. reCAPTCHA failed"
        : "Email not sent. Check required fields for errors",
  };

  //If validated, send email and add to response
  if (result.success && recaptchaResponse) {
    const emailResponse: EmailSendResponse = await sendContactEmail(fields);

    response = { ...response, ...emailResponse };
  }

  return JSON.stringify(response);
}

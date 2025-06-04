"use server";

import { FormResponse, validateForm } from "@/actions/validate_form";
import { FormType } from "@/utils/form_schemas/schemas";
import { ContactFormData } from "@/components/contact_form/contact_form";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export type ContactFormResponse = FormResponse & {
  sendSuccess: boolean;
};

//Validate and return whether successful and any errors
export async function validateContactEmail(
  formValues: ContactFormData,
  token: string,
  action: string
): Promise<ContactFormResponse> {
  const validationResult = await validateForm(
    FormType.CONTACT_US,
    formValues,
    token,
    action
  );

  var response: ContactFormResponse = {
    ...validationResult,
    sendSuccess: false,
  };

  if (!response.validated || !response.recaptchaVerified) {
    return response;
  }

  //Likely bot if filled
  if (formValues.website) {
    response.recaptchaVerified = false;
    return response;
  }

  response.sendSuccess = await sendContactEmail(formValues);

  return response;
}

async function sendContactEmail(fields: ContactFormData): Promise<boolean> {
  if (!fields?.email || !fields.name || !fields.jobDetails || fields.website) {
    return false;
  }

  //Specify transport options
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
    requireTLS: true,
  });

  //Create email
  let bodyText: string =
    "You have received an email from " +
    fields.name +
    ".\n\n" +
    fields.jobDetails +
    "\n\n Email: " +
    fields.email;
  if (fields.phone) {
    bodyText = bodyText + "\n Phone number: " + fields.phone;
  }

  const mailOptions: Mail.Options = {
    from: process.env.EMAIL_ADDRESS,
    to: process.env.EMAIL_ADDRESS,
    subject: "Website enquiry from " + fields.name,
    text: bodyText,
    replyTo: fields.email,
  };

  //Define promise and send email
  return new Promise<boolean>((resolve) => {
    transport.sendMail(mailOptions, function (error) {
      resolve(!error);
    });
  }).catch(() => false);
}

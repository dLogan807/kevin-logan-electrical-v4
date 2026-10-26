"use server";

import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { getServerOnlyEnv } from "@/utils/getServerOnlyEnv";
import { ContactFormValues } from "@/types/formValues";

export async function sendContactEmail(
  fields: ContactFormValues,
): Promise<boolean> {
  if (!fields?.email || !fields.name || !fields.jobDetails || fields.website) {
    return false;
  }

  //Specify transport options
  const transport = nodemailer.createTransport({
    host: getServerOnlyEnv().EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: getServerOnlyEnv().EMAIL_ADDRESS,
      pass: getServerOnlyEnv().EMAIL_PASSWORD,
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

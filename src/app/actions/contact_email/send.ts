"use server";

import { ContactFormData } from "@/components/contact_form/contact_form";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export type EmailSendResponse = {
  sendSuccess: boolean;
  notifyMessage: string;
};

export async function sendContactEmail(
  fields: ContactFormData
): Promise<EmailSendResponse> {
  //Return if fields are not present
  if (!fields || !fields.email || !fields.name || !fields.jobDetails) {
    return {
      sendSuccess: false,
      notifyMessage: "Email not sent. Check required fields for errors",
    };
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
  var bodyText =
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
  return new Promise<EmailSendResponse>((resolve) => {
    transport.sendMail(mailOptions, function (error) {
      if (!error) {
        resolve({
          sendSuccess: true,
          notifyMessage: "Email sent! We'll get back to you soon",
        });
      } else {
        resolve({
          sendSuccess: false,
          notifyMessage: "Could not send the email. Please try again",
        });
      }
    });
  }).catch(() => ({
    sendSuccess: false,
    notifyMessage: "Could not send the email. Please try again",
  }));
}

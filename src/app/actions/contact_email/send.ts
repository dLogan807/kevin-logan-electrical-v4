"use server";

import { ContactFormData } from "@/components/contact_form";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export type EmailSendResponse = {
  sendSuccess: boolean;
  notifyTitle: string;
  notifyMessage: string;
};

export async function sendContactEmail(
  fields: ContactFormData
): Promise<EmailSendResponse> {
  //Return if fields are not present
  if (!fields.email || !fields.name || !fields.jobDetails) {
    return {
      sendSuccess: false,
      notifyTitle: "Could not send the email. Please try again.",
      notifyMessage: "Required fields were missing.",
    };
  }

  //Specify transport options
  const transport = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
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
    from: process.env.EMAIL,
    to: process.env.EMAIL,
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
          notifyTitle: "Email sent!",
          notifyMessage: "We'll get back to you shortly.",
        });
      } else {
        resolve({
          sendSuccess: false,
          notifyTitle: "Could not send the email. Please try again.",
          notifyMessage: "The mail server did not respond.",
        });
      }
    });
  }).catch(() => {
    return {
      sendSuccess: false,
      notifyTitle: "Could not send the email. Please try again.",
      notifyMessage: "A server error occured.",
    };
  });
}

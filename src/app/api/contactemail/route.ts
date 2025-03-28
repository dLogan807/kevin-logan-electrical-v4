import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { ContactFormData } from "@/components/contact_form";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { name, email, phone, jobDetails }: ContactFormData =
    await request.json();

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
    name +
    ".\n\n" +
    jobDetails +
    "\n\n Email: " +
    email;
  if (phone) {
    bodyText = bodyText + "\n Phone number: " + phone;
  }

  const mailOptions: Mail.Options = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "Website enquiry from " + name,
    text: bodyText,
    replyTo: email,
  };

  //Define promise
  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email sent.");
        } else {
          reject(err.message);
        }
      });
    });

  //Attempt to send email
  try {
    await sendMailPromise();
    return NextResponse.json({ message: "Email sent!" });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

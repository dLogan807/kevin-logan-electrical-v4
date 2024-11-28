"use client";

import { Button, Group, Textarea, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  ContactFormResponse,
  validateContactEmail,
} from "@/actions/validate_contact_email";
import { schema } from "@/utils/contact_form_validation";
import { notifications } from "@mantine/notifications";
import { sendContactEmail } from "@/actions/contact_email";
import { IconCheck, IconX } from "@tabler/icons-react";

import classes from "./contact_form.module.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export type ContactFormData = {
  name: string;
  email: string;
  phone: string | null;
  jobDetails: string;
  recaptchaToken?: string;
};

export function ContactForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      phone: "",
      jobDetails: "",
    },
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

  //Obtain recaptcha
  const handleSubmitForm = function (data: ContactFormData) {
    if (!executeRecaptcha) {
      const failureIcon = (
        <IconX className={classes.icon} aria-label="Failure icon" />
      );

      notifications.show({
        title: "Could not send the email.",
        message: "Recaptcha not yet available.",
        autoClose: 6000,
        loading: false,
        withBorder: true,
        color: "red",
        icon: failureIcon,
      });
      return;
    }
    executeRecaptcha("enquiryFormSubmit").then((gReCaptchaToken) => {
      data.recaptchaToken = gReCaptchaToken;

      submitContactForm(data);
    });
  };

  async function submitContactForm(data: ContactFormData) {
    //Server-side validate the form
    var validationResponse: ContactFormResponse = await validateContactEmail(
      JSON.stringify(data)
    )
      .then((jsonResponse) => JSON.parse(jsonResponse))
      .then((response) => {
        return {
          validated: response.validated,
          errors: response.errors,
          recaptchaSuccessful: response.recaptchaSuccessful,
        };
      });

    if (!validationResponse.recaptchaSuccessful) {
      const failureIcon = (
        <IconX className={classes.icon} aria-label="Failure icon" />
      );

      notifications.show({
        title: "Could not send your email.",
        message: "Recaptcha verification failed.",
        autoClose: 6000,
        loading: false,
        withBorder: true,
        color: "red",
        icon: failureIcon,
      });
    } else if (validationResponse.validated) {
      const sendSuccess: boolean = await sendAndNotify(data);

      if (sendSuccess) {
        form.reset();
      }
    } else {
      form.setErrors(validationResponse.errors);
    }
  }

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmitForm(values))}>
      <TextInput
        className={classes.form_field}
        withAsterisk
        label="Your name"
        key={form.key("name")}
        {...form.getInputProps("name")}
      />
      <TextInput
        className={classes.form_field}
        withAsterisk
        label="Email"
        key={form.key("email")}
        {...form.getInputProps("email")}
      />
      <TextInput
        className={classes.form_field}
        label="Phone"
        key={form.key("phone")}
        {...form.getInputProps("phone")}
      />
      <Textarea
        className={classes.form_field}
        withAsterisk
        label="Job details"
        resize="vertical"
        minRows={4}
        autosize
        key={form.key("jobDetails")}
        {...form.getInputProps("jobDetails")}
      />
      <Group>
        <Button className={classes.submit_button} type="submit">
          Send
        </Button>
      </Group>
    </form>
  );
}

//Send email and show progress notifcation
async function sendAndNotify(data: ContactFormData): Promise<boolean> {
  const sendingNotifID = notifications.show({
    title: "Sending your email",
    message: "One moment...",
    autoClose: false,
    loading: true,
    withBorder: true,
  });

  const sendSuccess: boolean = await sendContactEmail(data).then(
    (responseMessage) => {
      const icon = responseMessage.success ? (
        <IconCheck className={classes.icon} aria-label="Success icon" />
      ) : (
        <IconX className={classes.icon} aria-label="Failure icon" />
      );
      const colour: string = responseMessage.success ? "green" : "red";

      notifications.update({
        id: sendingNotifID,
        title: responseMessage.message,
        message: responseMessage.details,
        loading: false,
        autoClose: 6000,
        icon: icon,
        color: colour,
      });

      return responseMessage.success;
    }
  );

  return sendSuccess;
}

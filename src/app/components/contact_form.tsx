"use client";

import { Button, Group, Textarea, TextInput, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  ContactFormResponse,
  validateContactEmail,
} from "@/actions/contact_email/validate";
import { schema } from "@/utils/contact_form_validation";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useReCaptcha } from "next-recaptcha-v3";
import Link from "next/link";
import { useState } from "react";
import classes from "./contact_form.module.css";

export type ContactFormData = {
  name: string;
  email: string;
  phone: string | null;
  jobDetails: string;
};

//Show notifcation
function notifyUser(sendSuccess: boolean, title: string, message: string) {
  const icon = sendSuccess ? (
    <IconCheck className={classes.icon} aria-label="Success icon" />
  ) : (
    <IconX className={classes.icon} aria-label="Failure icon" />
  );
  const colour: string = sendSuccess ? "green" : "red";

  notifications.show({
    title: title,
    message: message,
    icon: icon,
    color: colour,
    withBorder: true,
  });
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { name: "", email: "", phone: "", jobDetails: "" },
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  });
  const { executeRecaptcha, loaded, error } = useReCaptcha();

  async function onSubmit(fields: ContactFormData) {
    if (isSubmitting) return;

    //Disable submit button while submiting
    setIsSubmitting(true);

    //Generate token
    const action = "contact_form_submit";
    const token: string =
      loaded && !error ? await executeRecaptcha(action) : "";

    //Send to server action for validation and sending
    const response: ContactFormResponse = await validateContactEmail(
      JSON.stringify({ fields, token, action })
    ).then((response) => JSON.parse(response));

    //Reset form or show errors
    if (response.validated && response.recaptchaVerified) {
      notifyUser(
        response.sendSuccess,
        response.notifyTitle,
        response.notifyMessage
      );

      if (response.sendSuccess) {
        form.reset();
      }
    } else {
      //Show validation errors
      form.setErrors(response.formErrors);

      if (!response.recaptchaVerified) {
        notifyUser(false, "reCAPTCHA Failed", "Please try again");
      }
    }

    //Enable submit button
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
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
        rows={4}
        key={form.key("jobDetails")}
        {...form.getInputProps("jobDetails")}
      />
      {/* prettier-ignore */}
      <Text className={classes.recaptcha_disclaimer}>
        This site is protected by reCAPTCHA and the Google <Link href="https://policies.google.com/privacy">Privacy Policy</Link> and <Link href="https://policies.google.com/terms">Terms of Service</Link> apply.
      </Text>
      <Group>
        <Button
          className={classes.submit_button}
          type="submit"
          loading={isSubmitting}
        >
          Send
        </Button>
      </Group>
    </form>
  );
}

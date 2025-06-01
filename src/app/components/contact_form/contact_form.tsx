"use client";

import { Button, Group, Textarea, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  ContactFormResponse,
  validateContactEmail,
} from "@/actions/contact_email/validate";
import { schema } from "@/utils/contact_form_validation";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useReCaptcha } from "next-recaptcha-v3";
import { useState, useCallback } from "react";
import classes from "./contact_form.module.css";
import RecaptchaDisclaimer from "../recaptcha/disclaimer";

export type ContactFormData = {
  name: string;
  email: string;
  phone: string | null;
  jobDetails: string;
};

//Show notifcation
function notifyUser(sendSuccess: boolean, title: string, message: string) {
  const icon = sendSuccess ? (
    <IconCheck className={classes.icon} aria-label="Success" />
  ) : (
    <IconX className={classes.icon} aria-label="Failure" />
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

  const onSubmit = useCallback(
    async (fields: ContactFormData) => {
      if (isSubmitting) return;

      //Disable submit button while submiting
      setIsSubmitting(true);

      //Generate recaptcha token
      const action: string = "contact_form_submit";
      const token: string =
        loaded && !error
          ? await executeRecaptcha(action).catch(() => {
              return "";
            })
          : "";

      //Send to server action for validation and sending
      const response: ContactFormResponse = await validateContactEmail(
        JSON.stringify({ fields, token, action })
      )
        .then((response) => JSON.parse(response))
        .catch(() => {
          return {
            validated: true,
            recaptchaVerified: true,
            formErrors: {},
            sendSuccess: false,
            notifyTitle: "Connection timed out",
            notifyMessage: "Check your internet connection",
          };
        });

      //Reset form or show errors
      if (response.validated && response.recaptchaVerified) {
        if (response.sendSuccess) form.reset();

        notifyUser(
          response.sendSuccess,
          response.notifyTitle,
          response.notifyMessage
        );
      } else {
        form.setErrors(response.formErrors);

        if (!response.recaptchaVerified) {
          notifyUser(false, "reCAPTCHA failed", "Please try again");
        }
      }

      //Enable submit button
      setIsSubmitting(false);
    },
    [isSubmitting, loaded, error, executeRecaptcha, form]
  );

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <TextInput
        className={classes.form_field}
        withAsterisk
        label="Your name"
        key={form.key("name")}
        {...form.getInputProps("name")}
        disabled={isSubmitting}
      />
      <TextInput
        className={classes.form_field}
        withAsterisk
        label="Email"
        key={form.key("email")}
        {...form.getInputProps("email")}
        disabled={isSubmitting}
      />
      <TextInput
        className={classes.form_field}
        label="Phone"
        key={form.key("phone")}
        {...form.getInputProps("phone")}
        disabled={isSubmitting}
      />
      <Textarea
        className={classes.form_field}
        withAsterisk
        label="Job details"
        resize="vertical"
        rows={4}
        key={form.key("jobDetails")}
        {...form.getInputProps("jobDetails")}
        disabled={isSubmitting}
      />
      <RecaptchaDisclaimer />
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

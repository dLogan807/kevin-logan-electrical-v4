"use client";

import { Button, Group, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  ContactFormResponse,
  validateContactEmail,
} from "@/actions/contact_email/validate";
import { schema } from "@/utils/contact_form_validation";
import { useReCaptcha } from "next-recaptcha-v3";
import { useState, useCallback } from "react";
import classes from "./contact_form.module.css";
import RecaptchaDisclaimer from "../recaptcha/disclaimer";
import { FormAlert, FormMessage } from "@/components/form/form_alert";
import Honeypot from "../form/honeypot";

export type ContactFormData = {
  name: string;
  email: string;
  phone: string | null;
  jobDetails: string;
  website?: string;
};

export function ContactForm() {
  const { executeRecaptcha, loaded, error } = useReCaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      phone: "",
      jobDetails: "",
      website: "",
    },
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  });
  const [formMessage, setFormMessage] = useState<FormMessage>({});

  const onSubmit = useCallback(
    async (fields: ContactFormData) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      setFormMessage({});

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
            notifyMessage: "Email not sent. Check your internet connection",
          };
        });

      //Reset form or show errors
      if (response.validated && response.recaptchaVerified) {
        if (response.sendSuccess) form.reset();
      } else {
        form.setErrors(response.formErrors);
      }

      setFormMessage({
        message: response.notifyMessage,
        isError: !response.sendSuccess,
      });

      //Enable submit button
      setIsSubmitting(false);
    },
    [isSubmitting, loaded, error, executeRecaptcha, form]
  );

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <Stack>
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
        <Honeypot form={form} label="Website" fieldKey="website" />
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
        <FormAlert formMessage={formMessage} />
        <Group>
          <Button
            className={classes.submit_button}
            type="submit"
            loading={isSubmitting}
          >
            Send
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

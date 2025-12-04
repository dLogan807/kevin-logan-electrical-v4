"use client";

import { Button, Group, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  ContactFormResponse,
  validateContactEmail,
} from "@/actions/contact_email/send_and_validate";
import { useReCaptcha } from "next-recaptcha-v3";
import { useState } from "react";
import classes from "./contact_form.module.css";
import RecaptchaDisclaimer from "../recaptcha/disclaimer";
import { FormAlert, FormMessage } from "@/components/form/form_alert";
import Honeypot from "../form/honeypot";
import { FormType, getFormSchema } from "@/utils/form_schemas/schemas";

export type ContactFormData = {
  name: string;
  email: string;
  phone: string | null;
  jobDetails: string;
  website?: string;
};

function getFormMessage(response: ContactFormResponse): FormMessage {
  if (response.submitError) {
    return {
      message: "Email not sent. Check your internet connection",
      isError: true,
    };
  } else if (!response.validated) {
    return {
      message: "Email not sent. Check required fields for errors",
      isError: true,
    };
  } else if (!response.recaptchaVerified) {
    return { message: "Email not sent. reCAPTCHA failed", isError: true };
  } else if (!response.sendSuccess) {
    return {
      message: "Something went wrong. Please try again",
      isError: true,
    };
  } else {
    return { message: "Email sent! We'll get back to you soon" };
  }
}

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
    validate: zod4Resolver(getFormSchema(FormType.CONTACT_US)),
    validateInputOnBlur: true,
  });
  const [formMessage, setFormMessage] = useState<FormMessage>({});

  const onSubmit = async (fields: ContactFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormMessage({});

    //Generate recaptcha token
    const action = "contact_form_submit";
    const token =
      loaded && !error ? await executeRecaptcha(action).catch(() => "") : "";

    //Send to server action for validation and sending
    const response: ContactFormResponse = await validateContactEmail(
      fields,
      token,
      action
    ).catch(() => ({
      validated: false,
      formErrors: {},
      recaptchaVerified: false,
      submitError: true,
      sendSuccess: false,
    }));

    setFormMessage(getFormMessage(response));
    form.setErrors(response.formErrors);

    if (response.sendSuccess) {
      form.reset();
    }

    setIsSubmitting(false);
  };

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

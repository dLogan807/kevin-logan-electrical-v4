"use client";

import { Button, Group, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useLayoutEffect, useState } from "react";
import { SuccessOrFailureAlert } from "@/components/alerts/SuccessOrFailureAlert/SuccessOrFailureAlert";
import HoneypotInput from "@/components/inputs/HoneyPotInput/HoneypotInput";
import { SuccessOrFailureAlertState } from "@/types/successOrFailureAlertState";
import CloudflareTurnstileWidget from "@/components/cloudflare/CloudflareTurnstileWidget/CloudflareTurnstileWidget";
import { contactFormSchema } from "@/utils/schemas/form/contactFormSchema";
import { ContactFormValues } from "@/types/formValues";
import { validateContactEmail } from "@/actions/form/validateContactFormAndSend";
import { ContactFormResponse } from "@/types/formReponse";
import classes from "./ContactForm.module.css";

export function ContactForm() {
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      phone: "",
      jobDetails: "",
      turnstileToken: "",
      website: "",
    },
    validate: zod4Resolver(contactFormSchema),
    validateInputOnBlur: true,
  });
  const [formAlertState, setFormAlertState] =
    useState<SuccessOrFailureAlertState>({});

  // Reset state once hidden
  useLayoutEffect(() => {
    return () => {
      form.reset();
      setCanSubmit(false);
      setFormAlertState({});
    };
  }, []);

  async function handleSubmit(formValues: ContactFormValues) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormAlertState({});

    //Send to server action for validation and sending
    const response = await validateContactEmail(formValues).catch(() => ({
      validated: false,
      formErrors: {},
      turnstileVerfied: false,
      submitError: true,
      sendSuccess: false,
    }));

    setFormAlertState(getFormMessage(response));
    form.setErrors(response.formErrors);

    if (response.sendSuccess) {
      form.reset();
    }

    setIsSubmitting(false);
  }

  function handleTurnstileTokenChange(token: string) {
    form.setFieldValue("turnstileToken", token);

    setCanSubmit(!!token);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
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
        <HoneypotInput key={form.key("website")} label="Website" />
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
        <CloudflareTurnstileWidget
          onTurnstileTokenChange={handleTurnstileTokenChange}
        />
        <SuccessOrFailureAlert state={formAlertState} />
        <Group>
          <Button
            className={classes.submit_button}
            type="submit"
            loading={isSubmitting}
            disabled={!canSubmit}
          >
            Send
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function getFormMessage(
  response: ContactFormResponse,
): SuccessOrFailureAlertState {
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
  } else if (!response.turnstileVerfied) {
    return {
      message: "Email not sent. Turnstile captcha failed",
      isError: true,
    };
  } else if (!response.sendSuccess) {
    return {
      message: "Something went wrong. Please try again",
      isError: true,
    };
  } else {
    return { message: "Email sent! We'll get back to you soon" };
  }
}
